import React, { useState } from 'react';
import api from '../utils/api';
import '../styles/Register.css';

const Register = ({ setShowRegisterForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      // Send register request to the backend
      const response = await fetch(api.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        // Registration successful, show login form
        setShowRegisterForm(false);
      } else if (response.status === 409) {
        // Username or email already exists
        setErrorMessage('Username or email already exists');
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
    <div className="register-container">
      
      <form className="register-form" onSubmit={handleRegister}>
        <h1>Please Register</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default Register;
