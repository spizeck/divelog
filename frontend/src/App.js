import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
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
    const token = localStorage.getItem('token');
    if (token) {
      // Get the user details from the backend
      try {
        api.getCurrentUser()
          .then((response) => {
            if (response.status === 200) {
              // User is logged in
              setLoggedIn(true);
              setUsername(response.username.charAt(0).toUpperCase() + response.username.slice(1));
            }
          })
          .catch((error) => {
            console.log(error);
            setLoggedIn(false);
            setUsername('');
          });
      } catch (error) {
        console.log(error);
        setLoggedIn(false);
        setUsername('');
      }
    } else {
      // User is not logged in
      setLoggedIn(false);
      setUsername('');
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
    setLoggedIn(false);
  };

  return (
    <Router>
      <Container>
        <AppHeader />
        <Navigation loggedIn={loggedIn} handleLogout={handleLogout} />
        <Routes>
          {/* Use / as a landing to apply logic check */}
          <Route
            path="/"
            element={loggedIn ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/home"
            element={loggedIn ? <HomePage username={username} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/register"
            element={!loggedIn ? <Register /> : <Navigate to="/home" replace />}
          />
          <Route
            path="/forgot-password"
            element={!loggedIn ? <ForgotPassword /> : <Navigate to="/home" replace />}
          />
          {/* Route to /login only if logged in is false */}
          <Route
            path="/login"
            element={!loggedIn ? <Login handleLoginSuccess={handleLoginSuccess} /> : <Navigate to="/home" replace />}
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;