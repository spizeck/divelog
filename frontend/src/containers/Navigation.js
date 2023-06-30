import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

export default class Navigation extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => {
    if (name === 'logout') {
      this.props.handleLogout();
    } else {
      this.setState({ activeItem: name })
    }
  }

  render() {
    const { activeItem } = this.state
    const { loggedIn } = this.props

    return (
      <div >
        <Menu pointing secondary>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={loggedIn ? this.handleItemClick : null}  // Check if user is logged in
            disabled={!loggedIn}  // Disable the item if not logged in
          />
          <Menu.Item
            name='Dive Log Entry'
            active={activeItem === 'Dive Log Entry'}
            onClick={loggedIn ? this.handleItemClick : null}  // Check if user is logged in
            disabled={!loggedIn}  // Disable the item if not logged in
          />
          <Menu.Item
            name='Previous Entries'
            active={activeItem === 'Previous Entries'}
            onClick={loggedIn ? this.handleItemClick : null}  // Check if user is logged in
            disabled={!loggedIn}  // Disable the item if not logged in
          />
          <Menu.Menu position='right'>
            <Menu.Item
              name='Preferences'
              active={activeItem === 'Preferences'}
              onClick={loggedIn ? this.handleItemClick : null}  // Check if user is logged in
              disabled={!loggedIn}  // Disable the item if not logged in
            />
            <Menu.Item
              name='logout'
              active={activeItem === 'logout'}
              onClick={loggedIn ? this.handleItemClick : null}  // Check if user is logged in
              disabled={!loggedIn}  // Disable the item if not logged in
            />
          </Menu.Menu>
        </Menu>
      </div>
    );
  };
};

