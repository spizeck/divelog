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
      const loginResponse = await api.login(username, password);

      if (loginResponse.status === 200) {
        // Login successful, save the token, and re-render the page
        localStorage.setItem('token', loginResponse.data.token);
        window.location.reload();
      }
    } catch (error) {
      setErrorMessage(error.message);
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
