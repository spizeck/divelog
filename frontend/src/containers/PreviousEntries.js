import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import {
  Table,
  Button,
  Icon,
  Container,
  Message,
  Modal,
  Form
} from 'semantic-ui-react'
import diveFormData from '../components/diveData'

const PreviousEntries = token => {
  const [entries, setEntries] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [formState, setFormState] = useState({})

  const handleEditOpen = entry => {
    setFormState(entry)
    setEditOpen(true)
  }

  const handleEditClose = () => {
    setFormState({})
    setEditOpen(false)
  }

  useEffect(() => {
    api
      .getDivesByGuide(token)
      .then(response => {
        setEntries(response.data)
        console.log(response.data)
      })
      .catch(error => {
        setErrorMessage(error.message)
      })
  }, [token])

  const handleInputChange = (e, { name, value }) => {
    setFormState({ ...formState, [name]: value })
  }

  const handleEditSubmit = id => {
    api
      .editDive(id, formState)
      // check if response is successful
      .then(response => {
        // if successful, call the API again to get the updated list of entries
        api
          .getDivesByGuide(token)
          .then(response => {
            setEntries(response.data)
            setSuccessMessage(response.message)
            setErrorMessage('')
          })
          .catch(error => {
            setSuccessMessage('')
            setErrorMessage(error.message)
          })
      })
      .catch(error => {
        setSuccessMessage('')
        setErrorMessage(error.message)
      })
  }

  const handleDelete = id => {
    api
      .deleteDive(id)
      // check if response is successful
      .then(response => {
        if (response.status === 200) {
          api
            .getDivesByGuide(token)
            .then(response => {
              setEntries(response.data)
              setSuccessMessage(response.message)
              setErrorMessage('')
            })
            .catch(error => {
              setSuccessMessage('')
              setErrorMessage(error.message)
            })
        }
      })
      .catch(error => {
        setSuccessMessage('')
        setErrorMessage(error.message)
      })
  }

  // Main content
  return (
    <>
      <Container>
        <h2>Previous Entries</h2>
        {errorMessage && (
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>{errorMessage}</p>
          </Message>
        )}
        {successMessage && (
          <Message positive>
            <Message.Header>Success</Message.Header>
            <p>{successMessage}</p>
          </Message>
        )}
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Dive Number</Table.HeaderCell>
              <Table.HeaderCell>Boat Name</Table.HeaderCell>
              <Table.HeaderCell>Dive Site</Table.HeaderCell>
              <Table.HeaderCell>Max Depth</Table.HeaderCell>
              <Table.HeaderCell>Water Temperature</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {entries.map(entry => {
              return (
                <Table.Row key={entry.id}>
                  <Table.Cell>{entry.date}</Table.Cell>
                  <Table.Cell>{entry.dive_number}</Table.Cell>
                  <Table.Cell>{entry.boat_name}</Table.Cell>
                  <Table.Cell>{entry.dive_site}</Table.Cell>
                  <Table.Cell>{entry.max_depth}</Table.Cell>
                  <Table.Cell>{entry.water_temperature}</Table.Cell>
                  <Table.Cell>
                    <Button
                      icon
                      labelPosition='left'
                      onClick={() => handleEditOpen(entry.id)}
                    >
                      <Icon name='edit' />
                      Edit
                    </Button>
                    <Button
                      icon
                      labelPosition='left'
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Icon name='trash' />
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Container>

      {/* Edit Modal */}

      <Modal open={editOpen} onClose={handleEditClose} closeIcon>
        <Modal.Header>Edit Entry</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form onSubmit={handleEditSubmit}>
              {/* Iterate through diveFormData */}
              {diveFormData.map((data, index) => {
                return (
                  <Form.Field key={index}>
                    <label>{data.label}</label>
                    <input
                      type={data.type}
                      name={data.name}
                      value={formState[data.name] || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Field>
                )
              })}
              <Button type='submit'>Submit</Button>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default PreviousEntries
