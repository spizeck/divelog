import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Container, Loader, Dimmer } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import AppHeader from './containers/Header'
import BasePage from './containers/BasePage'
import Navigation from './containers/Navigation'
import Login from './containers/Login'
import Register from './containers/Register'
import ForgotPassword from './containers/ForgotPassword'
import NotFound from './containers/NotFound.js'
import api from './utils/api'

const AppRoutes = ({ loggedIn, handleLoginSuccess }) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loggedIn && location.pathname !== '/home') {
      navigate('/home')
    } else if (
      !loggedIn &&
      !['/login', '/register', '/forgot-password'].includes(location.pathname)
    ) {
      navigate('/login')
    }
  }, [loggedIn, navigate, location.pathname])

  return (
    <Routes>
      <Route path='home' element={<BasePage />} />
      <Route path='register' element={<Register />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route
        path='login'
        element={
          <Login handleLoginSuccess={handleLoginSuccess} loggedIn={loggedIn} />
        }
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

const App = () => {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    // Check if the user is logged in based on the token presence
    const checkLoggedInStatus = async () => {
      const storedToken = localStorage.getItem('token')
      const localUsername = localStorage.getItem('username')

      if (storedToken) {
        try {
          const response = await api.getCurrentUser(storedToken)
          if (response.status === 200) {
            // User is logged in
            setToken(storedToken)
            setLoggedIn(true)
            setUsername(
              localUsername.charAt(0).toUpperCase() + localUsername.slice(1)
            )
          } else {
            // User is not logged in
            setToken(null)
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            setLoggedIn(false)
            setUsername('')
            window.location.reload()
          }
        } catch (error) {
          // User is not logged in
          setToken(null)
          localStorage.removeItem('token')
          localStorage.removeItem('username')
          setLoggedIn(false)
          setUsername('')
          window.location.reload()
        }
      } else {
        // User is not logged in
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        setLoggedIn(false)
        setUsername('')
      }
      setLoading(false)
    }
    checkLoggedInStatus()
  }, [])

  const handleLoginSuccess = (newToken, newUsername) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('username', newUsername)
    setToken(newToken)
    setLoggedIn(true)
    setUsername(newUsername.charAt(0).toUpperCase() + newUsername.slice(1))
  }

  const handleLogout = () => {
    // Remove the token from localStorage and update loggedIn state
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken(null)
    setLoggedIn(false)
    window.location.reload()
  }

  if (loading) {
    return (
      <Dimmer active>
        <Loader>Loading...</Loader>
      </Dimmer>
    )
  }

  return (
    <Router>
      <Container>
        <AppHeader />
        <Navigation
          token={token}
          username={username}
          setUsername={setUsername}
          loggedIn={loggedIn}
          handleLoginSuccess={handleLoginSuccess}
          handleLogout={handleLogout}
        />
        <AppRoutes
          loggedIn={loggedIn}
          username={username}
          handleLoginSuccess={handleLoginSuccess}
        />
      </Container>
    </Router>
  )
}

export default App
