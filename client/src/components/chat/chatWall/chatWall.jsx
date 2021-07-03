const ChatWall = (props) => {
    return(
        <div className="chat-drawer-list">
            {
                props.messages?.map((chatDetails, index) => {
                    const { sender, message, timestamp, senderId } = chatDetails;
                    return (
                        <div key={index + senderId} className="message-container">
                            <div className={`message-wrapper ${senderId === props.id ? 'message-wrapper-right' : ''}`}>
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
    )
}

export default ChatWall;