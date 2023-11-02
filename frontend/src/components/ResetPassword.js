import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Form, Message } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'
import { validatePasswordStrength } from '../utils/validators'
import '../styles/Login.css'

const ResetPassword = inject('rootStore')(
  observer(({ rootStore }) => {
    const { authStore } = rootStore
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [token, setToken] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
      const queryParams = new URLSearchParams(location.search)
      const resetToken = queryParams.get('token')
      if (resetToken) {
        setToken(resetToken)
      } else {
        const timeoutId = setTimeout(() => {
          setErrorMessage(
            'Your password reset link has expired. Please try again.'
          )
          navigate('/forgot_password')
        }, 3000)
        return () => clearTimeout(timeoutId)
      }
    }, [location, navigate])

    // Reset password function in the authStore
    const handleResetPassword = async e => {
      e.preventDefault()
      if (isSubmitting) return
      setSuccessMessage('')
      setErrorMessage('')
      if (newPassword !== confirmPassword) {
        setErrorMessage('Passwords do not match')
        return
      }
      if (!validatePasswordStrength(newPassword)) {
        setErrorMessage(
          'Password must be at least 8 characters long and contain at least one number and one uppercase letter'
        )
        return
      }
      setIsSubmitting(true)
      try {
        // Assuming `changePassword` returns a promise
        const response = await authStore.changePassword(token, newPassword)
        console.log(response)
        if (response.status === 200) {
          setSuccessMessage(response.message)
          setTimeout(() => {
            navigate('/login')
          }, 3000)
        }
      } catch (error) {
        setErrorMessage(authStore.errorMessage)
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <div className='login-container'>
        <Form className='login-form' onSubmit={handleResetPassword}>
          <h1>Reset Password</h1>
          <Form.Input
            type='password'
            placeholder='New Password'
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <Form.Input
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <Button fluid type='submit' primary disabled={isSubmitting}>
            Change Password
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

export default ResetPassword
