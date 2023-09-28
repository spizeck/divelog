// Used for: Main app component
import React, { useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, observer } from 'mobx-react'
import RootStore from './stores/RootStore'
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import AppHeader from './components/Header'
import Home from './components/Home'
import DiveForm from './components/DiveForm/DiveForm'
import PreviousEntries from './components/PreviousEntries/PreviousEntries'
import Preferences from './components/Preferences'
import Navigation from './components/Navigation'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
// import NotFound from './components/NotFound.js'

const AppRoutes = observer(() => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      <Route path='/home' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot_password' element={<ForgotPassword />} />
      <Route path='/login' element={<Login />} />
      <Route path='/diveLogEntry' element={<DiveForm />} />
      <Route path='/previousEntries' element={<PreviousEntries />} />
      <Route path='/preferences' element={<Preferences />} />
      {/* <Route path='*' element={<NotFound />} /> */}
    </Routes>
  )
})

const App = observer(() => {
  const rootStore = useMemo(() => new RootStore(), [])
  const { userStore } = rootStore
  const { fetchUserData } = userStore

  useEffect(() => {
    // Check if the user is logged in based on the token presence and validity
    const fetchData = async () => {
      try {
        await fetchUserData()
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [fetchUserData])

  return (
    <BrowserRouter>
      <Container>
        <Provider rootStore={rootStore}>
          <AppHeader />
          <Navigation />
          <AppRoutes />
        </Provider>
      </Container>
    </BrowserRouter>
  )
})

export default App
