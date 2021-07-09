import React, {useState} from 'react';
import { Toolbar, IconButton } from '@material-ui/core';

//icon imports
import CallIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ChatIcon from '@material-ui/icons/Chat';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';

const FootConfigurationBar = (props) => {
    const { socketRef, myVideo, userVideo, chatBoxVisible, setChatBoxVisible, roomID, myName } = props;

    const [micStatus, setMicStatus] = useState(true);
    const [camStatus, setCamStatus] = useState(true);
    console.log(roomID);

    const muteMic = () => {
        userVideo.current.srcObject.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setMicStatus(!micStatus);
    }

    const muteCam = () => {
        userVideo.current.srcObject.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setCamStatus(!camStatus);
    }

    const shareScreen = () => {
        if(myVideo === "camera"){
            const url = "http://localhost:3000/room/" + roomID;
            localStorage.setItem("sharescreen", true);
            localStorage.setItem("myName", myName);
            window.open(url, '_blank');
        }
        else{
            window.close();
        }
    }

    const handleChatButton = () => {
        setChatBoxVisible(!chatBoxVisible);
    }

    const handleEndCall = () => {
        socketRef.current.disconnect();
        props.history.push("/exit");
    }

    return(
        <section className="chat-footbar" style={{
            position:"absolute",
            bottom:"10px",
            width:"85%",
            backgroundColor: "blue",
            margin:"0 auto",
            justifyContent: "center",
        }}>
            <div className="footbar-title">Vi CHAT</div>

                <Toolbar className="footbar-wrapper" style={{
                    backgroundColor:"purple",
                    display:"flex",
                    justifyContent: "center",
                    width:"400px",
                    margin:"0 auto",
                }}>
                    { <div className="status-action-btn mic-btn" onClick={muteMic} title={micStatus ? 'Disable Mic' : 'Enable Mic'}
                    style={{
                        border:"solid 1px black",
                        // margin: "5px",
                        padding: "5px",
                    }}
                    >
                        {micStatus ? 
                            <MicIcon fontSize="large"></MicIcon>
                            :
                            <MicOffIcon fontSize="large"></MicOffIcon>
                        }
                    </div>}
                    <div className="status-action-btn end-call-btn" title="End Call"
                    style={{
                        border:"solid 1px black",
                        padding: "5px",
                    }}>
                        <CallIcon onClick= {handleEndCall} fontSize="large"></CallIcon>
                    </div>
                    {<div className="status-action-btn cam-btn" onClick={muteCam} title={camStatus ? 'Disable Cam' : 'Enable Cam'}
                    style={{
                        border:"solid 1px black",
                        padding: "5px",
                    }}>
                        {camStatus ? 
                            <VideocamIcon fontSize="large"></VideocamIcon>
                            :
                            <VideocamOffIcon fontSize="large"></VideocamOffIcon>
                        }
                    </div>}
                    <div className="screen-share-btn" style={{
                        border:"solid 1px black",
                        padding: "5px",
                    }}>
                        <ScreenShareIcon fontSize="large" className="screen-share-btn" onClick={shareScreen} />
                    </div>
                    <div  className="chat-btn" title="Chat" onClick={handleChatButton}style={{
                        border:"solid 1px black",
                        borderRadius: "0",
                        padding: "5px",
                    }}>
                        <ChatIcon fontSize="large"></ChatIcon>
                    </div>
            </Toolbar>
        </section>
    )
}

export default FootConfigurationBar;