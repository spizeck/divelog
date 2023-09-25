import React, { useState } from 'react'
import { observer, inject } from 'mobx-react'
import { Container, Header, Message } from 'semantic-ui-react'

// Home class that takes firstName from the userStore
const Home = inject('rootStore')(
  observer(({ rootStore }) => {
    const { userStore, authStore } = rootStore
    const { firstName } = userStore
    const { loggedIn } = authStore
    const [errorMessage, setErrorMessage] = useState(null)

    return (
      <div>
        <Container>
          <p></p>
          {errorMessage && (
            <div className='error-popup'>
              <h2>Error</h2>
              <Message negative>{errorMessage}</Message>
              <button onClick={() => setErrorMessage(null)}>Close</button>
            </div>
          )}
          <Header as='h1'>
            Welcome to the Dive Log App{loggedIn && `, ${firstName}`}!
          </Header>
          <div>
            <h2>🚧 We're Under Construction! 🚧</h2>
            <p>
              We're excited to have you here! Please note that this app is still
              in development, but the database is live.
            </p>
            <h3>🐠 Get Started!</h3>
            <p>
              Feel free to register and explore the app. We're working hard to
              add more features and make your dive logging experience seamless.
            </p>
            <h3>📝 Your Input Matters</h3>
            <p>
              We kindly ask you not to create false dive log entries at this
              time. Your genuine entries will help us improve the app.
            </p>
            <h3>📧 Found an Issue?</h3>
            <p>
              If you encounter any issues or have suggestions, we'd love to hear
              from you! Please email us at{' '}
              <a href='mailto:chad@seasaba.com'>chad@seasaba.com</a>.
            </p>
          </div>
        </Container>
      </div>
    )
  })
)

export default Home
