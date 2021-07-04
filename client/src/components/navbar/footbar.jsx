import React, {useState} from 'react';
import { Toolbar, IconButton } from '@material-ui/core';

//icon imports
import CallIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ChatIcon from '@material-ui/icons/Chat';

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
        <section className="chat-footbar">
            <div className="footbar-title">Vi CHAT</div>
                <Toolbar className="footbar-wrapper">
                    { <div className="status-action-btn mic-btn" onClick={muteMic} title={micStatus ? 'Disable Mic' : 'Enable Mic'}>
                        {micStatus ? 
                            <MicIcon></MicIcon>
                            :
                            <MicOffIcon></MicOffIcon>
                        }
                    </div>}
                    <div className="status-action-btn end-call-btn" title="End Call">
                        <CallIcon onClick= {handleEndCall}></CallIcon>
                    </div>
                    {<div className="status-action-btn cam-btn" onClick={muteCam} title={camStatus ? 'Disable Cam' : 'Enable Cam'}>
                        {camStatus ? 
                            <VideocamIcon></VideocamIcon>
                            :
                            <VideocamOffIcon></VideocamOffIcon>
                        }
                    </div>}
                    <div className="screen-share-btn">
                        <h4 className="screen-share-btn-text" onClick={shareScreen} >Share Screen</h4>
                    </div>
                    <IconButton  className="chat-btn" title="Chat" onClick={handleChatButton}>
                        <ChatIcon></ChatIcon>
                    </IconButton>
            </Toolbar>
        </section>
    )
}

export default FootConfigurationBar;