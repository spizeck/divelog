import React, { useState } from 'react' 
import { Modal, Button, List } from 'semantic-ui-react'
import EditSightingsModal from './EditSightingsModal'

const SightingModal = ({
  sightingsModalOpen,
  setSightingsModalOpen,
  sightings,
  diveId
}) => {

  const [editSightingOpen, setEditSightingOpen] = useState(false)
  const [formState, setFormState] = useState({
    species: '',
    count: ''
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormState({ ...formState, [name]: value })
  }

  const handleEditSightingSubmit = () => {
    console.log('Submitting: ', formState)
    // Update the sightings in your data store
    setEditSightingOpen(false)
  }

  return (
    <>
      <Modal
        open={sightingsModalOpen}
        onClose={() => setSightingsModalOpen(false)}
      >
        <Modal.Header>Sightings for Dive #{diveId}</Modal.Header>
        <Modal.Content>
          <List>
            {sightings.map((sighting, index) => (
              <List.Item key={index}>
                <strong>{sighting.species}</strong>: {sighting.count}
              </List.Item>
            ))}
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setSightingsModalOpen(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
      <EditSightingsModal
        editSightingOpen={editSightingOpen}
        handleEditSightingClose={() => setEditSightingOpen(false)}
        handleInputChange={handleInputChange}
        handleEditSightingSubmit={handleEditSightingSubmit}
        formState={formState}
      />
    </>
  )
}

export default SightingModal
