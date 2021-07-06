import React, {useEffect} from 'react';
import {Drawer, Divider} from '@material-ui/core';

//sub components
import ChatHead from "./chatHead/chatHead.jsx";
import ChatWall from "./chatWall/chatWall.jsx";
import SendMessageSection from "./sendMessageSection/sendMessageSection.jsx";

// Toast notifications
import MessageToast from "../notifications/messageToast";

import { notifyMessage as notify } from "../notifications/messageToast";

const ChatDrawer = (props) => {
    const {chatBoxVisible, setChatBoxVisible, socketRef, myName} = props;
    console.log(socketRef);
    return(
        <Drawer
            // className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={chatBoxVisible}
            // classes={{
            //     paper: classes.drawerPaper,
            // }}
        >
            <ChatHead setChatBoxVisible = {setChatBoxVisible}/>
            <Divider />
            { socketRef.current ? <ChatWall socketRef={socketRef}/> : '' }
            
            <Divider />
            { socketRef.current ? <SendMessageSection socketRef= {socketRef} myName={myName}/> : '' }
            <MessageToast/>
        </Drawer>
    )
}

export default ChatDrawer;
