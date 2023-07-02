import React, { Component } from 'react';
import { Sidebar, Menu, Message, Icon } from 'semantic-ui-react';
import api from '../utils/api';
import 'semantic-ui-css/semantic.min.css'
import '../styles/Navigation.css';
import Home from './Home';
import DiveForm from './DiveForm';

export default class Navigation extends Component {
  state = {
    activeItem: 'home',
    logoutMessage: '',
    sidebarOpened: false,
  }

  handleSidebarToggle = () => this.setState({ sidebarOpened: !this.state.sidebarOpened })

  handleItemClick = (e, { name }) => {
    this.setState({ sidebarOpened: false})
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
    const { activeItem , logoutMessage, sidebarOpened } = this.state
    const {loggedIn, username} = this.props;
    
    let content;
    if (activeItem === 'home') {
      content = <Home username={username} loggedIn={loggedIn} />;
    } else if (activeItem === 'Dive Log Entry') {
      content = <DiveForm username={username} />;
    }
  

    return (
      <div >
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
            <Menu.Item name='Preferences' active={activeItem === 'Preferences'} onClick={this.handleItemClick} />
            <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.handleItemClick} />
          </Sidebar>
          <Sidebar.Pusher dimmed={sidebarOpened}>
            {content}
            {logoutMessage && <Message positive>{logoutMessage}</Message>}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}


