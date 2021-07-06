import React from "react";
import { IconButton } from "@material-ui/core";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const ChatHeader = (props) => {
    const closeDrawer = () => {
        props.setChatBoxVisible(false);
    }

    return(
        <div>
            <IconButton onClick={closeDrawer}>
                <ChevronRightIcon />
            </IconButton>
        </div>
    )
}

export default ChatHeader;