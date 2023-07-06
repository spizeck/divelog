import React, { useState, useEffect } from 'react'
import {
  Button,
  Container,
  Message,
  Select,
  Table,
  Modal,
  Form
} from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import '../styles/Preferences.css'

import api from '../utils/api'

const Preferences = ({ token, setUsername }) => {
  const [originalUsername, setOriginalUsername] = useState('')
  const [originalEmail, setOriginalEmail] = useState('')
  const [originalUnit, setOriginalUnit] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [newUnit, setNewUnit] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingField, setEditingField] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isApproved, setIsApproved] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userResponse = await api.getCurrentUser(token)
        setOriginalUsername(userResponse.username)
        setNewUsername(userResponse.username)
        setOriginalEmail(userResponse.email)
        setNewEmail(userResponse.email)
        setIsApproved(userResponse.isApproved)
        setIsAdmin(userResponse.isAdmin)
        setUsername(capitalizeFirstLetter(userResponse.username))

        const preferencesResponse = await api.getPreferences(token)
        setOriginalUnit(preferencesResponse.preferredUnits)
        setNewUnit(preferencesResponse.preferredUnits)
      } catch (error) {
        setTimeout(() => {
          setErrorMessage(error.message)
        }, 1000)
        window.location.reload()
      }
    }

    fetchCurrentUser()
  }, [token, setUsername])

  const handleUpdate = async e => {
    e.preventDefault()

    if (newPassword !== verifyPassword) {
      setErrorMessage('Passwords do not match')
      return
    }
    // Check what field is being updated and call the appropriate API endpoint
    try {
      if (editingField === 'username') {
        const updateUsername = await api.updateUser(token, {
          newUsername: newUsername
        })
        if (updateUsername.status === 200) {
          setSuccessMessage(updateUsername.message)
          setUsername(capitalizeFirstLetter(newUsername))
          setOriginalUsername(newUsername)
          setErrorMessage('')
          setIsEditing(false)
        }
      } else if (editingField === 'email') {
        const updateEmail = await api.updateUser(token, {
          newEmail: newEmail
        })
        if (updateEmail.status === 200) {
          setSuccessMessage(updateEmail.message)
          setOriginalEmail(newEmail)
          setErrorMessage('')
          setIsEditing(false)
        }
      } else if (editingField === 'password') {
        const updatePassword = await api.updateUser(token, {
          newPassword: newPassword
        })
        if (updatePassword.status === 200) {
          setSuccessMessage(updatePassword.message)
          setErrorMessage('')
          setIsEditing(false)
        }
      } else if (editingField === 'preferredUnit') {
        const updateUnit = await api.updatePreferences(token, {
          newPreferredUnits: newUnit
        })
        if (updateUnit.status === 200) {
          setSuccessMessage(updateUnit.message)
          setOriginalUnit(newUnit)
          setErrorMessage('')
          setIsEditing(false)
        }
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleEdit = field => {
    setEditingField(field)
    setIsEditing(true)
  }

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setNewUsername(originalUsername)
    setNewEmail(originalEmail)
    setNewUnit(originalUnit)
    setNewPassword('')
    setVerifyPassword('')
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleUnitChange = (e, { value }) => {
    setNewUnit(value)
  }

  const handleCloseModal = () => {
    setEditingField('')
    setIsEditing(false)
    setErrorMessage('')
    setSuccessMessage('')
  }

  const renderPreferencesForm = () => (
    <Modal open={isEditing} onClose={handleCloseModal} closeIcon>
      <Modal.Header>Update your information</Modal.Header>
      <Modal.Content>
        {editingField === 'username' && (
          <>
            <label>Username</label>
            <p></p>
            <Form.Input
              type='text'
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
            />
          </>
        )}
        {editingField === 'email' && (
          <>
            <label>Email</label>
            <p></p>
            <Form.Input
              type='text'
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
            />
          </>
        )}
        {editingField === 'password' && (
          <>
            <label>New Password</label>
            <p></p>
            <Form.Input
              type='password'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <label>Verify Password</label>
            <p></p>
            <Form.Input
              type='password'
              value={verifyPassword}
              onChange={e => setVerifyPassword(e.target.value)}
            />
          </>
        )}
        {editingField === 'preferredUnit' && (
          <>
            <label>Preferred Unit</label>
            <p></p>
            <Select
              placeholder='Select your preferred unit'
              options={[
                { key: 'imperial', text: 'Imperial', value: 'imperial' },
                { key: 'metric', text: 'Metric', value: 'metric' }
              ]}
              value={newUnit}
              onChange={handleUnitChange}
            />
          </>
        )}
        {errorMessage && <Message negative>{errorMessage}</Message>}
        {successMessage && <Message positive>{successMessage}</Message>}
      </Modal.Content>
      <Modal.Actions>
        <Button color='grey' onClick={handleCancel}>
          Cancel
        </Button>
        <Button primary onClick={handleUpdate}>
          Update
        </Button>
      </Modal.Actions>
    </Modal>
  )

  const renderPreferencesView = () => (
    <Container className='preferences-container'>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign='center' colSpan='3'>
              Your Information
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Username:</Table.Cell>
            <Table.Cell>{capitalizeFirstLetter(originalUsername)}</Table.Cell>
            <Table.Cell>
              <Button fluid onClick={() => handleEdit('username')}>
                Change
              </Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Email:</Table.Cell>
            <Table.Cell>{originalEmail}</Table.Cell>
            <Table.Cell>
              <Button fluid onClick={() => handleEdit('email')}>
                Change
              </Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Preferred Unit:</Table.Cell>
            <Table.Cell>{capitalizeFirstLetter(originalUnit)}</Table.Cell>
            <Table.Cell>
              <Button fluid onClick={() => handleEdit('preferredUnit')}>
                Change
              </Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>User Privledges</Table.Cell>
            <Table.Cell colSpan='2'>
              {isApproved ? (isAdmin ? 'Admin' : 'Basic') : 'Read-Only'}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <div className='preferences-footer'>
        {successMessage && <Message positive>{successMessage}</Message>}
        {errorMessage && <Message negative>{errorMessage}</Message>}
      </div>
    </Container>
  )

  return isEditing ? renderPreferencesForm() : renderPreferencesView()
}

export default Preferences