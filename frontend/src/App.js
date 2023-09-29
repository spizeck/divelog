// Used for: Main app component
import React, { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation
} from 'react-router-dom'
import { Provider, observer } from 'mobx-react'
import RootStore from './stores/RootStore'
import { Container, Sidebar, Menu } from 'semantic-ui-react'
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
  const { userStore, authStore } = rootStore
  const { fetchUserData } = userStore
  const location = useLocation()
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const handleSidebarToggle = () => {
    setSidebarOpened(prevState => !prevState)
  }

  const isActive = path => {
    return location.pathname === path;
  }

  const handleItemClick = (e, { name }) => {
    if (name === 'logout') {
      authStore.logout()
    } else {
      NavLink(name)
    }
    setSidebarOpened(false)
  }

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

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  useEffect(() => {
    if (!isMobile && sidebarOpened) {
      setSidebarOpened(false)
    }
  }, [isMobile])

  return (
    <BrowserRouter>
    
      <Container>
        
        <Provider rootStore={rootStore}>
          <AppHeader />
          <Navigation
            handleSidebarToggle={handleSidebarToggle}
            isMobile={isMobile}
          />
          <Sidebar.Pushable>
            <Sidebar
              as={Menu}
              animation='push'
              vertical
              visible={sidebarOpened}
              onHide={handleSidebarToggle}
            >
              <Menu.Item
                name='Preferences'
                active={isActive('/preferences') && authStore.loggedIn}
                as={NavLink}
                to={authStore.loggedIn ? '/preferences' : '/login'}
                onClick={handleItemClick}
              />
              <Menu.Item
                name={authStore.loggedIn ? 'logout' : 'login'}
                active={isActive(authStore.loggedIn ? '/logout' : '/login')}
                onClick={handleItemClick}
              />
            </Sidebar>
            <Sidebar.Pusher dimmed={sidebarOpened}>
            <AppRoutes />
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Provider>
      </Container>
    </BrowserRouter>
  )
})

export default App
