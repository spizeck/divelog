import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Message, Select } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../styles/Preferences.css';

import api from '../utils/api';

const Preferences = ({ token, username, handleLoginSuccess }) => {
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userResponse = await api.getCurrentUser(token);
        setNewUsername(userResponse.username);
        setNewEmail(userResponse.email);
        setNewUnit(userResponse.preferred_units);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== verifyPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const updateResponse = await api.updateUser(
        username,
        newUsername,
        newEmail,
        newPassword,
        newUnit
      );

      if (updateResponse.status === 200) {
        setSuccessMessage(updateResponse.message);
        handleLoginSuccess(updateResponse.token, updateResponse.username);
        setIsEditing(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setVerifyPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleUnitChange = (e, { value }) => {
    setNewUnit(value);
  };

  const renderPreferencesForm = () => (
    <Form onSubmit={handleUpdate}>
      <h1>Update your preferences</h1>
      <Form.Field>
        <label>Username</label>
        <Form.Input
          type='text'
          value={newUsername}
          onChange={(e, { value }) => setNewUsername(value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Email</label>
        <Form.Input
          type='text'
          value={newEmail}
          onChange={(e, { value }) => setNewEmail(value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <Form.Input
          type='password'
          value={newPassword}
          onChange={(e, { value }) => setNewPassword(value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Verify Password</label>
        <Form.Input
          type='password'
          value={verifyPassword}
          onChange={(e, { value }) => setVerifyPassword(value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Unit</label>
        <Select
          options={[
            { key: 'imperial', value: 'Imperial', text: 'Imperial' },
            { key: 'metric', value: 'Metric', text: 'Metric' },
          ]}
          value={newUnit}
          onChange={handleUnitChange}
        />
      </Form.Field>
      <div className='preferences-footer'>
        <Button.Group fluid>
          <Button className='small-buttons' color='grey' onClick={handleCancel}>
            Cancel
          </Button>
          <Button.Or className='or-button' />
          <Button className='small-buttons' type='submit' primary>
            Update
          </Button>
        </Button.Group>
        {errorMessage && <Message negative>{errorMessage}</Message>}
      </div>
    </Form>
  );

  const renderPreferencesView = () => (
    <Container>
      <div className='preferences-view'>
        <h1>Your Preferences</h1>
        <p>
          <strong>Username:</strong> {newUsername}
        </p>
        <p>
          <strong>Email:</strong> {newEmail}
        </p>
        <p>
          <strong>Unit:</strong> {newUnit}
        </p>
        <Button fluid color='grey' className='edit-button' onClick={handleEdit}>
          Edit
        </Button>
      </div>
    </Container>
  );

  return isEditing ? renderPreferencesForm() : renderPreferencesView();
};

export default Preferences;