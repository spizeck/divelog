import React, { useState } from 'react'
import { Sidebar, Menu, Message, Icon } from 'semantic-ui-react'
import api from '../utils/api'
import '../styles/Navigation.css'
import Home from './Home'
import DiveForm from './DiveForm'
import Preferences from './Preferences'
import PreviousEntries from './PreviousEntries'

const Navigation = ({
  loggedIn,
  username,
  setUsername,
  handleLogout,
  handleLoginSuccess,
  token
}) => {
  const [activeItem, setActiveItem] = useState('home')
  const [logoutMessage, setLogoutMessage] = useState('')
  const [sidebarOpened, setSidebarOpened] = useState(false)

  const handleSidebarToggle = () => setSidebarOpened(!sidebarOpened)

  const handleItemClick = (e, { name }) => {
    setSidebarOpened(false)
    if (name === 'logout') {
      api
        .logout()
        .then(response => {
          setLogoutMessage(response.message)
          handleLogout()
          setTimeout(() => {
            setLogoutMessage('')
          }, 3000)
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      setActiveItem(name)
    }
  }

  let content
  if (activeItem === 'home') {
    content = <Home username={username} loggedIn={loggedIn} />
  } else if (activeItem === 'Dive Log Entry') {
    content = <DiveForm username={username} token={token} />
  } else if (activeItem === 'Previous Entries') {
    content = <PreviousEntries token={token} />
  } else if (activeItem === 'Preferences') {
    content = (
      <Preferences
        token={token}
        setUsername={setUsername}
        handleLoginSuccess={handleLoginSuccess}
      />
    )
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
