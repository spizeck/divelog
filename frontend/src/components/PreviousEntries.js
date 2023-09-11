import React, { useState, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import {
  Table,
  Button,
  Icon,
  Container,
  Message,
  Modal,
  Form,
  Input,
  Pagination
} from 'semantic-ui-react'
import diveFormData from './DiveForm/steps/DiveFormData'
import unitConverter from '../utils/convertUnits'
import '../styles/PreviousEntries.css'

const PreviousEntries = inject('rootStore')(
  observer(({ rootStore }) => {
    const { diveStore, userStore } = rootStore
    const { fetchDivesByGuide, dives, currentPage, totalPages, error } =
      diveStore
    const { firstName, preferredUnits } = userStore
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [editOpen, setEditOpen] = useState(false)
    const [formState, setFormState] = useState({})

    useEffect(() => {
      fetchDivesByGuide({'diveGuide': firstName})
    }, [firstName])

    const timeMap = {
      1: '9:00 am',
      2: '11:00 am',
      3: '1:00 pm',
      4: '3:00 pm',
      5: 'Night Dive'
    }

    const units =
      preferredUnits === 'imperial'
        ? { depth: 'ft', temperature: 'F' }
        : { depth: 'M', temperature: 'C' }

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
                <Table.HeaderCell>
                  Water Temperature ({units.temperature})
                </Table.HeaderCell>
                <Table.HeaderCell>Edit/Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dives.map(dive => (
                <Table.Row key={dive.diveId}>
                  <Table.Cell>{dive.date}</Table.Cell>
                  <Table.Cell>{timeMap[dive.diveNumber]}</Table.Cell>
                  <Table.Cell>{dive.boatName}</Table.Cell>
                  <Table.Cell>{dive.diveSite}</Table.Cell>
                  <Table.Cell>{dive.maxDepth}</Table.Cell>
                  <Table.Cell>{dive.waterTemperature}</Table.Cell>
                  <Table.Cell>
                    <Button
                      size='tiny'
                      icon
                      // onClick={() => handleEditOpen(dive)}
                    >
                      <Icon name='edit' />
                    </Button>
                    <Button
                      size='tiny'
                      icon
                      // onClick={() => handleDelete(dive.diveId)}
                    >
                      <Icon name='trash' />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='7'>
                  <Pagination
                    // activePage={page}
                    // totalPages={totalPages}
                    // onPageChange={handlePageChange}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Container>
      </>
    )
  })
)

export default PreviousEntries

{
  /* Edit Modal */
}

{
  /* <Modal open={editOpen}>
          <Modal.Header>Edit Dive --- ID: {formState.diveId}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form size='tiny' onSubmit={handleEditSubmit}>
                {Object.entries(diveFormData).map(([key, value]) => {
                  if (key === 'diveGuide') {
                    return null
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
                    )
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
                    )
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
                    )
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
                    )
                  }
                })}
                <Button.Group fluid>
                  <Button color='grey' type='button' onClick={handleEditClose}>
                    Cancel
                  </Button>
                  <Button.Or className='or-button' />
                  <Button primary type='submit'>
                    Submit
                  </Button>
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
  })
)

export default PreviousEntries */
}
