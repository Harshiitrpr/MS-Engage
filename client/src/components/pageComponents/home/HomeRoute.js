import React from "react";
import { v1 as uuid } from "uuid";

const HomeRoute = (props) => {
    const create = () => {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
        <div>
            <section><button onClick={create}>Create room</button></section>
        </div>
        
    );
};

export default HomeRoute;
