import React, { useState } from 'react';
import {Drawer, Divider} from '@material-ui/core';

//sub components
import ChatHead from "./chat/chatHead/chatHead.jsx";
import ChatWall from "./chat/chatWall/chatWall.jsx";
import SendMessageSection from "./chat/sendMessageSection/sendMessageSection.jsx";

const ChatDrawer = (props) => {
    const [message, setMessage] = useState("");

    return(
        
        <Drawer
            // className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={props.chatBoxVisible}
            // classes={{
            //     paper: classes.drawerPaper,
            // }}
        >
            <ChatHead setChatBoxVisible = {props.setChatBoxVisible}/>
            <Divider />
            <ChatWall messages={props.messages} id = {props.id}/>
            <Divider />
            <SendMessageSection socketRef= {props.socketRef}/>
        </Drawer>
        
    )
}

export default ChatDrawer;
