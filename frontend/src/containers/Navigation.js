import React, {useEffect, useState} from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Sidebar, Menu, Message, Icon } from 'semantic-ui-react'
import Home from './Home'
import DiveForm from './DiveForm'
import Preferences from './Preferences'
import PreviousEntries from './PreviousEntries'
import '../styles/Navigation.css'

const Navigation = inject('rootStore')(observer(({ rootStore }) => {
  const location = useLocation()
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const { authStore } = rootStore
  const { loggedIn, logoutMessage, logout } = authStore
  const navigate = useNavigate()

  const isActive = path => {
    return location.pathname === path
  }

  const handleItemClick = name => {
    if (name === 'logout') {
      console.log('Im going to logout')
      logout()
    } else if (name === 'login') {
      navigate('/login')
    }
  }

  const handleSidebarToggle = () => {
    setSidebarOpened(!sidebarOpened)
  }

  // Close the sidebar after logging in or out
  useEffect(() => {
    setSidebarOpened(false)
  }, [loggedIn])


  let content
  if (isActive('/home')) {
    content = <Home />
  } else if (isActive('/diveLogEntry')) {
    content = <DiveForm />
  } else if (isActive('/previousEntries')) {
    content = <PreviousEntries />
  } else if (isActive('/preferences')) {
    content = <Preferences />
  } 

  return (
    <div>
      <Menu pointing secondary>
        <Menu.Item onClick={handleSidebarToggle}>
          <div className='sidebar-toggle'>
            <Icon name='sidebar' />
          </div>
        </Menu.Item>

        <Menu.Item
          name='home'
          active={isActive('/home')}
          as={NavLink}
          to='/home'
        />
        <Menu.Item
          name='Dive Log Entry'
          active={isActive('/diveLogEntry')}
          as={NavLink}
          to='/diveLogEntry'
          disabled={!loggedIn}
        />
        <Menu.Item
          name='Previous Entries'
          active={isActive('/previousEntries')}
          as={NavLink}
          to='/previousEntries'
          disabled={!loggedIn}
        />
        <Menu.Menu position='right'>
          <Menu.Item
            className='desktop-item'
            name='Preferences'
            active={isActive('/preferences')}
            as={NavLink}
            to='/preferences'
            disabled={!loggedIn}
          />
          <Menu.Item
            className='desktop-item'
            name={loggedIn ? 'logout' : 'login'}
            active={isActive(loggedIn ? '/logout' : '/login')}
            onClick={loggedIn ? logout : () => navigate('/login')}
          />
        </Menu.Menu>
      </Menu>
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation='push' vertical visible={sidebarOpened}>
          <Menu.Item
            name='Preferences'
            active={isActive('/preferences')}
            onClick={handleItemClick}
          />
          <Menu.Item
            name={loggedIn ? 'logout' : 'login'}
            active={isActive(loggedIn ? '/logout' : '/login')}
            onClick={loggedIn ? logout : () => navigate('/login')}
          />
        </Sidebar>
        <Sidebar.Pusher dimmed={sidebarOpened}>
          {content}
          {logoutMessage && <Message positive>{logoutMessage}</Message>}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  )
}))

export default Navigation
