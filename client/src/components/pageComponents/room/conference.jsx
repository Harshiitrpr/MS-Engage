import React, {useRef, useEffect} from 'react';
import styled from "styled-components";
import "../../../style/conference.scss"


const StyledVideo = styled.video`
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <video playsInline autoPlay ref={ref} />
    );
}

const VideoGrid = (props) => {
    const {userVideo, peers, myName} = props;

    return(
        <div className="room-container">
            <div>
                <video className="my-stream" muted ref={userVideo} autoPlay playsInline />
                <div className="video-title" style={{}}>{myName}</div>
            </div>

            {peers.map((peer) => {
                return (
                    <section key={peer.peerID} style={{}}>
                        <Video className="other-stream" peer={peer.peer} />
                        {/* <div className="video-title">{peer.name}</div> */}
                    </section>
                );
            })}
        </div>
    )
}

export default VideoGrid;