import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // State to handle error messages
  const navigate = useNavigate(); // React-router navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      password,
      isAdmin,
      isRegistering,
    };

    try {
      const response = await fetch(`http://0.0.0.0:8000/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        // Assuming the result contains a token and user data
        const { token, isAdmin } = result;

        // Store token in localStorage (for session management)
        localStorage.setItem("token", token);
        localStorage.setItem("isAdmin", isAdmin);
        props.setLoggedIn(true);
        // Store user info (optional)
        // localStorage.setItem("user", JSON.stringify(user));

        console.log(
          `${isRegistering ? "Registration" : "Login"} successful:`,
          result
        );

        // Redirect to dashboard or desired page
        navigate("/"); // Assuming you have a /dashboard route
      } else {
        const errorData = await response.json();

        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log(error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div>
      <h2>{isRegistering ? "Register" : "Login"}</h2>

      {/* Toggle switch for Login/Register */}
      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
          checked={isRegistering}
          onChange={() => setIsRegistering(!isRegistering)}
        />
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
          {isRegistering ? "Switch to Login" : "Switch to Register"}
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Show isAdmin checkbox only when registering */}
        {isRegistering && (
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="isAdminCheck"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
            />
            <label className="form-check-label" htmlFor="isAdminCheck">
              Admin
            </label>
          </div>
        )}

        {/* Display error message if there is an error */}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <button type="submit" className="btn btn-primary">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
