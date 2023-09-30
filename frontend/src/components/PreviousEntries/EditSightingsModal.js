import React from 'react'
import { Modal, Button } from 'semantic-ui-react'
import RenderFormStep from '../DiveForm/steps/RenderFormStep' // Import the RenderFormStep component

const EditSightingsModal = ({
  editSightingOpen,
  handleEditSightingClose,
  handleInputChange,
  handleEditSightingSubmit,
  formState,
  step,
  title,
  fieldError
}) => {
  return (
    <Modal open={editSightingOpen} onClose={handleEditSightingClose}>
      <Modal.Header>Edit Sightings for Dive #{formState.diveId}</Modal.Header>
      <Modal.Content>
        <RenderFormStep
          step={step}
          title={title}
          sightingData={formState}
          handleChangeFn={handleInputChange}
          fieldError={fieldError}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleEditSightingSubmit}>Update</Button>
        <Button onClick={handleEditSightingClose}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  )
}

export default EditSightingsModal
