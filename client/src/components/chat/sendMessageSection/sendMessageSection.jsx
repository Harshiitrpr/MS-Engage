import React, {useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';

const SendMessageSection = (props) => {
    const [message, setMessage] = useState("");

    const sendMessage = (e)=> {
        e.preventDefault();
        if(message !== ""){
            const messageDetail = {message: message, sender: props.myName, timestamp: new Date(), senderId: props.socketRef.current.id };   
            props.socketRef.current.emit("sending message", messageDetail);
            setMessage("");
        }
        return false;
    }

    return(
        <div>
            <form  noValidate autoComplete="off" onSubmit={sendMessage}>
                <TextField id="chat-input" label="Type Here" value= {message} onChange={(e) => {setMessage(e.target.value)}} />
                <IconButton type = "submit" onSubmit={() => sendMessage}><SendIcon /></IconButton>
            </form>
        </div>
    )
}

export default SendMessageSection;