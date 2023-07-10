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
  Input,
  Pagination,
} from 'semantic-ui-react'
import diveFormData from '../components/diveData'
import unitConverter from '../utils/convertUnits'
import '../styles/PreviousEntries.css'

const PreviousEntries = ({ username, token }) => {
  const [entries, setEntries] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [formState, setFormState] = useState({})
  const [units, setUnits] = useState({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const entriesPerPage = 10

  const handlePageChange = (e, { activePage }) => {
    if (activePage < 1 || activePage > totalPages) {
      return
    }
    setPage(activePage)
  }

  const handleEditOpen = entry => {
    const { diveId, date, diveNumber, boatName, diveSite, maxDepth, waterTemperature, diveGuide } = entry
    setFormState({
      diveId,
      date,
      diveNumber,
      boatName,
      diveSite,
      maxDepth,
      waterTemperature,
      diveGuide,
    })
    setEditOpen(true)
  }

  const handleEditClose = () => {
    setFormState({})
    setEditOpen(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const divesResponse = await api.getDivesByGuide(username, page);
        if (divesResponse.status !== 200) {
          setErrorMessage(divesResponse.message);
          return;
        }
        if (Array.isArray(divesResponse.dives)) {
          const dives = divesResponse.dives.map(dive => ({
            diveId: dive.id,
            diveGuide: dive.diveGuide,
            date: dive.date,
            diveNumber: dive.diveNumber,
            boatName: dive.boat,
            diveSite: dive.diveSite,
            maxDepth: unitConverter.convertDepthToForm(dive.maxDepth, units.units),
            waterTemperature: unitConverter.convertTempToForm(dive.waterTemperature, units.units),
          }));
          dives.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA.getTime() === dateB.getTime()) {
              return a.diveNumber - b.diveNumber;
            }
            return dateB.getTime() - dateA.getTime();
          })
          setEntries(dives);
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    const fetchUnits = async () => {
      try {
        const unitsResponse = await api.getPreferences(token);
        if (unitsResponse.status === 200) {
          if (unitsResponse.preferredUnits === 'metric') {
            setUnits({
              units: 'metric',
              depth: 'm',
              temp: '°C',
            });
          } else {
            setUnits({
              units: 'imperial',
              depth: 'ft',
              temp: '°F',
            });
          }
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    const fetchTotalPages = async () => {
      try {
        const totalPagesResponse = await api.getPages("diveGuide", username);
        if (totalPagesResponse.status !== 200) {
          setErrorMessage(totalPagesResponse.message);
          return;
        }
        setTotalPages(Math.ceil(totalPagesResponse.count / entriesPerPage));
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchData();
    fetchUnits();
    fetchTotalPages();
  }, [username, page, token, units.units]);

  const handleInputChange = (e, { name, value }) => {
    setFormState(prevState => ({ ...prevState, [name]: value }))
  }

  const handleEditSubmit = () => {
    setFormState(prevState => ({
      ...prevState,
      maxDepth: unitConverter.convertDepthToDatabase(formState.maxDepth, units.units),
      waterTemperature: unitConverter.convertTempToDatabase(formState.waterTemperature, units.units),
    }))
    console.log(formState)
    api
      .editDive(formState)
      .then(response => {
        if (response.status === 200) {
          // update entries with the updated entry
          const updatedEntries = entries.map(entry => {
            if (entry.diveId === formState.diveId) {
              return {
                diveId: formState.diveId,
                diveGuide: formState.diveGuide,
                date: formState.date,
                diveNumber: formState.diveNumber,
                boatName: formState.boatName,
                diveSite: formState.diveSite,
                maxDepth: formState.maxDepth,
                waterTemperature: formState.waterTemperature,
              }
            } else {
              return entry
            }
          })
          setEntries(updatedEntries)
          setSuccessMessage(response.message);
          setErrorMessage('');
          setEditOpen(false);
        } else {
          setSuccessMessage('');
          setErrorMessage(response.message);
        }
      })
      .catch(error => {
        setSuccessMessage('');
        setErrorMessage(error.message);
      });
  };


  const handleDelete = diveId => {
    api
      .deleteDive(diveId)
      // check if response is successful
      .then(response => {
        if (response.status === 200) {
          // remove the deleted entry from the entries array
          const updatedEntries = entries.filter(entry => entry.diveId !== diveId)
          setEntries(updatedEntries)
          setSuccessMessage(response.message);
          setErrorMessage('');
        } else {
          setSuccessMessage('');
          setErrorMessage(response.message);
        }
      })
      .catch(error => {
        setSuccessMessage('');
        setErrorMessage(error.message);
      });
  };

  const timeMap = {
    1: '9:00 am',
    2: '11:00 am',
    3: '1:00 pm',
    4: '3:00 pm',
    5: 'Night Dive',
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
        <Table celled textAlign='center' className='responsive-table'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Dive Number</Table.HeaderCell>
              <Table.HeaderCell>Boat Name</Table.HeaderCell>
              <Table.HeaderCell>Dive Site</Table.HeaderCell>
              <Table.HeaderCell>Max Depth ({units.depth})</Table.HeaderCell>
              <Table.HeaderCell>Water Temperature ({units.temp})</Table.HeaderCell>
              <Table.HeaderCell>Edit/Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body >
            {entries.map(entry => (
              <Table.Row key={entry.diveId}>
                <Table.Cell>{entry.date}</Table.Cell>
                <Table.Cell>
                  {timeMap[entry.diveNumber]}
                </Table.Cell>
                <Table.Cell>{entry.boatName}</Table.Cell>
                <Table.Cell>{entry.diveSite}</Table.Cell>
                <Table.Cell>{entry.maxDepth}</Table.Cell>
                <Table.Cell>{entry.waterTemperature}</Table.Cell>
                <Table.Cell >
                  <Button
                    size='tiny'
                    icon
                    onClick={() => handleEditOpen(entry)}
                  >
                    <Icon name='edit' />
                  </Button>
                  <Button
                    size='tiny'
                    icon
                    onClick={() => handleDelete(entry.diveId)}
                  >
                    <Icon name='trash' />
                  </Button>
                </Table.Cell>
              </Table.Row>
            )
            )}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='7'>
                <Pagination
                  activePage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </Table.HeaderCell>
            </Table.Row>

          </Table.Footer>
        </Table>
      </Container>

      {/* Edit Modal */}

      <Modal open={editOpen}>
        <Modal.Header>Edit Dive --- ID: {formState.diveId}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form size='tiny' onSubmit={handleEditSubmit}>
              {/* Iterate through diveFormData */}
              {Object.entries(diveFormData).map(([key, value]) => {
                if (key === 'diveGuide') {
                  return null;
                }
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
              <Button.Group fluid>
                <Button color='grey' type='button' onClick={handleEditClose}>
                  Cancel
                </Button>
                <Button.Or className='or-button' />
                <Button primary type='submit'>Submit</Button>
              </Button.Group>
            </Form>
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
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default PreviousEntries
