import React, {useEffect, useState} from "react";
//toast trigger
import { notifyMessage as notify } from "../../notifications/messageToast";

const ChatWall = (props) => {
    const { messageDb} = props;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        messageDb.on("child_added", snap=>{
            messages.push(snap.val());
            console.log(snap.val());
            setMessages([...messages]);
        })
        // socketRef.current.on("receiving message", messageDetail => {
        //     console.log("client recieved message");
        //     messages.push(messageDetail);
        //     notify(messageDetail);
        //     setMessages([...messages]);
        // })
    }, [])

    return(
        <div className="chat-drawer-list">
            {
                messages?.map((chatDetails, index) => {
                    const { sender, message, timestamp, senderEmail } = chatDetails;
                    return (
                        <div key={index + timestamp} className="message-container">
                            <div className={`message-wrapper ${senderEmail === props.email ? 'message-wrapper-right' : 'message-wrapper-left'}`}>
                                <div className="message-title-wrapper">
                                    <h5 className="message-name">{sender}</h5>
                                    <span className="message-timestamp">{timestamp}</span>
                                </div>
                                <p className="actual-message">{message}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ChatWall;