import React, {useRef, useState, useEffect} from 'react';
import {firebaseDb} from "../../../firebase";
import {useAuth} from "../../../contexts/AuthContext";
import { useHistory } from "react-router-dom"
import ChatMessage from '../../chatApp/ChatMessage';
// import "../../../style/chatRoom.scss"

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

const ChatRoute = (props) => {
    const chatref = useRef();
    const {currentUser} = useAuth();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const roomID = props.match.params.roomID;

    const history = useHistory();

    useEffect(() => {
        firebaseDb.child("messages").child(roomID).on("child_added", snap=>{
            messages.push(snap.val());
            console.log(snap.val());
            setMessages([...messages]);
        })
    }, [])

    const sendMessage = async (e) => {
        e.preventDefault();
        if(message !== ""){
            const messageDetail = {
                message: message, 
                sender: firebaseDb.child("user").child(currentUser.email.replace(/[&$\[\]]/g, '')).val(), 
                timestamp: getMessageDateOrTime(new Date()), 
                senderEmail: currentUser.email };  
            firebaseDb.child("messages").child(roomID).push(messageDetail);
        }
        setMessage('');
        chatref.current.scrollIntoView({ behavior: 'smooth' });
    }

    const handleExit = () => {
        history.push("/");
    }

    return (<div className="chat-room">
            <header>
                <h1>{roomID}</h1>
                <button type="button" onClick={handleExit}>Home</button>
            </header>
            <main>
                {messages && messages.map((msg, index) => <ChatMessage key={msg.timestamp + index} message={msg} />)}
                <span ref={chatref}></span>
            </main>
            <form onSubmit={sendMessage}>
                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="say something nice" />
                <button type="submit">SEND</button>
            </form>
    </div>)
}

export default ChatRoute;