import React from "react";

const Login = ({ onClose, setIsLoggedIn }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    onClose();
  };

  return (
    <>
      <div className="login-modal">
        <div className="login-header">
          <h3>Login</h3>
          <p id="btn-x" onClick={onClose}>
            &times;
          </p>
        </div>
        <div className="login-body">
          <form>
            <label htmlFor="">Email</label>
            <input type="text" name="" id="" />
            <label htmlFor="">Password</label>
            <input type="text" name="" id="" />
            <label htmlFor="">
              <input type="checkbox" name="" id="" />
              Admin
            </label>

            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
      <div className="login-modal-overlay" onClick={onClose}></div>
    </>
  );
};

export default Login;
