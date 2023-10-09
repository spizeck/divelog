import React from 'react'
import { NavLink } from'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Menu, Message, Icon } from 'semantic-ui-react'
import '../styles/Navigation.css'

const Navigation = inject('rootStore')(
  observer(({ rootStore, isMobile, handleSidebarToggle , isActive, handleItemClick}) => {
    const { authStore } = rootStore

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
          {renderMenuItem('Previous Entries', '/previousEntries', false)}
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
        <div>
          {authStore.logoutMessage && (
            <Message positive>{authStore.logoutMessage}</Message>
          )}
        </div>
      </div>
    )
  })
)

export default Navigation
