import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import AppHeader from './containers/Header';
import HomePage from './containers/HomePage';
import Navigation from './containers/Navigation';
import Login from './containers/Login';
import Register from './containers/Register';
import ForgotPassword from './containers/ForgotPassword';
import api from './utils/api';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if the user is logged in based on the token presence
    if (localStorage.getItem('token')) {
      // Get the user details from the backend
      api.getCurrentUser().then((response) => {
        if (response.status === 200) {
          // User is logged in
          setLoggedIn(true);
          setUsername(response.data.username);
        }
      });
    }
  }, []);

  const handleLogout = () => {
    // Remove the token from localStorage and update loggedIn state
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <Router>
      <Container>
        <AppHeader />
        <Navigation loggedIn={loggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={loggedIn ? <HomePage username={username} /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
