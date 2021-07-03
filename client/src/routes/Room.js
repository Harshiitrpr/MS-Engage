import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import FootBar from '../components/navbar/footbar';
import ChatBox from "../components/chat/chatBox";
//material ui
import {FormHelperText,  FormControl, Select, Button, TextField, InputLabel, MenuItem} from '@material-ui/core';
import {Drawer, IconButton, Divider} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';

// Icons imports
import CallIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ChatIcon from '@material-ui/icons/Chat';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SendIcon from '@material-ui/icons/Send';
import { CircularProgress } from '@material-ui/core';

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

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


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
    const [micStatus, setMicStatus] = useState(true);
    const [camStatus, setCamStatus] = useState(true);

    //~beta 2~ alpha
    const [myName, setMyName] = useState("");
    const [myVideo, setMyVideo] = useState("camera");
    const [submited, setSubmited] = useState(false);

    //beta 3
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [chatBoxVisible, setChatBoxVisible] = useState(true);
    // const [streaming, setStreaming] = useState(false);
    // const [chatToggle, setChatToggle] = useState(false);
    // const [userDetails, setUserDetails] = useState(null);
    // const [displayStream, setDisplayStream] = useState(false);
    // const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("use effect is being called");
        if(submited){
            socketRef.current = io.connect("/");
            // console.log(myVideo);
            const media = (myVideo === "camera") ? navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true })
            : navigator.mediaDevices.getDisplayMedia()
            media.then(stream => {
                userVideo.current.srcObject = stream;
                userStream.current = stream;

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

                socketRef.current.on("receiving message", messageDetail => {
                    console.log("client recieved message");
                    messages.push(messageDetail);
                    notify(messageDetail);
                    setMessages([...messages]);
                    // console.log(messages);
                })
            
    
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

    const notify = async(messageDetail) => {
        console.log(chatBoxVisible);
        if(chatBoxVisible){
            toast(<div>
                <div>{messageDetail.sender}</div>
                <div>{messageDetail.message}</div>
            </div>, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
        }
    }

    function createPeer(userToSignal, callerID, stream) {
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

    function addPeer(incomingSignal, callerID, stream) {
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

    function muteMic() {
        userVideo.current.srcObject.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setMicStatus(!micStatus);
    }

    function muteCam() {
        userVideo.current.srcObject.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setCamStatus(!camStatus);
    }

    const shareScreen = () => {
        console.log("screen share clicked");
        if(myVideo === "camera"){
            // console.log("local storage me save ho gya");
            const url = "http://localhost:3000/room/" + roomID;
            localStorage.setItem("sharescreen", true);
            localStorage.setItem("myName", myName);
            window.open(url, '_blank');
        }
        else{
            window.close();
        }
    }

    const sendMessage = (e)=> {
        // console.log("sendMessage called");
        e.preventDefault();
        if(message !== ""){
            const messageDetail = {message: message, sender: myName, timestamp: new Date(), senderId:socketRef.current.id };   
            socketRef.current.emit("sending message", messageDetail);
            setMessage("");
            // setMessages([...messages, messageDetail]);
        }
        return false;
    }

    const handleChatButton = () => {
        // console.log(chatBoxVisible);
        setChatBoxVisible(!chatBoxVisible);
        // console.log(chatBoxVisible)
    }

    const handleEndCall = () => {
        console.log("emmiting end call");
        socketRef.current.emit("disconnect");
    }

    function getMessageDateOrTime(date) {
        if (date !== null) {
            const dateObj = new Date(date);
            const dateDetails = {
                date: dateObj.getDate(),
                month: dateObj.getMonth() + 1,
                year: dateObj.getFullYear(),
                hour: dateObj.getHours(),
                minutes: dateObj.getMinutes()
            }
            const currentDateObj = new Date();
            const currentDateDetails = {
                date: currentDateObj.getDate(),
                month: currentDateObj.getMonth() + 1,
                year: currentDateObj.getFullYear(),
                hour: currentDateObj.getHours(),
                minutes: currentDateObj.getMinutes()
            }
            if (dateDetails.year !== currentDateDetails.year && dateDetails.month !== currentDateDetails.month && dateDetails.date !== currentDateDetails.date) {
                return dateDetails.date + '-' + dateDetails.month + '-' + dateDetails.year;
            } else {
                return dateDetails.hour + ':' + dateDetails.minutes + ` ${dateDetails.hour < 12 ? 'AM' : 'PM'}`
            }
        }
        return '';
    }

    if(submited)
    return (
        <Container>
            <div id="room-container">
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            {/* <ChatBox/> */}
            <div>{myName}</div>
            </div>
            {/* { displayStream && <StyledVideo muted ref={userScreen} autoPlay playsInline />  } */}
            {peers.map((peer) => {
                return (
                    <section key={peer.peerID}>
                    <Video peer={peer.peer} />
                    <div>{peer.name}</div>
                    </section>
                );
            })}
            <FootBar className="chat-footbar">
            <div className="footbar-title">Vi CHAT</div>
                <div className="footbar-wrapper">
                    { <div className="status-action-btn mic-btn" onClick={muteMic} title={micStatus ? 'Disable Mic' : 'Enable Mic'}>
                        {micStatus ? 
                            <MicIcon></MicIcon>
                            :
                            <MicOffIcon></MicOffIcon>
                        }
                    </div>}
                    <div className="status-action-btn end-call-btn" title="End Call">
                        <CallIcon onClick= {handleEndCall}></CallIcon>
                    </div>
                    {<div className="status-action-btn cam-btn" onClick={muteCam} title={camStatus ? 'Disable Cam' : 'Enable Cam'}>
                        {camStatus ? 
                            <VideocamIcon></VideocamIcon>
                            :
                            <VideocamOffIcon></VideocamOffIcon>
                        }
                    </div>}
                </div>
                <div>
                    <div className="screen-share-btn">
                        <h4 className="screen-share-btn-text" onClick={shareScreen} >{myVideo === "screen" ? 'Stop Screen Share' : 'Share Screen'}</h4>
                    </div>
                    <div  className="chat-btn" title="Chat" onClick={handleChatButton}>
                        <ChatIcon></ChatIcon>
                    </div>
                </div>
            </FootBar>
            {/* <h1>Why this colaveri</h1> */}
            <ChatBox 
                chatBoxVisible = {chatBoxVisible} 
                messages={messages} 
                chatBoxVisible = {chatBoxVisible}
                setChatBoxVisible = {setChatBoxVisible} 
                socketRef= {socketRef}
                myName= {myName}
                messages= {messages}
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
        return <FormControl>
            <TextField label= "Enter your name" value={myName} onChange={(e) => setMyName(e.target.value)} />
            {/* <InputLabel id="videoType">Age</InputLabel> */}
            <Select
                labelId="videoType"
                id="videoType-select"
                value={myVideo}
                onChange={(e) => setMyVideo(e.target.value)}
            >
            <MenuItem value="screen">Share Screen</MenuItem>
            <MenuItem value="camera">Use Camera</MenuItem>
            </Select>
            <Button variant="contained" color="primary" onClick={() =>{setSubmited(true)}}>
                Join meeting
            </Button>
        </FormControl>
    }
};

export default Room;