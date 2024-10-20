import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard"; // You will add this later
// import LoginForm from "./components/LoginForm";
import Navbar from "./components/NavBar";
import LoginForm from "./components/Login";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Router>
      <Navbar loggedIn={loggedIn} />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Dashboard setLoggedIn={setLoggedIn} />} />
          <Route
            path="/login"
            element={<LoginForm setLoggedIn={setLoggedIn} />}
          />

          <Route
            path="*"
            element={() => {
              <h1>page not found</h1>;
            }}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
