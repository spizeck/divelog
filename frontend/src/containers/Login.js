import React, { useState } from 'react'
import { observer, inject } from 'mobx-react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Message } from 'semantic-ui-react'
import '../styles/Login.css'
import api from '../utils/api'

const Login = inject('authStore')(observer(({ authStore }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const navigate = useNavigate()

  const handleLogin = async e => {
    e.preventDefault()

    try {
      // Send login request to the backend
      let loginResponse
      if (username.includes('@')) {
        loginResponse = await api.loginWithEmail(username, password)
      } else {
        loginResponse = await api.loginWithUsername(username, password)
      }

      if (loginResponse.status === 200) {
        // Login successful, display message and execute handleLoginSuccess
        setSuccessMessage(loginResponse.message)
        authStore.handleLoginSuccess(
          loginResponse.token,
          loginResponse.username,
          loginResponse.preferred_units,
          loginResponse.first_name
        )
        navigate('/home')
      } else {
        // Login failed, display error message
        setErrorMessage(loginResponse.message)
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
          {successMessage && <Message positive>{successMessage}</Message>}
          {errorMessage && <Message negative>{errorMessage}</Message>}
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
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password
            </Button>
          </Button.Group>
        </div>
      </div>
    </div>
  )
}))

export default Login
