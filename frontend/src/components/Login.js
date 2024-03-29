import React, { useState } from 'react'
import { observer, inject } from 'mobx-react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Message } from 'semantic-ui-react'
import '../styles/Login.css'

const Login = inject('rootStore')(
  observer(({ rootStore }) => {
    const { authStore } = rootStore

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    
    const navigate = useNavigate()

    // handle login function using the login function in the authStore
    const handleLogin = async e => {
      e.preventDefault()
      try {
        await authStore.login(username, password)
        if (authStore.errorMessage) {
          setErrorMessage(authStore.errorMessage)
          setSuccessMessage('')
        } else {
          setSuccessMessage(authStore.loginMessage)
          setErrorMessage('')
          setTimeout(() => {
            navigate('/home')
          }, 1500)
        }
      } catch (error) {
        setErrorMessage(error.message)
      }
    }

    return (
      <div className='login-container'>
        <div className='login-form'>
          <Form onSubmit={handleLogin}>
            <h1>Please Log In</h1>
            <Form.Input
              type='text'
              placeholder='Username or Email'
              value={username}
              onChange={(e, { value }) => setUsername(value)}
            />
            <Form.Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e, { value }) => setPassword(value)}
            />

            <Button fluid className='login-button' type='submit' primary>
              Log In
            </Button>

          </Form>
          <div className='login-footer'>
            <Button.Group fluid>
              <Button
                className='small-buttons'
                positive
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
              <Button.Or className='or-button' />
              <Button
                className='small-buttons'
                negative
                onClick={() => navigate('/forgot_password')}
              >
                Forgot Password
              </Button>
            </Button.Group>
            {successMessage && <Message positive>{successMessage}</Message>}
            {errorMessage && <Message negative>{errorMessage}</Message>}
          </div>
        </div>
      </div>
    )
  })
)

export default Login
