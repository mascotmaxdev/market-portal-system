import React, { useState } from "react";
import "./styles/App.css"; // Import the stylesheet
import NavBar from "./NavBar";
import Register from "./Register";
import Login from "./Login";

const App = () => {
  const [isRegisterWindowOpen, setIsRegisterWindowOpen] = useState(false);
  const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <NavBar
        isRegisterWindowOpen={isRegisterWindowOpen}
        setIsRegisterWindowOpen={setIsRegisterWindowOpen}
        isLoginWindowOpen={isLoginWindowOpen}
        setIsLoginWindowOpen={setIsLoginWindowOpen}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      <main className="content">
        <section className="hero-section">
          <img src="./src/assets/images/vendors.png" alt="" />
          <h3>
            Apply for stalls, manage requirements, and stay updated — all in one
            place. Our market information system makes it easy for vendors to go
            digital and for administrators to stay organized.
          </h3>
          <button className="browse-stalls">Browse Stalls</button>
        </section>
      </main>
      {isRegisterWindowOpen && (
        <Register onClose={() => setIsRegisterWindowOpen(false)} />
      )}
      {isLoginWindowOpen && (
        <Login
          onClose={() => setIsLoginWindowOpen(false)}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </>
  );
};

export default App;
