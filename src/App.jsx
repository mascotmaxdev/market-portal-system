import React from "react";
import "./App.css"; // Import the stylesheet

const App = () => {
  return (
    <>
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
        <div className="nav-container-right">
          <button>Login</button>
          <button>Register</button>
        </div>
      </nav>
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
    </>
  );
};

export default App;
