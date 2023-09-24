import React, { useEffect, useState } from 'react'
import { observer, inject } from 'mobx-react'
import {
  Button,
  Container,
  Message,
  Table,
  Modal,
  Form,
  Dropdown
} from 'semantic-ui-react'
import {
  validateEmailFormat,
  validatePasswordStrength,
  validateUsername
} from '../utils/validators'

import '../styles/Preferences.css'

const Preferences = inject('rootStore')(
  observer(({ rootStore }) => {
    const { authStore, userStore } = rootStore
    const { firstName, username, email, preferredUnits, approved, admin } =
      userStore
    const { updateUser } = authStore

    const [isEditing, setIsEditing] = useState(false)
    const [editingField, setEditingField] = useState('')
    const [newFirstName, setNewFirstName] = useState('')
    const [newUsername, setNewUsername] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPreferredUnits, setNewPreferredUnits] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [verifyPassword, setVerifyPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
      userStore.fetchUserData()
    }, [userStore, authStore])

    const privileges = approved ? (admin ? 'Admin' : 'Basic') : 'Read-Only'

    const handleUpdate = async () => {
      let userData = {}

      switch (editingField) {
        case 'firstName':
          userData.newFirstName = newFirstName
          break
        case 'username':
          if (!validateUsername(newUsername)) {
            setErrorMessage(
              'Username can only contain letters, numbers, underscores, and hyphens.'
            )
            return
          }
          userData.newUsername = newUsername
          break
        case 'email':
          if (!validateEmailFormat(newEmail)) {
            setErrorMessage('Please enter a valid email address.')
            return
          }
          userData.newEmail = newEmail
          break
        case 'preferredUnits':
          userData.newPreferredUnits = newPreferredUnits
          break
        case 'password':
          if (!validatePasswordStrength(newPassword)) {
            setErrorMessage('Please enter a valid password.')
            return
          }
          if (newPassword !== verifyPassword) {
            setErrorMessage('Passwords do not match.')
            return
          }
          userData.newPassword = newPassword
          break
        default:
          break
      }
      // setIsEditing(false)
      try {
        console.log("calling updateUser",userData)
        updateUser(userData)
        console.log("called it")
        setSuccessMessage('Success!')
        userStore.fetchUserData()
        setTimeout(function () {
          handleCloseModal()
        }, 1500)
      } catch (error) {
        setErrorMessage(error.message || 'Failed to update user.')
      }
    }

    const handleEdit = field => {
      setEditingField(field)
      setIsEditing(true)
    }

    const capitalizeFirstLetter = string => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    }

    const handleCloseModal = () => {
      setErrorMessage('')
      setSuccessMessage('')
      setNewFirstName('')
      setNewUsername('')
      setNewEmail('')
      setNewPreferredUnits('')
      setNewPassword('')
      setVerifyPassword('')
      setIsEditing(false)
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
          {editingField === 'firstName' && (
            <>
              <label>First Name</label>
              <p></p>
              <Form.Input
                type='text'
                value={newFirstName}
                onChange={e => setNewFirstName(e.target.value)}
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
          {editingField === 'preferredUnits' && (
            <>
              <label>Preferred Unit</label>
              <p></p>
              <Dropdown
                placeholder='Select your preferred unit'
                options={[
                  { key: 'imperial', text: 'Imperial', value: 'imperial' },
                  { key: 'metric', text: 'Metric', value: 'metric' }
                ]}
                value={newPreferredUnits}
                onChange={(e, { value }) =>{
                console.log("new preferred units", value);
                  setNewPreferredUnits(value)
                }}
              />
            </>
          )}
          {errorMessage && <Message negative>{errorMessage}</Message>}
          {successMessage && <Message positive>{successMessage}</Message>}
        </Modal.Content>
        <Modal.Actions>
          <Button color='grey' onClick={handleCloseModal}>
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
              <Table.Cell>{username}</Table.Cell>
              <Table.Cell>
                <Button fluid onClick={() => handleEdit('username')}>
                  Change
                </Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>First Name:</Table.Cell>
              <Table.Cell>{capitalizeFirstLetter(firstName)}</Table.Cell>
              <Table.Cell>
                <Button fluid onClick={() => handleEdit('firstName')}>
                  Change
                </Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Email:</Table.Cell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>
                <Button fluid onClick={() => handleEdit('email')}>
                  Change
                </Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Preferred Units:</Table.Cell>
              <Table.Cell>{capitalizeFirstLetter(preferredUnits)}</Table.Cell>
              <Table.Cell>
                <Button fluid onClick={() => handleEdit('preferredUnits')}>
                  Change
                </Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>User Privileges</Table.Cell>
              <Table.Cell colSpan='2'>{privileges}</Table.Cell>
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
  })
)

export default Preferences
