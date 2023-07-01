import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../styles/Login.css';
import api from '../utils/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const loginResponse = await api.login(username, password);

      if (loginResponse.status === 200) {
        // Login successful, save the token, and re-render the page
        localStorage.setItem('token', loginResponse.token);
        window.location.reload();
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className='login-container'>
      <Form className="login-form" onSubmit={handleLogin}>
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
        {errorMessage && <Message negative>{errorMessage}</Message>}
        <div className='login-footer'>
          <Button.Group style={{ width: '100%' }}>
            <Button className='small-button' type="button" onClick={() => 
              navigate('/register') }
              >Register</Button>
            <Button.Or />
            <Button className='small-button' type="button" onClick={() => {
              navigate('/forgot-password');
            }}
            >Forgot Password</Button>
          </Button.Group>
        </div>
      </Form>
    </div>
  );
};

export default Login;
