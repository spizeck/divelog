import React from 'react'
import { Modal, Button, List, Message } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

const EditSightingsConfirm = inject('rootStore')(
  observer(({ rootStore, formState, diveId }) => {
    const { diveStore } = rootStore

    return (
      <Modal open={diveStore.showConfirmation}>
        <Modal.Header>Confirm Sightings for Dive #{diveId}</Modal.Header>
        <Modal.Content>
          <List>
            <List.Item>
              {formState
                .filter(item => item.count > 0)
                .map(item => (
                  <li key={item.name}>
                    <strong>{item.name}:</strong> {item.count}
                  </li>
                ))}
            </List.Item>
          </List>
          {diveStore.successMessage && (
            <Message positive>{diveStore.successMessage}</Message>
          )}

          {diveStore.errorMessage && (
            <Message negative>{diveStore.errorMessage}</Message>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button.Group widths={2}>
            <Button
              primary
              className='small-buttons'
              onClick={() => diveStore.updateSightings(formState, diveId)}
            >
              Confirm
            </Button>
            <Button.Or className='or-button' />
            <Button
              className='small-buttons'
              negative
              onClick={() => diveStore.closeConfirmationModal()}
            >
              Cancel
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    )
  })
)
export default EditSightingsConfirm
