import React from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import {AuthButton } from "../components/Login";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faInfo, faNetworkWired } from '@fortawesome/free-solid-svg-icons'  

export default class Sidebar extends React.Component {
  state = {
    menuOpen: false
  };

  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen });
  }

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  render() {
    return (
      <Menu right
        width= {240}
        isOpen={this.state.menuOpen}
        onStateChange={state => this.handleStateChange(state)}
      >
        <Link onClick={() => this.closeMenu()} className="menu-item" to="/home">
            <FontAwesomeIcon style={{float:'right'}} icon={faHome}/> Home
        </Link>
        <Link onClick={() => this.closeMenu()} className="menu-item" to="/about">
            <FontAwesomeIcon style={{float:'right'}} icon={faInfo}/>  About
        </Link>
        <Link onClick={() => this.closeMenu()} className="menu-item" to="/Board">
        Routing Board <FontAwesomeIcon style={{float:'right'}} icon={faNetworkWired}/>
        </Link> 
        <AuthButton/>       
      </Menu>
    );
  }
}