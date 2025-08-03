import React from "react";
import App from "./App";
import { useState } from "react";

const NavBar = ({
  isRegisterWindowOpen,
  setIsRegisterWindowOpen,
  isLoginWindowOpen,
  setIsLoginWindowOpen,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  // let a = false;

  return (
    <nav className="nav-container">
      <div className="nav-container-left">
        <h2>Market Information System</h2>
        <ul>
          <li>Home</li>
          <li>Browse Stalls</li>
          <li>FAQs</li>
          <li>About</li>
        </ul>
      </div>
      {isLoggedIn ? (
        <div className="nav-container-right">
          <p>maxnowitzki@gmail.com</p>
          <button onClick={() => setIsLoggedIn(false)}>LogOut</button>
        </div>
      ) : (
        <div className="nav-container-right">
          <button
            className="login-btn"
            onClick={() => setIsLoginWindowOpen(true)}
          >
            Login
          </button>
          <button
            className="register-btn"
            onClick={() => setIsRegisterWindowOpen(true)}
          >
            Register
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
