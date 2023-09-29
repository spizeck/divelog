import React, { useState, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import {
  Container,
  Pagination,
  Grid,
  Dropdown,
  Divider
} from 'semantic-ui-react'
import diveFormData from '../DiveForm/steps/DiveFormData'
import DiveCard from './DiveCard'
import EditDiveModal from './EditDiveModal'
import DeleteDiveModal from './DeleteDiveModal'
import SightingModal from './SightingModal'
import DiveTable from './DiveTable'
import unitConverter from '../../utils/convertUnits'
import DiveFormData from '../DiveForm/steps/DiveFormData'
import '../../styles/PreviousEntries.css'

const PreviousEntries = inject('rootStore')(
  observer(({ rootStore }) => {
    const { diveStore, userStore } = rootStore
    const {
      fetchFilteredDives,
      dives,
      editDive,
      deleteDive,
      fetchSightingsForDive
    } = diveStore
    const { preferredUnits } = userStore
    const [editOpen, setEditOpen] = useState(false)
    const [formState, setFormState] = useState({})
    const [activePage, setActivePage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [entriesPerPage, setEntriesPerPage] = useState(10)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [diveIdToDelete, setDiveIdToDelete] = useState(null)
    const [sightingsModalOpen, setSightingsModalOpen] = useState(false)
    const [sightings, setSightings] = useState([])
    const [diveId, setDiveId] = useState(null)
    const [selectedDiveGuides, setSelectedDiveGuides] = useState([])
    const [selectedBoats, setSelectedBoats] = useState([])
    const [selectedDiveSites, setSelectedDiveSites] = useState([])
    const [diveGuides, setDiveGuides] = useState([])
    const [filters, setFilters] = useState({
      boat: [],
      diveSite: [],
      diveGuide: []
    })
    useEffect(() => {
      console.log("Updated filters: ", filters);
    }, [filters]);
    
    useEffect(() => {
      const fetchData = async () => {
        await diveStore.getUniqueDiveGuides();
        const diveGuides = diveStore.diveGuides.map(guide => ({text:guide, value: guide }));
        setDiveGuides(diveGuides);
      };
  
      fetchData();
    }, []);

    useEffect(() => {
      setFilters( prevFilters =>({
        ...prevFilters,
        boat: selectedBoats,
        diveSite: selectedDiveSites,
        diveGuide: selectedDiveGuides
      }))
      console.log("selectedBoats: ", selectedBoats);
      console.log("filters: ", filters);
    }, [selectedBoats, selectedDiveSites, selectedDiveGuides])

    useEffect(() => {
      const fetchData = async () => {
        await fetchFilteredDives(filters, activePage, entriesPerPage)
        setTotalPages(diveStore.totalPages)
      }
      fetchData()
    }, [filters, activePage, entriesPerPage])

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
        handleEditClose()
        fetchFilteredDives(filters, activePage, entriesPerPage)
      } catch (error) {
        console.log(error)
      }
    }

    const handleViewSightingsOpen = async dive => {
      try {
        await fetchSightingsForDive(dive.id)
        const updatedDive = diveStore.dives.find(d => d.id === dive.id)

        if (updatedDive) {
          setSightings(updatedDive.sightings)
          setDiveId(dive.id)
          setSightingsModalOpen(true)
        } else {
          console.log('Updated dive not found in store')
        }
      } catch (error) {
        console.log(error)
      }
    }

    const handleDeleteOpen = diveId => {
      setDiveIdToDelete(diveId)
      setDeleteConfirmOpen(true)
    }

    const handleDeleteDive = diveId => {
      deleteDive(diveId)
      fetchFilteredDives(filters, activePage, entriesPerPage)
      setDeleteConfirmOpen(false)
    }

    const handlePageChange = (e, data) => {
      setActivePage(data.activePage)
      fetchFilteredDives(filters, activePage, entriesPerPage)
    }

    const handleEntriesPerPageChange = newEntriesPerPage => {
      setEntriesPerPage(newEntriesPerPage)
      setActivePage(1)
      fetchFilteredDives(filters, activePage, entriesPerPage)
    }

    return (
      <Container fluid>
        <Grid>
          <Grid.Row columns={3}>
            <Grid.Column>
              <Dropdown
                multiple
                fluid
                selection
                options={diveGuides}
                placeholder='Filter by Dive Guide'
                value={selectedDiveGuides}
                title={selectedDiveGuides.join(', ')}
                onChange={(e, { value }) => setSelectedDiveGuides(value)}
                onClose={() => console.log(selectedDiveGuides)}
              />
            </Grid.Column>
            <Grid.Column>
              <Dropdown
                multiple
                fluid
                selection
                options={DiveFormData.boatNameOptions.options}
                placeholder='Filter by Boat'
                value={selectedBoats}
                onChange={(e, { value }) => setSelectedBoats(value)}
                onClose={() => console.log(selectedBoats)}
              />
            </Grid.Column>
            <Grid.Column>
              <Dropdown
                multiple
                fluid
                selection
                options={DiveFormData.diveSiteOptions.options}
                placeholder='Filter by Dive Site'
                value={selectedDiveSites}
                onChange={(e, { value }) => setSelectedDiveSites(value)}
                onClose={() => console.log(selectedDiveSites)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <div className='table-to-cards'>
          <DiveTable
            dives={dives}
            preferredUnits={preferredUnits}
            units={units}
            handleEditOpen={handleEditOpen}
            handleDeleteOpen={handleDeleteOpen}
            handleViewSightingsOpen={handleViewSightingsOpen}
            timeMap={timeMap}
          />
        </div>
        <div className='dive-card'>
          {dives.map((dive, index) => (
            <DiveCard
              key={index}
              dive={dive}
              units={units}
              handleEditOpen={handleEditOpen}
              handleDeleteOpen={handleDeleteOpen}
              handleViewSightingsOpen={handleViewSightingsOpen}
              timeMap={timeMap}
            />
          ))}
        </div>
        <Grid centered columns={1} padded>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Pagination
                activePage={activePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
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
          </Grid.Row>
        </Grid>
        <EditDiveModal
          editOpen={editOpen}
          handleEditClose={handleEditClose}
          handleInputChange={handleInputChange}
          handleEditSubmit={handleEditSubmit}
          formState={formState}
          units={units}
          diveFormData={diveFormData}
        />
        <DeleteDiveModal
          deleteConfirmOpen={deleteConfirmOpen}
          setDeleteConfirmOpen={setDeleteConfirmOpen}
          diveIdToDelete={diveIdToDelete}
          handleDeleteDive={handleDeleteDive}
        />
        <SightingModal
          sightingsModalOpen={sightingsModalOpen}
          setSightingsModalOpen={setSightingsModalOpen}
          sightings={sightings}
          diveId={diveId}
        />
      </Container>
    )
  })
)

export default PreviousEntries
