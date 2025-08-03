import React from "react";
import App from "./App";

const Register = ({ onClose }) => {
  return (
    <>
      <div className="register-modal">
        <div className="register-modal-header">
          <h3>Register</h3>{" "}
          <p id="close-register-btn" onClick={onClose}>
            &times;
          </p>
        </div>
        <div className="register-modal-body">
          <form>
            <label htmlFor="firstname">First Name</label>
            <input type="text" />
            <label htmlFor="lastname">Last Name</label>
            <input type="text" />

            <label htmlFor="age">Age</label>
            <input type="number" />
            <label htmlFor="address">Address</label>
            <input type="text" />
            <label htmlFor="mobile-number">Mobile #</label>
            <input type="text" />
            <label htmlFor="email">Email</label>
            <input type="email" />
            <label htmlFor="firstname">Password</label>
            <input type="password" />
            <label htmlFor="firstname">Confirm Password</label>
            <input type="password" />
            <div className="form-btn">
              <button id="submit-btn">Submit</button>
              <button id="cancel-btn" onClick={onclose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="register-modal-overlay" onClick={onClose}></div>
    </>
  );
};

export default Register;
