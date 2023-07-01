import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../styles/Login.css';
import api from '../utils/api';

const Login = ({ handleLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const loginResponse = await api.login(username, password);

      if (loginResponse.status === 200) {
        // Login successful, save the token, and navigate to the home page
        localStorage.setItem('token', loginResponse.token);
        localStorage.setItem('username', loginResponse.username);
        setSuccessMessage(loginResponse.message);
        handleLoginSuccess(loginResponse.token);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className='login-container'>
      <div className="login-form">
      <Form  onSubmit={handleLogin}>
        <h1>Please Log In</h1>
        <Form.Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e, { value }) => setUsername(value)}
        />
        <Form.Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e, { value }) => setPassword(value)}
        />
        
        <Button type="submit" primary>Log In</Button>
        {successMessage && <Message positive>{successMessage}</Message>}
        {errorMessage && <Message negative>{errorMessage}</Message>}
        </Form>
        <div className='login-footer'>
          <Button.Group fluid>
            <Button className='small-button' onClick={() => navigate('/register')}>Register</Button>
            <Button className='small-button' onClick={() => navigate('/forgot-password')}>Forgot Password</Button>
          </Button.Group>
        </div>
      </div>
    </div>
  );
};

export default Login;
