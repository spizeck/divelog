import React from 'react';
import { Container, Header} from 'semantic-ui-react';
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
    <p>More stuff will eventually be displayed here.</p>
    <p>Click on the Dive Log Entry tab to bring up the Entry Form!</p>
</Container>
    </div>
  );
};

export default Home;
