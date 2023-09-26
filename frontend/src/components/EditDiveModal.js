import React from 'react'
import { Modal, Form, Input, Button, Select } from 'semantic-ui-react'

const EditDiveModal = ({
  editOpen,
  handleEditClose,
  handleInputChange,
  handleEditSubmit,
  formState,
  units,
  diveFormData
}) => {
  return (
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
  )
}

export default EditDiveModal
