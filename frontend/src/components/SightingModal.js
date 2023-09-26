import React from 'react'

import { Modal, Button, List } from 'semantic-ui-react'

const SightingModal = ({
  sightingsModalOpen,
  setSightingsModalOpen,
  sightings,
  diveId
}) => {
  return (
    <Modal
      open={sightingsModalOpen}
      onClose={() => setSightingsModalOpen(false)}
    >
      <Modal.Header>Sightings for Dive #{diveId}</Modal.Header>
      <Modal.Content>
        <List>
            {sightings.map((sighting, index) => (
                <List.Item key={index}><strong>{sighting.species}</strong>: {sighting.count}</List.Item>
            ))}
        </List>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setSightingsModalOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  )
}

export default SightingModal
