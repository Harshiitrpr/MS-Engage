import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import FootBar from '../components/navbar/footbar';

// Icons imports
import CallIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ChatIcon from '@material-ui/icons/Chat';
import { CircularProgress } from '@material-ui/core';

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
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;

    //beta 1
    const [micStatus, setMicStatus] = useState(true);
    const [camStatus, setCamStatus] = useState(true);
    const [streaming, setStreaming] = useState(false);
    const [chatToggle, setChatToggle] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [displayStream, setDisplayStream] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socketRef.current = io.connect("/");
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push({
                        peerID: userID,
                        peer,
                    });
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                const peerObj = {
                    peer,
                    peerID: payload.callerID
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
            })
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
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

    // const handleMyMic = () => {
    //     const { getMyVideo, reInitializeStream } = socketInstance.current;
    //     if (userVideo) userVideo.srcObject?.getAudioTracks().forEach((track) => {
    //         if (track.kind === 'audio')
    //             // track.enabled = !micStatus;
    //             micStatus ? track.stop() : reInitializeStream(camStatus, !micStatus);
    //     });
    //     setMicStatus(!micStatus);
    // }

    function muteMic() {
        userVideo.current.srcObject.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setMicStatus(!micStatus);
    }

    function muteCam() {
        userVideo.current.srcObject.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setCamStatus(!camStatus);
    }

    return (
        <Container>
            <div id="room-container"></div>
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return (
                    <Video key={peer.peerID} peer={peer.peer} />
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
                        <CallIcon></CallIcon>
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
                        <h4 className="screen-share-btn-text">{displayStream ? 'Stop Screen Share' : 'Share Screen'}</h4>
                    </div>
                    <div  className="chat-btn" title="Chat">
                        <ChatIcon></ChatIcon>
                    </div>
                </div>
            </FootBar>
        </Container>
        
    );
};

export default Room;
