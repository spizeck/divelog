import React from 'react'
import { observer, inject } from 'mobx-react'
import { Container, Header } from 'semantic-ui-react'

// Home class that takes firstName from the userStore
const Home = inject('rootStore')(observer(({ rootStore }) => {
    const { userStore, authStore } = rootStore
    const { firstName } = userStore
    const { loggedIn } = authStore

    return (
      <div>
        <Container>
          <p></p>
          <Header as='h1'>
            Welcome to the Dive Log App{loggedIn && <p>, {firstName}!</p>}!
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
