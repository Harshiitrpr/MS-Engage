import React, { useState } from 'react';
import {Drawer, IconButton, Divider} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {FormHelperText,  FormControl, Select, Button, TextField, InputLabel, MenuItem} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

const ChatBox = (props) => {
    // const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const handleChatButton = () => {
        props.setChatBoxVisible(!props.chatBoxVisible);
    }

    const sendMessage = (e)=> {
        // console.log("sendMessage called");
        e.preventDefault();
        if(message !== ""){
            const messageDetail = {message: message, sender: props.myName, timestamp: new Date(), senderId: props.socketRef.current.id };   
            props.socketRef.current.emit("sending message", messageDetail);
            setMessage("");
            // setMessages([...messages, messageDetail]);
        }
        return false;
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

    // return <h1>I M ME</h1>
    return(
        
        <Drawer
            // className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={props.chatBoxVisible}
            // classes={{
            //     paper: classes.drawerPaper,
            // }}
        >
            <div>
                <IconButton onClick={handleChatButton}>
                    <ChevronRightIcon />
                </IconButton>
            </div>
            <Divider />
            <div className="chat-drawer-list">
                {
                    props.messages?.map((chatDetails, index) => {
                        const { sender, message, timestamp, senderId } = chatDetails;
                        return (
                            <div key={index + senderId} className="message-container">
                                <div className={`message-wrapper ${senderId === props.socketRef.current.id ? 'message-wrapper-right' : ''}`}>
                                    <div className="message-title-wrapper">
                                        <h5 className="message-name">{sender}</h5>
                                        <span className="message-timestamp">{getMessageDateOrTime(timestamp)}</span>
                                    </div>
                                    <p className="actual-message">{message}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <Divider />
            <div>
                <form  noValidate autoComplete="off" onSubmit={sendMessage}>
                    <TextField id="chat-input" label="Type Here" value= {message} onChange={(e) => {setMessage(e.target.value)}} />
                    <IconButton type = "submit" onSubmit={() => sendMessage}><SendIcon /></IconButton>
                </form>
            </div>
        </Drawer>
        
    )
}

export default ChatBox;
