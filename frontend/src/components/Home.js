import React, {useState} from 'react'
import { observer, inject } from 'mobx-react'
import { Container, Header, Message } from 'semantic-ui-react'

// Home class that takes firstName from the userStore
const Home = inject('rootStore')(observer(({ rootStore }) => {
    const { userStore, authStore } = rootStore
    const { firstName } = userStore
    const { loggedIn } = authStore
    const [errorMessage, setErrorMessage] = useState(null)

    return (
      <div>
        <Container>
          <p></p>
          {errorMessage && 
          <div className="error-popup">
            <h2>Error</h2>
            <Message negative>{errorMessage}</Message>
            <button onClick={() => setErrorMessage(null)}>Close</button>
          </div>
          }
          <Header as='h1'>
            Welcome to the Dive Log App{loggedIn && `, ${firstName}`}!
          </Header>
          <p></p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Container>
      </div>
    )
  }
))

export default Home
