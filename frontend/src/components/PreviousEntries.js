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
  Pagination,
  Select,
  Grid,
  Dropdown
} from 'semantic-ui-react'
import diveFormData from './DiveForm/steps/DiveFormData'
import DiveCard from './DiveCard'
import unitConverter from '../utils/convertUnits'
import '../styles/PreviousEntries.css'

const PreviousEntries = inject('rootStore')(
  observer(({ rootStore }) => {
    const { diveStore, userStore } = rootStore
    const { fetchDivesByGuide, dives, editDive, deleteDive } = diveStore
    const { firstName, preferredUnits } = userStore
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [editOpen, setEditOpen] = useState(false)
    const [formState, setFormState] = useState({})
    const [activePage, setActivePage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [entriesPerPage, setEntriesPerPage] = useState(10)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [diveIdToDelete, setDiveIdToDelete] = useState(null)

    useEffect(() => {
      const fetchData = async () => {
        await fetchDivesByGuide(firstName, activePage, entriesPerPage)
        setTotalPages(diveStore.totalPages)
      }
      fetchData()
    }, [firstName, activePage, entriesPerPage])

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
      const convertedDepth = unitConverter.convertDepthToForm(
        dive.maxDepth,
        preferredUnits
      )
      const convertedTemp = unitConverter.convertTempToForm(
        dive.waterTemperature,
        preferredUnits
      )

      setFormState({
        ...dive,
        maxDepth: convertedDepth,
        waterTemperature: convertedTemp
      })

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
      const metricDepth = unitConverter.convertDepthToDatabase(
        formState.maxDepth,
        preferredUnits
      )
      const metricTemp = unitConverter.convertTempToDatabase(
        formState.waterTemperature,
        preferredUnits
      )
      const updatedDive = {
        ...formState,
        maxDepth: metricDepth,
        waterTemperature: metricTemp
      }
      try {
        await editDive(updatedDive)
        setSuccessMessage(diveStore.successMessage)
        setErrorMessage('')
        handleEditClose()
        fetchDivesByGuide(firstName)
      } catch (error) {
        setErrorMessage(diveStore.errorMessage)
      }
    }

    const handleDeleteOpen = diveId => {
      setDiveIdToDelete(diveId)
      setDeleteConfirmOpen(true)
    }

    const handleDeleteDive = diveId => {
      deleteDive(diveId)
      fetchDivesByGuide(firstName, activePage, entriesPerPage)
      setDeleteConfirmOpen(false)
    }

    const handlePageChange = (e, data ) => {
      setActivePage(data.activePage)
      fetchDivesByGuide(firstName, data.activePage, entriesPerPage)
    }

    const handleEntriesPerPageChange = newEntriesPerPage => {
      setEntriesPerPage(newEntriesPerPage)
      setActivePage(1)
      fetchDivesByGuide(firstName, activePage, newEntriesPerPage)
    }

    return (
      <Container fluid>
        {errorMessage && <Message negative content={errorMessage} />}
        {successMessage && <Message positive content={successMessage} />}
        <div className='table-to-cards'>
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
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dives.map((dive, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{dive.date}</Table.Cell>
                  <Table.Cell>{timeMap[dive.diveNumber]}</Table.Cell>
                  <Table.Cell>{dive.boat}</Table.Cell>
                  <Table.Cell>{dive.diveSite}</Table.Cell>
                  <Table.Cell>
                    {unitConverter.convertDepthToForm(
                      dive.maxDepth,
                      preferredUnits
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {unitConverter.convertTempToForm(
                      dive.waterTemperature,
                      preferredUnits
                    )}
                  </Table.Cell>
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
                  <Table.Cell>
                    <Button
                      icon
                      color='blue'
                      size='small'
                      onClick={() => handleDeleteOpen(dive.id)}
                    >
                      <Icon name='trash alternate outline' />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className='dive-card'>
          {dives.map((dive, index) => (
            <DiveCard
              key={index}
              dive={dive}
              units={units}
              handleEditOpen={handleEditOpen}
              handleDeleteOpen={handleDeleteOpen}
              timeMap={timeMap}
            />
          ))}
        </div>
        <Grid centered columns={1}>
          <Grid.Column textAlign='center'>
            <Pagination
              activePage={activePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Grid.Column>
        </Grid>
        <Grid centered columns={1}>
          <Grid.Column textAlign='center'>
            <label>Entries Per Page: </label>
            <Dropdown
              placeholder='Entries per page'
              options={[
                { key: '10', text: '10', value: 10 },
                { key: '20', text: '20', value: 20 },
                { key: '50', text: '50', value: 50 }
              ]}
              value={entriesPerPage}
              onChange={(e, { value }) => handleEntriesPerPageChange(value)}
            />
          </Grid.Column>
        </Grid>
        
        <Modal open={editOpen} onClose={handleEditClose}>
          <Modal.Header>Edit Dive #{formState.id}</Modal.Header>
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
                <Select
                  placeholder='Select Dive Number'
                  name='diveNumber'
                  value={formState.diveNumber}
                  onChange={handleInputChange}
                  options={diveFormData.diveNumberOptions.options}
                />
              </Form.Field>
              <Form.Field>
                <label>Boat</label>
                <Select
                  placeholder='Select Boat'
                  name='boat'
                  value={formState.boat}
                  onChange={handleInputChange}
                  options={diveFormData.boatNameOptions.options}
                />
              </Form.Field>
              <Form.Field>
                <label>Dive Site</label>
                <Select
                  placeholder='Select Dive Site'
                  name='diveSite'
                  value={formState.diveSite}
                  onChange={handleInputChange}
                  options={diveFormData.diveSiteOptions.options}
                />
              </Form.Field>
              <Form.Field>
                <label>Max Depth ({units.depth})</label>
                <Input
                  type='number'
                  name='maxDepth'
                  value={formState.maxDepth}
                  onChange={handleInputChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Water Temp ({units.temperature})</label>
                <Input
                  type='number'
                  name='waterTemperature'
                  value={formState.waterTemperature}
                  onChange={handleInputChange}
                />
              </Form.Field>
              <Button type='submit'>Update</Button>
              <Button onClick={handleEditClose}>Cancel</Button>
            </Form>
          </Modal.Content>
        </Modal>

        <Modal
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <Modal.Header>Delete Dive #{diveIdToDelete}</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to delete this dive?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color='red'
              onClick={() => handleDeleteDive(diveIdToDelete)}
            >
              Delete
            </Button>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          </Modal.Actions>
        </Modal>
      </Container>
    )
  })
)

export default PreviousEntries
