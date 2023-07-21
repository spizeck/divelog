import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Message } from 'semantic-ui-react'
import '../styles/Login.css'
import { inject, observer } from 'mobx-react'

const FormInput = ({ type, placeholder, value, setValue }) => (
  <Form.Input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={e => setValue(e.target.value)}
  />
)

const Register = inject('rootStore')(
  observer(({ rootStore }) => {
    const { authStore } = rootStore
    const { register } = authStore
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
      firstName: '',
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      preferredUnits: 'imperial', // 'imperial', 'metric'
      successMessage: '',
      errorMessage: ''
    })

    const handleRegister = async e => {
      e.preventDefault()

      if (formData.password !== formData.confirmPassword) {
        setFormData({ ...formData, errorMessage: 'Passwords do not match' })
        return
      }
      // Send the registration request to the authStore
      try {
        const registerResponse = await register(
          formData.username,
          formData.email,
          formData.password,
          formData.firstName,
          formData.preferredUnits
        )
        if (registerResponse.status === 201) {
          setFormData({
            ...formData,
            successMessage: registerResponse.message,
            errorMessage: ''
          })
          setTimeout(() => {
            navigate('/login')
          }, 3000)
        } else {
          setFormData({
            ...formData,
            errorMessage: registerResponse.message,
            successMessage: ''
          })
        }
      } catch (error) {
        setFormData({ ...formData, errorMessage: error.message })
      }
    }

    return (
      <div className='login-container'>
        <Form onSubmit={handleRegister} className='login-form'>
          <h1>Please Register</h1>
          <FormInput
            type='text'
            placeholder='Username'
            value={formData.username}
            setValue={value => setFormData({ ...formData, username: value })}
          />
          <FormInput
            type='text'
            placeholder='First Name'
            value={formData.firstName}
            setValue={value => setFormData({ ...formData, firstName: value })}
          />
          <FormInput
            type='text'
            placeholder='Email'
            value={formData.email}
            setValue={value => setFormData({ ...formData, email: value })}
          />
          <FormInput
            type='password'
            placeholder='Password'
            value={formData.password}
            setValue={value => setFormData({ ...formData, password: value })}
          />
          <FormInput
            type='password'
            placeholder='Confirm Password'
            value={formData.confirmPassword}
            setValue={value =>
              setFormData({ ...formData, confirmPassword: value })
            }
          />
          <Form.Select
            fluid
            label='Preferred Units'
            options={[
              { key: 'imperial', text: 'Imperial', value: 'imperial' },
              { key: 'metric', text: 'Metric', value: 'metric' }
            ]}
            value={formData.preferredUnits}
            onChange={(e, { value }) =>
              setFormData({ ...formData, preferredUnits: value })
            }
          />
          <Button fluid type='submit' primary>
            Register
          </Button>
          <p></p>
          <Button fluid type='button' onClick={() => navigate('/login')}>
            Back
          </Button>
          {formData.successMessage && (
            <Message positive>{formData.successMessage}</Message>
          )}
          {formData.errorMessage && <Message negative>{formData.errorMessage}</Message>}
        </Form>
      </div>
    )
  })
)

export default Register
