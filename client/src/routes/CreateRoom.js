import React from "react";
import { v1 as uuid } from "uuid";

const CreateRoom = (props) => {
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
        <div>
            <section><button onClick={create}>Create room</button></section>
        </div>
        
    );
};

export default CreateRoom;
