import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Message } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'
import '../styles/Login.css'

// validate email using regular expression - Maybe change to a better one later
function validateEmail (email) {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

const ForgotPassword = inject('rootStore')(
  observer(({ rootStore }) => {
    const { authStore } = rootStore
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()

    // Forgot password function in the authStore
    const handleForgotPassword = async e => {
      e.preventDefault()
      if (isSubmitting) return

      if (email === '') {
        setErrorMessage('Please enter your email')
        return
      }
      if (!validateEmail(email)) {
        setErrorMessage('Please enter a valid email')
        return
      }
      setIsSubmitting(true)

      try {
        const forgotPasswordResponse = await authStore.forgotPassword(email)
        if (forgotPasswordResponse.status === 200) {
          setSuccessMessage(forgotPasswordResponse.message)
          setTimeout(() => {
            navigate('/login')
          }, 3000)
        } else {
          setErrorMessage(authStore.errorMessage)
        }
      } catch (error) {
        setErrorMessage(authStore.errorMessage)
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <div className='login-container'>
        <Form className='login-form' onSubmit={handleForgotPassword}>
          <h1>Forgot Password</h1>
          <Form.Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button fluid type='submit' primary disabled={isSubmitting}>
            Reset Password
          </Button>
          <p></p>
          <Button
            fluid
            type='button'
            onClick={() => {
              navigate('/login')
            }}
          >
            Back
          </Button>
          {successMessage && <Message positive>{successMessage}</Message>}
          {errorMessage && <Message negative>{errorMessage}</Message>}
        </Form>
      </div>
    )
  })
)

export default ForgotPassword
