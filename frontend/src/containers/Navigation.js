import React, { useState } from 'react'
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Sidebar, Menu, Message, Icon } from 'semantic-ui-react'
import api from '../utils/api'
import '../styles/Navigation.css'
import Home from './Home'
import DiveForm from './DiveForm'
import Preferences from './Preferences'
import PreviousEntries from './PreviousEntries'

@observer
class Navigation extends React.Component {
  @observable activeItem = 'home'
  @observable logoutMessage = ''
  @observable sidebarOpened = false
  
  // click handler for menu items, login and logout
  @action.bound
  handleItemClick (e, { name }) {
    if (name === 'logout') {
      this.logout()
    } else if (name === 'login') {
      this.props.history.push('/login')
      this.activeItem = name
    }
  }



  // click handler for sidebar toggle
  @action.bound
  handleSidebarToggle () {
    this.sidebarOpened = !this.sidebarOpened
  }

  let content;
if (this.activeItem === 'home') {
  content = <Home username={this.props.username} loggedIn={this.props.loggedIn} />;
} else if (this.activeItem === 'Dive Log Entry') {
  content = <DiveForm username={this.props.username} token={this.props.token} />;
} else if (this.activeItem === 'Previous Entries') {
  content = <PreviousEntries username={this.props.username} token={this.props.token} />;
} else if (this.activeItem === 'Preferences') {
  content = (
    <Preferences
      token={this.props.token}
      setUsername={this.props.setUsername}
      handleLoginSuccess={this.props.handleLoginSuccess}
    />
  );
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
          active={activeItem === 'home'}
          onClick={loggedIn ? handleItemClick : null}
          disabled={!loggedIn}
        />
        <Menu.Item
          name='Dive Log Entry'
          active={activeItem === 'Dive Log Entry'}
          onClick={loggedIn ? handleItemClick : null}
          disabled={!loggedIn}
        />
        <Menu.Item
          name='Previous Entries'
          active={activeItem === 'Previous Entries'}
          onClick={loggedIn ? handleItemClick : null}
          disabled={!loggedIn}
        />
        <Menu.Menu position='right'>
          <Menu.Item
            className='desktop-item'
            name='Preferences'
            active={activeItem === 'Preferences'}
            onClick={loggedIn ? handleItemClick : null}
            disabled={!loggedIn}
          />
          <Menu.Item
            className='desktop-item'
            name='logout'
            active={activeItem === 'logout'}
            onClick={loggedIn ? handleItemClick : null}
            disabled={!loggedIn}
          />
        </Menu.Menu>
      </Menu>
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation='push' vertical visible={sidebarOpened}>
          <Menu.Item
            name='Preferences'
            active={activeItem === 'Preferences'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
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
}

export default Navigation
