import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    withRouter
  } from "react-router-dom"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'  
import {postData} from "../Util/Util";
import "./Login.css";

let error = "";

const Auth = {
  
    isAuthenticated: localStorage.getItem('user_object') ? true : false,
    userData : localStorage.getItem('user_object') ? JSON.parse(localStorage.getItem('user_object')) : {
      user_name: "",
      user_id : 0
    },
    authenticate(user_name, pwd, cb) {
        console.log("~~~",user_name,pwd);
        postData("http://10.0.0.240:8443/login",{"user_name" : user_name, "pwd": pwd})
            .then(response => {
                if (response.status == 200) {
                    this.isAuthenticated = true;
                    this.userData = {
                      user_name: response.data[0].name,
                      user_id: response.data[0].id
                    }
                    localStorage.setItem('user_object',JSON.stringify(this.userData));
                    error = "";
                } else{
                    console.log("Error: ",response.message);
                    error = response.message;
                    this.userData = {
                      user_name: "",
                      user_id: 0
                    }                    
                    localStorage.removeItem('user_object');
                }
                
            console.log(response,this.userData)
            cb()
            })
            .catch(err => {
            console.log(err);
            });
    },
    signout(cb) {
      this.isAuthenticated = false;
      localStorage.removeItem('user_object');
      setTimeout(cb, 100);
    }
  };
  
  const AuthButton = withRouter(
    ({ history }) =>
      Auth.isAuthenticated ? (
        <p className="icon-item">
           <FontAwesomeIcon icon={faSignOutAlt}  onClick={() => {Auth.signout(() => history.push("/")); }}/>
        </p>
      ) : (
        <p></p>
      )
  );
  
  function PrivateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          Auth.isAuthenticated ? (
            <Component {...props} userData={Auth.userData} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
  

  class Login extends Component {
    state = { redirectToReferrer: false,
          welcomeConnect: false,
          trueUsername: "",
          error: "" 
        };
  
    login = () => {
        var user_name = document.getElementById("username").value;
        var pwd = document.getElementById("password").value;
       
        Auth.authenticate(user_name, pwd, () => {
            this.setState({ redirectToReferrer: true, welcomeConnect: true, trueUsername: user_name });
        });
    };
  
    render() {
      let { from } = this.props.location.state || { from: { pathname: "/" } };
      let { redirectToReferrer } = this.state;
  
      if (redirectToReferrer) return <Redirect to={from} />;
  /*
      return (
        <div>
          <p>You must log in to view the page at {from.pathname}</p>
          <button onClick={this.login}>Log in</button>
        </div>
      );
*/
      return (
        <div>
          {this.state.welcomeConnect ? (
            <Welcome uName={this.state.trueUsername} />
          ) :  (

            <div className="main_box">
    
            <div className="main_box--main">
            <div className="main_box--main--title">
                <h4>Please Login</h4>
                <p>Enter your username and password to log on</p>
              </div>
              
              <div className="main_box--main--login">
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="username"
                autoComplete="false"
              />
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="password"
              />
              <button className="btn btn-success" onClick={this.login}>
                LOGIN
              </button>
          <p>{error}</p>
            </div>

            </div>
           </div>
            
          )}
        </div>
      );      
    }
  }

 export { Login,  PrivateRoute, AuthButton }