//toast trigger
import { notifyMessage as notify } from "../../notifications/messageToast";
const ChatWall = (props) => {
    const {messages, setMessages, socketRef} = props;
    useEffect(() => {
        socketRef.current.on("receiving message", messageDetail => {
            console.log("client recieved message");
            messages.push(messageDetail);
            notify(messageDetail);
            setMessages([...messages]);
            // console.log(messages);
        })
    },[])

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

    return(
        <div className="chat-drawer-list">
            {
                messages?.map((chatDetails, index) => {
                    const { sender, message, timestamp, senderId } = chatDetails;
                    return (
                        <div key={index + senderId} className="message-container">
                            <div className={`message-wrapper ${senderId === socketRef.current.id ? 'message-wrapper-right' : ''}`}>
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