import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Container, Loader, Dimmer } from 'semantic-ui-react';
import AppHeader from './containers/Header';
import BasePage from './containers/BasePage';
import Navigation from './containers/Navigation';
import Login from './containers/Login';
import Register from './containers/Register';
import ForgotPassword from './containers/ForgotPassword';
import NotFound from './containers/NotFound.js';

const AppRoutes = ({ loggedIn, username, handleLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loggedIn && location.pathname !== '/home') {
      navigate('/home');
    } else if (!loggedIn && !['/login', '/register', '/forgot-password'].includes(location.pathname)) {
      navigate('/login');
    }
  }, [loggedIn, navigate, location.pathname]);

  return (
    <Routes>
        <Route path="home" element={<BasePage />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="login" element={<Login handleLoginSuccess={handleLoginSuccess} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if the user is logged in based on the token presence
    const token = localStorage.getItem('token');
    const localUsername = localStorage.getItem('username');


    if (token) {
      // User is logged in
      setLoggedIn(true);
      setLoading(false);
      setUsername(localUsername.charAt(0).toUpperCase() + localUsername.slice(1));

    } else {
      // User is not logged in
      setLoggedIn(false);
      setUsername('');
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (token, username) => {
    // Update the loggedIn state
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUsername(username.charAt(0).toUpperCase() + username.slice(1));
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Remove the token from localStorage and update loggedIn state
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setLoggedIn(false);
  };

  if (loading) {
    return (
      <Dimmer active>
        <Loader>Loading...</Loader>
      </Dimmer>
    );
  }

  return (
    <Router>
      <Container>
        <AppHeader />
        <Navigation username={username} loggedIn={loggedIn} handleLogout={handleLogout} />
        <AppRoutes loggedIn={loggedIn} username={username} handleLoginSuccess={handleLoginSuccess} />
      </Container>
    </Router>
  );
};

export default App;
