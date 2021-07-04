import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import CreateRoom from "./routes/CreateRoom";
// import Room from "./routes/Room";
import HomeRoute from "./components/pageComponents/home/HomeRoute"
import RoomRoute from "./components/pageComponents/room/RoomRoute"

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={HomeRoute} />
        <Route path="/room/:roomID" component={RoomRoute}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
