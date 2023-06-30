import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import AppHeader from './containers/Header';
import Navigation from './containers/Navigation';
import Login from './containers/Login';
import Register from './containers/Register';
import ForgotPassword from './containers/ForgotPassword';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in based on the token presence
    if (localStorage.getItem('token')) {
      setLoggedIn(true);
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
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login handleLogin={() => setLoggedIn(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      </Container>
    </Router>
  );
};

export default App;
