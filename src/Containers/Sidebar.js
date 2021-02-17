import React from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import {AuthButton } from "../components/Login";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faThLarge, faNetworkWired } from '@fortawesome/free-solid-svg-icons'  
import "./menu.css";
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
      <Menu 
        width= {100}
        isOpen={this.state.menuOpen}
        onStateChange={state => this.handleStateChange(state)}
      >

        <Link onClick={() => this.closeMenu()} id="home"  to="/">
            <FontAwesomeIcon className="icon-item" icon={faHome}/> 
        </Link>
       
        <Link id="board"  to="/Board">
        <FontAwesomeIcon className="icon-item" icon={faNetworkWired} onClick={() => this.closeMenu()}/>
        </Link> 
               
        
        <Link id="wall"  to="/VideoWallPresets">
            <FontAwesomeIcon className="icon-item" icon={faThLarge} onClick={() => this.closeMenu()}/> 
        </Link>
        
        <div className="menu-item">
        <AuthButton className="icon-item" />       
        </div>
      </Menu>
    );
  }
}