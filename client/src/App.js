import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import CreateRoom from "./routes/CreateRoom";
// import Room from "./routes/Room";
import "./style/chatDrawer.scss";
import PrivateRoute from "./components/firebase/PrivateRoute"
import { AuthProvider } from "./contexts/AuthContext"
import Signup from "./components/firebase/Signup";
import Login from "./components/firebase/Login";
import HomeRoute from "./components/pageComponents/home/HomeRoute"
import RoomRoute from "./components/pageComponents/room/RoomRoute"
import CheckOut from "./components/pageComponents/exit/ExitRoute"
import ChatRoute from "./components/pageComponents/chatpage/Chatroute";

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Switch>
        <PrivateRoute exact path="/" exact component={HomeRoute}/>
        <PrivateRoute path="/room/:roomID" component={RoomRoute}/>
        <PrivateRoute path="/chat/:roomID" component={ChatRoute}/>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/exit" component={CheckOut} />
      </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
