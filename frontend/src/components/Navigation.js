import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Sidebar, Menu, Message, Icon } from 'semantic-ui-react'
import Home from './Home'
import DiveForm from '../components/DiveForm/DiveForm'
import Preferences from './Preferences'
import PreviousEntries from './PreviousEntries'
import '../styles/Navigation.css'

const Navigation = inject('rootStore')(
  observer(({ rootStore }) => {
    const location = useLocation()
    const [sidebarOpened, setSidebarOpened] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const { authStore } = rootStore
    const { logout } = authStore
    const navigate = useNavigate()

    const contentMapping = {
      '/home': <Home />,
      '/diveLogEntry': <DiveForm />,
      '/previousEntries': <PreviousEntries />,
      '/preferences': <Preferences />
    }

    const isActive = path => {
      return location.pathname === path
    }

    const content = contentMapping[location.pathname]

    const handleItemClick = (e, { name }) => {
      if (name === 'logout') {
        logout()
      } else {
        navigate(name)
      }
      setSidebarOpened(false)
    }

    const handleSidebarToggle = () => {
      setSidebarOpened(prevState => !prevState)
    }

    useEffect(() => {
      setSidebarOpened(false)
      if (!authStore.loggedIn) {
        navigate('/home')
      }
    }, [authStore.loggedIn])

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

    const renderMenuItem = (
      name,
      path,
      requiresLogin = false,
      className = ''
    ) => {
      if (requiresLogin && !authStore.loggedIn) {
        return (
          <Menu.Item name={name} disabled className={className}>
            {name}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item
          name={name}
          active={isActive(path)}
          as={NavLink}
          to={path}
          className={className}
        />
      )
    }

    return (
      <div>
        <Menu pointing secondary>
          {isMobile && (
            <Menu.Item onClick={handleSidebarToggle}>
              <Icon name='sidebar' />
            </Menu.Item>
          )}
          {renderMenuItem('Home', '/home', false)}
          {renderMenuItem('Dive Log Entry', '/diveLogEntry', true)}
          {renderMenuItem('Previous Entries', '/previousEntries', true)}
          <Menu.Menu position='right'>
            {!isMobile && renderMenuItem('Preferences', '/preferences', true)}
            {!isMobile && (
              <Menu.Item
                name={authStore.loggedIn ? 'logout' : 'login'}
                active={isActive(authStore.loggedIn ? '/logout' : '/login')}
                onClick={handleItemClick}
              />
            )}
          </Menu.Menu>
        </Menu>
        {sidebarOpened ? (
          <Sidebar.Pushable>
            <Sidebar
              as={Menu}
              animation='push'
              vertical
              visible={sidebarOpened}
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
              {content}
              {authStore.logoutMessage && (
                <Message positive>{authStore.logoutMessage}</Message>
              )}
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        ) : (
          <div>
            {content}
            {authStore.logoutMessage && (
              <Message positive>{authStore.logoutMessage}</Message>
            )}
          </div>
        )}
      </div>
    )
  })
)

export default Navigation
