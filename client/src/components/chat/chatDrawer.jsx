import React, {useEffect} from 'react';
import {Drawer, Divider} from '@material-ui/core';

//sub components
import ChatHead from "./chatHead/chatHead.jsx";
import ChatWall from "./chatWall/chatWall.jsx";
import SendMessageSection from "./sendMessageSection/sendMessageSection.jsx";
import { useAuth } from '../../contexts/AuthContext.js';
// Toast notifications
import MessageToast from "../notifications/messageToast";
import { firebaseDb } from '../../firebase.js';
import "../../style/chatDrawer.scss"

const ChatDrawer = (props) => {
    const {chatBoxVisible, setChatBoxVisible, socketRef, myName} = props;
    const {currentUser} = useAuth();
    const messageDb = firebaseDb.child("messages").child(props.roomID);
    return(
        <div className="chat-drawer">
        <Drawer
            // className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={chatBoxVisible}
            // className="chat-drawer"
            // classes={{
            //     paper: classes.drawerPaper,
            // }}
        >
            <ChatHead setChatBoxVisible = {setChatBoxVisible} email={currentUser.email}/>
            <Divider />
            { socketRef.current ? <ChatWall email={currentUser.email} messageDb = {messageDb}/> : '' }
            
            <Divider />
            { socketRef.current ? <SendMessageSection email= {currentUser.email} myName={myName} messageDb={messageDb} /> : '' }
            <MessageToast/>
        </Drawer>
        </div>
    )
}

export default ChatDrawer;
