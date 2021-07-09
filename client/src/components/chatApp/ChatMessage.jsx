import React from "react";

const ChatMessage = (props) => {
    const { sender, message, timestamp, senderEmail } = props.message;

    return (<>
        <div className={`message-wrapper ${senderEmail === props.email ? 'message-wrapper-right' : ''}`}>
            <div className="message-title-wrapper">
                <h5 className="message-name">{sender}</h5>
                <span className="message-timestamp">{timestamp}</span>
            </div>
            <p className="actual-message">{message}</p>
        </div>
    </>)
}

export default ChatMessage;