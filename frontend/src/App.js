// Used for: Main app component
import React, { useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider, observer } from 'mobx-react'
import RootStore from './stores/RootStore'
import { Container, Loader, Dimmer } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import AppHeader from './containers/Header'
import BasePage from './containers/BasePage'
import Navigation from './containers/Navigation'
import Login from './containers/Login'
import Register from './containers/Register'
import ForgotPassword from './containers/ForgotPassword'
import NotFound from './containers/NotFound.js'

const AppRoutes = observer(() => {
  return (
    <Routes>
      <Route path='home' element={<BasePage />} />
      <Route path='register' element={<Register />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route path='login' element={<Login />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
})

const App = observer(() => {
  const rootStore = useMemo(() => new RootStore(),[])
  const { token, loading, checkLogin } = rootStore

  useEffect(() => {
    // Check if the user is logged in based on the token presence and validity
    checkLogin()
  }, [token, checkLogin])

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
        <Provider rootStore={rootStore}>
          <AppHeader />
          <Navigation />
          <AppRoutes />
        </Provider>
      </Container>
    </Router>
  )
})

export default App
