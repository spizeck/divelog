import React, { useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import {
  Button,
  Container,
  Message,
  Select,
  Table,
  Modal,
  Form
} from 'semantic-ui-react'
import {validateEmailFormat, validatePasswordStrength, validateUsername} from '../utils/validators'

import '../styles/Preferences.css'

const Preferences = inject('rootStore')(observer(({ rootStore }) => {
  const { authStore, userStore } = rootStore

  useEffect(() => {
    if (userStore.userStatus === 'idle' && authStore.authStatus === 'idle') {
      userStore.fetchUserData()
    }
  }, [userStore, authStore])

  // handle submit function that calls the updateUser function in the authStore
  const handleSubmit = async e => {
    e.preventDefault()
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
            <Table.Cell>User Privileges</Table.Cell>
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

}))

export default Preferences