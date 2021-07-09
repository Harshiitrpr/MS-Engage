import React, {useState} from "react";
import {IconButton, Input} from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';

const SendMessageSection = (props) => {
    const [message, setMessage] = useState("");

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

    const sendMessage = (e)=> {
        e.preventDefault();
        if(message !== ""){
            const messageDetail = {
                message: message,
                sender: props.myName, 
                timestamp: getMessageDateOrTime(new Date()), 
                senderEmail: props.email
                // senderId: props.socketRef.current.id, 
            };  
            props.messageDb.push(messageDetail);
            // props.socketRef.current.emit("sending message", messageDetail);
            setMessage("");
        }
        return false;
    }

    return(
        <div className="chat-drawer-input">
            <form  noValidate autoComplete="off" onSubmit={sendMessage} style={{display: "flex", position: "absolute", margin: "5",
        right: "10px",
        bottom: "20px",
        width: "90%"}}>
                <Input placeholder="Type Here" fullWidth inputProps={{ 'aria-label': 'description' }} value= {message} onChange={(e) => {setMessage(e.target.value) }}/>
                <IconButton type = "submit" onSubmit={() => sendMessage}><SendIcon fontSize="large" /></IconButton>
            </form>
        </div>
    )
}

export default SendMessageSection;