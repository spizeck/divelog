import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const Home = ({ username, loggedIn }) => {
  if (!loggedIn) {
    return null;
  }

  return (
    <div>
      <Container>
        <p></p>
        <Header as='h1'>Welcome to the Dive Log App, {username}!</Header>
        <p></p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
          deserunt mollit anim id est laborum.</p>
      </Container>
    </div>
  );
};

export default Home;
