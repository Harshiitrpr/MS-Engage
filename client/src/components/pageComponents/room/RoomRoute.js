import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import UserDetailsBeforeJoining from "./userDetails";
import FootConfigurationBar from '../../navbar/footbar';
import ChatDrawer from "../../chat/chatDrawer";
import VideoGrid from "./conference"

import "firebase/database"
//material ui

import { ToastContainer } from 'react-toastify';

// jsx of react-toastify
import 'react-toastify/dist/ReactToastify.css';
const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};


const Room = (props) => {
    // console.log(props.match);
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const userStream = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;
    //~beta 1~ alpha

    //~beta 2~ alpha
    const [myName, setMyName] = useState("");
    const [myVideo, setMyVideo] = useState("Camera");
    const [submited, setSubmited] = useState(false);
    const [micToggle, setMicToggle] = useState(false);
    const [videoToggle, setVideoToggle] = useState(false);

    //beta 3
    // const [messages, setMessages] = useState([]);
    const [chatBoxVisible, setChatBoxVisible] = useState(false);

    try{
        const {state} = props.location;
        setVideoToggle(state.videoToggle);
        setMicToggle(state.micToggle);
        setMyName(state.myName);
        setMyVideo(state.myVideo);
    }catch(err){
        console.log(err)
    }

    useEffect(() => {
        if(submited){
            socketRef.current = io.connect("/");
            const media = (myVideo === "Camera") ? navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true })
            : navigator.mediaDevices.getDisplayMedia()
            media.then(stream => {
                userVideo.current.srcObject = stream;
                userStream.current = stream;

                userVideo.current.srcObject.getVideoTracks().forEach(track => track.enabled = videoToggle);
                userVideo.current.srcObject.getAudioTracks().forEach(track => track.enabled = micToggle);

                socketRef.current.emit("join room", roomID, myName);
                socketRef.current.on("all users", users => {
                    const peers = [];
                    users.forEach(user => {
                        const peer = createPeer(user.id, socketRef.current.id, stream);
                        peersRef.current.push({
                            peerID: user.id,
                            name: user.name,
                            peer,
                        })
                        peers.push({
                            peerID: user.id,
                            name: user.name,
                            peer,
                        });
                    })
                    setPeers(peers);
                })
    
                socketRef.current.on("user joined", payload => {
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        name: payload.name,
                        peer,
                    })
    
                    const peerObj = {
                        peer,
                        name: payload.name,
                        peerID: payload.callerID,
                    }
                    const peers = peersRef.current.filter(p => p.peerID !== payload.callerID);
                    setPeers([...peers, peerObj]);
                });
    
                socketRef.current.on("receiving returned signal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                });

                socketRef.current.on("user left", id => {
                    const peerObj = peersRef.current.find(p => p.peerID === id);
                    if(peerObj) {
                        peerObj.peer.destroy();
                    }
                    const peers = peersRef.current.filter(p => p.peerID !== id);
                    peersRef.current = peers;
                    setPeers(peers);
                });
            });
        }
        else{
            if(localStorage.getItem("sharescreen")){
                setMyName(localStorage.getItem("myName"));
                setMyVideo("screen");
                localStorage.removeItem("myName");
                localStorage.removeItem("sharescreen");
                setSubmited(true);
            }
        }
    }, [submited]);

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal, name:myName })
        })

        return peer;
    }

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }
    
    if(submited)
    return (
        <Container fullWidth style={{
            backgroundColor:"	#1b1a1a",
            width:"100%",
        }}>
            <VideoGrid
                myName = {myName}
                peers= {peers}
                userVideo= {userVideo}
            />
            {console.log("main page", roomID)}
            <FootConfigurationBar
                myName = {myName}
                socketRef={socketRef}
                myVideo= {myVideo}
                userVideo= {userVideo}
                chatBoxVisible = {chatBoxVisible}
                setChatBoxVisible= {setChatBoxVisible}
                roomID= {roomID}
            />
            <ChatDrawer
                // messages={messages}
                // setMessages={setMessages} 
                chatBoxVisible = {chatBoxVisible}
                setChatBoxVisible = {setChatBoxVisible}
                socketRef= {socketRef}
                myName= {myName}
                roomID= {roomID}
            />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover
            />
        </Container>
    );
    else{
        return <UserDetailsBeforeJoining
            myName = {myName}
            setMyName={setMyName}
            myVideo={myVideo}
            setMyVideo={setMyVideo}
            micToggle= {micToggle}
            videoToggle= {videoToggle}
            setMicToggle= {setMicToggle}
            setVideoToggle= {setVideoToggle}
            setSubmited= {setSubmited}
        />
    }
};

export default Room;