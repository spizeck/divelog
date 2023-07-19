import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Sidebar, Menu, Message, Icon } from 'semantic-ui-react'
import '../styles/Navigation.css'
import Home from './Home'
import DiveForm from './DiveForm'
import Preferences from './Preferences'
import PreviousEntries from './PreviousEntries'

@inject('rootStore')
@observer
class Navigation extends Component {
  // click handler for menu items, login and logout
  handleItemClick (e, { name }) {
    if (name === 'logout') {
      this.props.rootStore.logout()
    } else if (name === 'login') {
      this.props.history.push('/login')
      this.props.rootStore.activeItem = name
    } else {
      this.props.rootStore.activeItem = name
    }
  }

  // click handler for sidebar toggle
  handleSidebarToggle () {
    this.props.rootStore.sidebarOpened = !this.props.rootStore.sidebarOpened
  }

  render () {
    const {
      username,
      loggedIn,
      token,
      setUsername,
      handleLoginSuccess,
      preferredUnits,
      activeItem,
      sidebarOpened,
      logoutMessage
    } = this.props.rootStore

    let content
    if (activeItem === 'home') {
      content = <Home />
    } else if (activeItem === 'Dive Log Entry') {
      content = <DiveForm />
    } else if (activeItem === 'Previous Entries') {
      content = <PreviousEntries />
    } else if (activeItem === 'Preferences') {
      content = <Preferences />
    }

    return (
      <div>
        <Menu pointing secondary>
          <Menu.Item onClick={this.handleSidebarToggle}>
            <div className='sidebar-toggle'>
              <Icon name='sidebar' />
            </div>
          </Menu.Item>

          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={loggedIn ? this.handleItemClick : null}
            disabled={!loggedIn}
          />
          <Menu.Item
            name='Dive Log Entry'
            active={activeItem === 'Dive Log Entry'}
            onClick={loggedIn ? this.handleItemClick : null}
            disabled={!loggedIn}
          />
          <Menu.Item
            name='Previous Entries'
            active={activeItem === 'Previous Entries'}
            onClick={loggedIn ? this.handleItemClick : null}
            disabled={!loggedIn}
          />
          <Menu.Menu position='right'>
            <Menu.Item
              className='desktop-item'
              name='Preferences'
              active={activeItem === 'Preferences'}
              onClick={loggedIn ? this.handleItemClick : null}
              disabled={!loggedIn}
            />
            <Menu.Item
              className='desktop-item'
              name='logout'
              active={activeItem === 'logout'}
              onClick={loggedIn ? this.handleItemClick : null}
              disabled={!loggedIn}
            />
          </Menu.Menu>
        </Menu>
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation='push' vertical visible={sidebarOpened}>
            <Menu.Item
              name='Preferences'
              active={activeItem === 'Preferences'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='logout'
              active={activeItem === 'logout'}
              onClick={this.handleItemClick}
            />
          </Sidebar>
          <Sidebar.Pusher dimmed={sidebarOpened}>
            {content}
            {logoutMessage && <Message positive>{logoutMessage}</Message>}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}

export default Navigation
