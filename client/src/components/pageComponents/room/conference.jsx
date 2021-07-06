import React, {useRef, useEffect} from 'react';
import styled from "styled-components";


const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}

const VideoGrid = (props) => {
    const {userVideo, peers, myName} = props;

    return(
        <div>
            <div id="room-container">
                <StyledVideo muted ref={userVideo} autoPlay playsInline />
                <div>{myName}</div>
            </div>

            {peers.map((peer) => {
                return (
                    <section key={peer.peerID}>
                    <Video peer={peer.peer} />
                    <div>{peer.name}</div>
                    </section>
                );
            })}
        </div>
    )
}

export default VideoGrid;