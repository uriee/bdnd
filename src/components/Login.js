import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    withRouter
  } from "react-router-dom"; 

const Auth = {
    isAuthenticated: false,
    authenticate(cb) {
      this.isAuthenticated = true;
      setTimeout(cb, 100); // fake async
    },
    signout(cb) {
      this.isAuthenticated = false;
      setTimeout(cb, 100);
    }
  };
  
  const AuthButton = withRouter(
    ({ history }) =>
      Auth.isAuthenticated ? (
        <p>
          Welcome!{" "}
          <button
            onClick={() => {
              Auth.signout(() => history.push("/"));
            }}
          >
            Sign out
          </button>
        </p>
      ) : (
        <p>You are not logged in.</p>
      )
  );
  
  function PrivateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          Auth.isAuthenticated ? (
            <Component {...props} />
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
    state = { redirectToReferrer: false };
  
    login = () => {
      Auth.authenticate(() => {
        this.setState({ redirectToReferrer: true });
      });
    };
  
    render() {
      let { from } = this.props.location.state || { from: { pathname: "/" } };
      let { redirectToReferrer } = this.state;
  
      if (redirectToReferrer) return <Redirect to={from} />;
  
      return (
        <div>
          <p>You must log in to view the page at {from.pathname}</p>
          <button onClick={this.login}>Log in</button>
        </div>
      );
    }
  }

 export { Login,  PrivateRoute, AuthButton }