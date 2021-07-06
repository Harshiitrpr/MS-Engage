import React, {useEffect} from "react";

const CheckOut = (props) => {
    const {socketRef} = props;
    useEffect(() => {
        if(socketRef.current){
            socketRef.current.disconnect();
        }
    })
    return<h1>Thank you</h1>
}

export default CheckOut;