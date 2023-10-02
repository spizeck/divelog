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
          <Button.Group widths={2}>
            <Button
              className='small-buttons'
              primary
              onClick={() => setEditSightingOpen(true)}
            >
              Edit Sightings
            </Button>
            <Button.Or className='or-button' />
            <Button
              className='small-buttons'
              negative
              onClick={() => setSightingsModalOpen(false)}
            >
              Close
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
      <EditSightingsModal
        editSightingOpen={editSightingOpen}
        handleEditSightingClose={() => setEditSightingOpen(false)}
        sightings={sightings}
        diveId={diveId}
      />
    </>
  )
}

export default SightingModal
