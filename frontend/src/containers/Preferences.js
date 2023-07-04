import React, { useState, useEffect } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import api from '../utils/api';

const Preferences = ({ loggedIn, username, handleLoginSuccess }) => {
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingUnit, setIsEditingUnit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userResponse = await api.getCurrentUser();
        setNewUsername(userResponse.username);
        setNewEmail(userResponse.email);
        setNewUnit(userResponse.preferred_units);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updateResponse = await api.updateUser(
        username,
        newUsername,
        newEmail,
        newPassword,
        newPassword2,
        newUnit
      );

      if (updateResponse.status === 200) {
        setSuccessMessage(updateResponse.message);
        handleLoginSuccess(updateResponse.token, updateResponse.username);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleEditUsername = () => {
    setIsEditingUsername(true);
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
  };

  const handleEditUnit = () => {
    setIsEditingUnit(true);
  };

  return (
    <div className='preferences-container'>
      <div className='preferences-form'>
        <Form onSubmit={handleUpdate}>
          <h1>Update your preferences</h1>
          <Form.Field>
            <label>Username</label>
            {isEditingUsername ? (
              <Form.Input
                type='text'
                value={newUsername}
                onChange={(e, { value }) => setNewUsername(value)}
              />
            ) : (
              <span>{newUsername}</span>
            )}
            {!isEditingUsername && (
              <Button primary onClick={handleEditUsername}>
                Edit
              </Button>
            )}
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            {isEditingEmail ? (
              <Form.Input
                type='text'
                value={newEmail}
                onChange={(e, { value }) => setNewEmail(value)}
              />
            ) : (
              <span>{newEmail}</span>
            )}
            {!isEditingEmail && (
              <Button primary onClick={handleEditEmail}>
                Edit
              </Button>
            )}
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            {isEditingPassword ? (
              <Form.Input
                type='password'
                value={newPassword}
                onChange={(e, { value }) => setNewPassword(value)}
              />
            ) : (
              <span>********</span>
            )}
            {!isEditingPassword && (
              <Button primary onClick={handleEditPassword}>
                Edit
              </Button>
            )}
          </Form.Field>
          <Form.Field>
            <label>Unit</label>
            {isEditingUnit ? (
              <Form.Input
                type='text'
                value={newUnit}
                onChange={(e, { value }) => setNewUnit(value)}
              />
            ) : (
              <span>{newUnit}</span>
            )}
            {!isEditingUnit && (
              <Button primary onClick={handleEditUnit}>
                Edit
              </Button>
            )}
          </Form.Field>
          <Button fluid className='update-button' type='submit' primary>
            Update
          </Button>
          {successMessage && <Message positive>{successMessage}</Message>}
          {errorMessage && <Message negative>{errorMessage}</Message>}
        </Form>
      </div>
    </div>
  );
};

export default Preferences;

