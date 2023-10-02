import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, Grid } from 'semantic-ui-react'
import { SightingsFormData } from '../DiveForm/'
import EditSightingsConfirm from './EditSightingsConfirm'

const EditSightingsModal = ({
  editSightingOpen,
  handleEditSightingClose,
  sightings,
  diveId
}) => {
  const title = 'Edit Sightings'
  const [formState, setFormState] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleUpdateCount = (index, newCount) => {
    const updatedFormState = [...formState]
    updatedFormState[index].count = parseInt(newCount, 10)
    setFormState(updatedFormState)
  }

  useEffect(() => {
    // Initialize formState with names and default count of 0
    const sortedSightings = [...SightingsFormData].sort(
      (a, b) => a.step - b.step
    )
    const namesWithCount = sortedSightings.map(sighting => ({
      name: sighting.name,
      count: 0
    }))

    // Update counts based on the sightings prop
    const updatedCounts = namesWithCount.map(item => {
      const foundSighting = sightings.find(
        sighting => sighting.species === item.name
      )
      return foundSighting ? { ...item, count: foundSighting.count } : item
    })

    setFormState(updatedCounts)
  }, [sightings])

  // useEffect(() => {
  //   console.log(formState)
  // }, [formState])

  return (
    <Modal open={editSightingOpen} onClose={handleEditSightingClose}>
      <Modal.Header>Edit Sightings for Dive #{diveId}</Modal.Header>
      <Modal.Content>
        {showConfirmation ? (
          <EditSightingsConfirm
          formState={formState}
          handleEditSightingClose={handleEditSightingClose} />
        ):(
        <Form>
          <Grid>
            {formState.map((item, index) => (
              <Grid.Row key={index}>
                <Grid.Column>
                  <Form.Field>
                    <label>{item.name}:</label>
                    <Input
                      type='number'
                      value={item.count}
                      onChange={e => handleUpdateCount(index, e.target.value)}
                    />
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>
            ))}
          </Grid>
        </Form>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button.Group fluid widths={2}>
          <Button
            className='small-buttons'
            primary
            onClick={() => setShowConfirmation(true)}
          >
            Review Changes
          </Button>
          <Button.Or className='or-button' />
          <Button
            className='small-buttons'
            negative
            onClick={handleEditSightingClose}
          >
            Cancel
          </Button>
        </Button.Group>
      </Modal.Actions>
    </Modal>
  )
}

export default EditSightingsModal
