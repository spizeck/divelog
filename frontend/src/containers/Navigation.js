import React, { Component } from 'react';
import { Menu, Message } from 'semantic-ui-react';
import api from '../utils/api';
import 'semantic-ui-css/semantic.min.css'
import Home from './Home';
import DiveForm from './DiveForm';

export default class Navigation extends Component {
  state = {
    activeItem: 'home',
    logoutMessage: '',
  }

  handleItemClick = (e, { name }) => {
    if (name === 'logout') {
      api.logout()
        .then((response) => {
          this.setState({ logoutMessage: response.message });
          this.props.handleLogout();
          setTimeout(() => {
            // refresh the page after logging out
            this.setState({ logoutMessage: '' });
          }, 3000);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({ activeItem: name });
    }
  };

  

  render() {
    const { activeItem , logoutMessage } = this.state
    const {loggedIn, username} = this.props;
    
    let content;
    if (activeItem === 'home') {
      content = <Home username={username} />;
    } else if (activeItem === 'Dive Log Entry') {
      content = <DiveForm username={username} />;
    }
  

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
        {content}
        {logoutMessage && <Message positive>{logoutMessage}</Message>}
      </div>
    );
  };
};

