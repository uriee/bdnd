import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
  } from "react-router-dom";

import About from "../components/About";
import Home from "../components/Home";
import { Login,  PrivateRoute, AuthButton } from "../components/Login";
import Board from "../components/board/Board";


const App = () =>
  <Router>
    <div>
      <AuthButton />
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/board">Board</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/about" component={About} />
      <PrivateRoute path="/Board" component={Board} />

    </div>
  </Router>;

export default App;
