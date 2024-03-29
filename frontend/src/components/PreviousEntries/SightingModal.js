import React from 'react'
import { Modal, Button, List } from 'semantic-ui-react'

import { observer, inject } from 'mobx-react'

const SightingModal = inject('rootStore')(
  observer(({ rootStore, sightings, diveId }) => {
    const { diveStore, userStore } = rootStore

    return (
      <Modal
        open={diveStore.sightingsModalOpen}
        onClose={() => diveStore.closeSightingsModal()}
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
              disabled={!userStore.approved}
              onClick={() => diveStore.openEditSightingsModal()}
            >
              Edit Sightings
            </Button>
            <Button.Or className='or-button' />
            <Button
              className='small-buttons'
              negative
              onClick={() => diveStore.closeSightingsModal()}
            >
              Close
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    )
  })
)
export default SightingModal
