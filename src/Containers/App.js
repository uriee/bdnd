import React from "react";
import {
    BrowserRouter as Router,
    Route,
  } from "react-router-dom";
import Sidebar from "./Sidebar";
import About from "../components/About";
import Home from "../components/Home";
import { Login,  PrivateRoute } from "../components/Login";
import Board from "../components/board/Board";
import "./styles.css";

const App = () =>
  <Router>
    <div className="App">
      <Sidebar />
      <div id="page-wrap">
          <h2>Silora R&D App</h2>
       </div>
    </div>
    
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/about" component={About} />
      <PrivateRoute path="/Board" component={Board} />      
  </Router>;

export default App;
