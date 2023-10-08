import React from 'react'
import { Modal, Button } from 'semantic-ui-react'

const DeleteDiveModal = ({
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  diveIdToDelete,
  handleDeleteDive
}) => {
  return (
    <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
      <Modal.Header>Delete Dive #{diveIdToDelete}</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete this dive?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group fluid>
          <Button negative onClick={() => handleDeleteDive(diveIdToDelete)}>
            Delete
          </Button>
          <Button.Or className='or-button' />
          <Button primary onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
        </Button.Group>
      </Modal.Actions>
    </Modal>
  )
}

export default DeleteDiveModal
