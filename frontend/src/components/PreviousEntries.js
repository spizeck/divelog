import React, { useState, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
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
  Dropdown
} from 'semantic-ui-react'
import diveFormData from './DiveForm/steps/DiveFormData'
import unitConverter from '../utils/convertUnits'
import '../styles/PreviousEntries.css'

const PreviousEntries = inject('rootStore')(
  observer(({ rootStore }) => {
    const { diveStore, userStore } = rootStore
    const {
      fetchDivesByGuide,
      dives,
      currentPage,
      totalPages,
      error,
      editDive
    } = diveStore
    const { firstName, preferredUnits } = userStore
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [editOpen, setEditOpen] = useState(false)
    const [formState, setFormState] = useState({})
    const [activePage, setActivePage] = useState(1)

    useEffect(() => {
      fetchDivesByGuide(firstName).then(() => {
        console.log(toJS(dives))
      })
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

    const handleEditOpen = dive => {
      setFormState(dive.diveId)
      setEditOpen(true)
    }

    const handleEditClose = () => {
      setEditOpen(false)
      setFormState({})
    }

    const handleInputChange = (e, { name, value }) => {
      setFormState({ ...formState, [name]: value })
    }

    const handleEditSubmit = async () => {
      try {
        await editDive(formState.diveId, formState)
        setSuccessMessage(diveStore.successMessage)
        setErrorMessage('')
        handleEditClose()
        fetchDivesByGuide({ diveGuide: firstName })
      } catch (error) {
        setErrorMessage(diveStore.errorMessage)
      }
    }

    return (
      <Container>
        {errorMessage && <Message negative content={errorMessage} />}
        {successMessage && <Message positive content={successMessage} />}
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Dive Number</Table.HeaderCell>
              <Table.HeaderCell>Boat</Table.HeaderCell>
              <Table.HeaderCell>Dive Site</Table.HeaderCell>
              <Table.HeaderCell>Max Depth ({units.depth})</Table.HeaderCell>
              <Table.HeaderCell>
                Water Temp ({units.temperature})
              </Table.HeaderCell>
              <Table.HeaderCell>Edit</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {dives.map((dive, index) => (
              <Table.Row key={index}>
                <Table.Cell>{dive.date}</Table.Cell>
                <Table.Cell>{dive.diveNumber}</Table.Cell>
                <Table.Cell>{dive.boat}</Table.Cell>
                <Table.Cell>{dive.diveSite}</Table.Cell>
                <Table.Cell>{dive.maxDepth}</Table.Cell>
                <Table.Cell>{dive.waterTemperature}</Table.Cell>
                <Table.Cell>
                  <Button
                    icon
                    color='blue'
                    size='small'
                    onClick={() => handleEditOpen(dive)}
                  >
                    <Icon name='edit' />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <Modal open={editOpen} onClose={handleEditClose}>
          <Modal.Header>Edit Dive</Modal.Header>
          <Modal.Content>
            <Form onSubmit={handleEditSubmit}>
              <Form.Field>
                <label>Date</label>
                <Input
                  type='date'
                  name='date'
                  value={formState.date}
                  onChange={handleInputChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Dive Number</label>
                <Dropdown
                  placeholder='Select Dive Number'
                  name='diveNumber'
                  value={formState.diveNumber}
                  onChange={handleInputChange}
                  options={diveFormData.diveNumberOptions.options}
                />
              </Form.Field>
              <Button type='submit'>Update</Button>
              <Button onClick={handleEditClose}>Cancel</Button>
            </Form>
          </Modal.Content>
        </Modal>
      </Container>
    )
  })
)

export default PreviousEntries
