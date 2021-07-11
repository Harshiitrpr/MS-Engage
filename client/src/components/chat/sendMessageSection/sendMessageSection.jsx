import React, {useState} from "react";
import {IconButton, Input} from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import {getMessageDateOrTime} from "../../../utils/helperFunctions";

const SendMessageSection = (props) => {
    const [message, setMessage] = useState("");

    

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
        width: "90%",
        backgroundColor:"#ffffff"
        // borderTop: "1px solid gray",
        }}>
                <Input placeholder="  Type Here" fullWidth inputProps={{ 'aria-label': 'description' }} value= {message} onChange={(e) => {setMessage(e.target.value) }}/>
                <IconButton type = "submit" onSubmit={() => sendMessage}><SendIcon fontSize="large" /></IconButton>
            </form>
        </div>
    )
}

export default SendMessageSection;