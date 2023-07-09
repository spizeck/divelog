import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import {
  Table,
  Button,
  Icon,
  Container,
  Message,
  Modal,
  Form,
  Input
} from 'semantic-ui-react'
import diveFormData from '../components/diveData'

const PreviousEntries = ({ username, token }) => {
  const [entries, setEntries] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [formState, setFormState] = useState({})
  const [units, setUnits] = useState({})

  const handleEditOpen = entry => {
    setFormState(entry)
    setEditOpen(true)
  }

  const handleEditClose = () => {
    setFormState({})
    setEditOpen(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const divesResponse = await api.getDivesByGuide(username, 1);
        console.log(divesResponse); // Need to update to pull page number from state

        if (Array.isArray(divesResponse.dives)) {
          const dives = divesResponse.dives.map(dive => ({
            id: dive.id,
            date: dive.date,
            diveNumber: dive.diveNumber, // Update property name according to the response
            boatName: dive.boat,
            diveSite: dive.diveSite,
            maxDepth: dive.maxDepth,
            waterTemperature: dive.waterTemperature,
          }));
          setEntries(dives);
          console.log(dives)

          const unitsResponse = await api.getPreferences(token);
          if (unitsResponse.status === 200) {
            if (unitsResponse.preferredUnits === 'metric') {
              setUnits({
                units: 'metric',
                depth: 'm',
                temp: '°C',
              })
            } else {
              setUnits({
                units: 'imperial',
                depth: 'ft',
                temp: '°F',
              })
            }
          }
        }
        } catch (error) {
          setErrorMessage(error.message);
        }
      };

      fetchData();
    }, [username, token]);


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
          .getDivesByGuide(username)
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
            {entries.map(entry => (
              <Table.Row key={entry.id}>
                <Table.Cell>{entry.date}</Table.Cell>
                <Table.Cell>{entry.diveNumber}</Table.Cell>
                <Table.Cell>{entry.boatName}</Table.Cell>
                <Table.Cell>{entry.diveSite}</Table.Cell>
                <Table.Cell>{entry.maxDepth}</Table.Cell>
                <Table.Cell>{entry.waterTemperature}</Table.Cell>
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
            )}
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
              {Object.entries(diveFormData).map(([key, value]) => {
                if (value.type === 'select') {
                  return (
                    <Form.Field key={key}>
                      <label>{value.label}</label>
                      <Form.Select
                        name={value.name}
                        options={value.options}
                        value={formState[value.name]}
                        onChange={handleInputChange}
                      />
                    </Form.Field>
                  );
                } else if (value.name === 'waterTemperature') {
                  return (
                    <Form.Field key={key}>
                      <label>
                        {value.label} ({units.temp})
                      </label>
                      <Input
                        type={value.type}
                        name={value.name}
                        value={formState[value.name]}
                        onChange={handleInputChange}
                      />
                    </Form.Field>
                  );
                } else if (value.name === 'maxDepth') {
                  return (
                    <Form.Field key={key}>
                      <label>
                        {value.label} ({units.depth})
                      </label>
                      <Input
                        type={value.type}
                        name={value.name}
                        value={formState[value.name]}
                        onChange={handleInputChange}
                      />
                    </Form.Field>
                  );
                } else {
                  return (
                    <Form.Field key={key}>
                      <label>{value.label}</label>
                      <Input
                        type={value.type}
                        name={value.name}
                        value={formState[value.name]}
                        onChange={handleInputChange}
                      />
                    </Form.Field>
                  );
                }
              })}
              <Button type='button' onClick={handleEditClose}>
                Cancel
              </Button>
              <Button type='submit'>Submit</Button>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default PreviousEntries
