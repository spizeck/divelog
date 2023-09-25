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
    const { authStore } = rootStore
    const { logoutMessage, logout } = authStore
    const navigate = useNavigate()

    const isActive = path => {
      return location.pathname === path
    }

    const handleItemClick = (e, { name }) => {
      if (name === 'logout') {
        logout()
      } else {
        navigate(name)
      }
    }

    const handleSidebarToggle = () => {
      setSidebarOpened((prevState) => !prevState)
    }

    const contentMapping = {
      '/home': <Home />,
      '/diveLogEntry': <DiveForm />,
      '/previousEntries': <PreviousEntries />,
      '/preferences': <Preferences />
    }

    const content = contentMapping[location.pathname]

    const renderMenuItem = (name, path, disabled = false, className = '') => {
      if (disabled && !authStore.loggedIn) {
        return (
          <Menu.Item name={name} disabled className={className}>
            {name}
          </Menu.Item>
        );
      }
      return (
        <Menu.Item
          name={name}
          active={isActive(path)}
          as={NavLink}
          to={path}
          className={className}
          onClick={e => {
            if (disabled && !authStore.loggedIn) {
              e.preventDefault();
            }
          }}
        />
      );
    };
    

    // Close the sidebar after logging in or out
    useEffect(() => {
      setSidebarOpened(false)
    }, [authStore.loggedIn])

    return (
      <div>
        <Menu pointing secondary>
          <Menu.Item onClick={handleSidebarToggle}>
            <div className='sidebar-toggle'>
              <Icon name='sidebar' />
            </div>
          </Menu.Item>

          {renderMenuItem('Home', '/home')}
          {renderMenuItem('Dive Log Entry', '/diveLogEntry', true)}
          {renderMenuItem('Previous Entries', '/previousEntries', true)}
          <Menu.Menu position='right'>
            {renderMenuItem('Preferences', '/preferences', true, 'desktop-item')}
            <Menu.Item
              className='desktop-item'
              name={authStore.loggedIn ? 'logout' : 'login'}
              active={isActive(authStore.loggedIn ? '/logout' : '/login')}
              onClick={handleItemClick}
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
              name={authStore.loggedIn ? 'logout' : 'login'}
              active={isActive(authStore.loggedIn ? '/logout' : '/login')}
              onClick={handleItemClick}
            />
          </Sidebar>
          <Sidebar.Pusher dimmed={sidebarOpened}>
            {content}
            {logoutMessage && <Message positive>{logoutMessage}</Message>}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  })
)

export default Navigation
