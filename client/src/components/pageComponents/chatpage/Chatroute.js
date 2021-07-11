import React, {useRef, useState, useEffect} from 'react';
import {firebaseDb} from "../../../firebase";
import {useAuth} from "../../../contexts/AuthContext";
import { getMessageDateOrTime } from "../../../utils/helperFunctions"
import { useHistory } from "react-router-dom"
import ChatMessage from './ChatMessage';
import "../../../style/chatRoom.scss"

import {IconButton, Input} from "@material-ui/core";
import { Button } from 'react-bootstrap';
import SendIcon from '@material-ui/icons/Send';




const ChatRoute = (props) => {
    // console.log(props);
    const chatref = useRef();
    const {currentUser} = useAuth();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const roomID = props.match.params.roomID;
    const myName = props.location.state.myName;
    const history = useHistory();

    useEffect(() => {
        firebaseDb.child("messages").child(roomID).on("child_added", snap=>{
            messages.push(snap.val());
            console.log(snap.val());
            setMessages([...messages]);
            chatref.current.scrollIntoView({ behavior: 'smooth' });
        })
    }, [])

    const sendMessage = async (e) => {
        e.preventDefault();
        if(message !== ""){
            const messageDetail = {
                message: message, 
                sender: myName,
                timestamp: getMessageDateOrTime(new Date()), 
                senderEmail: currentUser.email 
            };  
            firebaseDb.child("messages").child(roomID).push(messageDetail);
        }
        setMessage('');
        // chatref.current.scrollIntoView({ behavior: 'smooth' });
    }

    const handleExit = () => {
        history.push("/");
    }

    return (
    <div className="whole-screen">
    <div className="chat-room mt-3">
            <header className="chat-room-header">
                <h1 className="room-id">{roomID}</h1>
                <Button className="home-button"  variant="outline-secondary"  onClick={handleExit}>Home</Button>
            </header>
            <div className="chat-room-main">
                {messages && messages.map((msg, index) => <ChatMessage key={msg.timestamp + index} message={msg} email={currentUser.email}/>)}
                <span ref={chatref}></span>
            </div>
            <form className="chat-room-form" onSubmit={sendMessage}>
            <Input placeholder="  Type Here" fullWidth inputProps={{ 'aria-label': 'description' }} value= {message} onChange={(e) => {setMessage(e.target.value) }}/>
                {/* <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="say something nice" /> */}
                <IconButton type = "submit" onSubmit={() => sendMessage}><SendIcon fontSize="large" /></IconButton>
                
            </form>
    </div>
    </div>)
}

export default ChatRoute;