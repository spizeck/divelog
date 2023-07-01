import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { Container, Loader, Dimmer } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import AppHeader from './containers/Header';
import BasePage from './containers/BasePage';
import Navigation from './containers/Navigation';
import Login from './containers/Login';
import Register from './containers/Register';
import ForgotPassword from './containers/ForgotPassword';

const AppRoutes = ({ loggedIn, username, handleLoginSuccess }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn && window.location.pathname !== '/home') {
      navigate('/home');
      console.log('I went home')
    } else if (!loggedIn && !['/login', '/register', '/forgot-password'].includes(window.location.pathname)) {
      navigate('/login');
      console.log('I went to login')
    }
  }, [loggedIn, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Outlet />} >
        <Route path="home" element={<BasePage />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="login" element={<Login handleLoginSuccess={handleLoginSuccess} />} />
      </Route>
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

  const handleLoginSuccess = (token) => {
    // Update the loggedIn state
    localStorage.setItem('token', token);
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
