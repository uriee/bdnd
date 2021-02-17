import React from "react";
import {
    BrowserRouter as Router,
    Route,
  } from "react-router-dom";
import Sidebar from "./Sidebar";
import VideoWallPresets from "../components/VideoWallPresets";
import Home from "../components/Home";
import { Login,  PrivateRoute } from "../components/Login";
import Board from "../components/board/Board";
import "./styles.css";
const logo = "logo_silora.png";

const App = () =>
  <Router>
    <div className="App">
      <Sidebar />
      <div id="page-wrap">
      <img src={logo} width="300" style={{float : 'right', marginTop : 5,marginBottom : 30, marginRight : 5}}/>
       </div>
    </div>
    
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/VideoWallPresets" component={VideoWallPresets} />
      <PrivateRoute path="/Board" component={Board} />      
  </Router>;

export default App;
