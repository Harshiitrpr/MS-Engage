import React from "react";
import { IconButton } from "@material-ui/core";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const ChatHeader = (props) => {
    const closeDrawer = () => {
        props.setChatBoxVisible(false);
    }

    return(
        <div className="chat-head-wrapper">
            <IconButton onClick={closeDrawer} fullWidth="true">
                <ChevronRightIcon />
            </IconButton>
        </div>
    )
}

export default ChatHeader;