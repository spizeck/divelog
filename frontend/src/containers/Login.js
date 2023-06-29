import React, { useState } from 'react';
import '../styles/Login.css';
import api from '../utils/api';
import Register from './Register';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const response = await fetch(api.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Login successful, redirect to the dashboard or home page
        window.location.href = '/'; // Replace with the desired URL
      } else if (response.status === 401) {
        // Invalid credentials
        setErrorMessage('Invalid credentials');
      } else {
        // Other error
        setErrorMessage('An error occurred');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred');
    }
  };

  return (
    <div className="login-container">
      {!showRegisterForm ? ( // If showRegisterForm is false, show the login form
        <form className="login-form" onSubmit={handleLogin}>
          <h1>Please Log In</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Log In</button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <p></p>
          <button type="button" onClick={() => setShowRegisterForm(true)}>Register</button>
        </form>
      ) : (
        <Register setShowRegisterForm={setShowRegisterForm}/>
      )}
    </div>
  );
};


export default Login;
