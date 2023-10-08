import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, Grid } from 'semantic-ui-react'
import { SightingsFormData } from '../DiveForm/'
import EditSightingsConfirm from './EditSightingsConfirm'
import { observer, inject } from 'mobx-react'

const EditSightingsModal = inject('rootStore')(
  observer(({ rootStore, sightings, diveId }) => {
    const { diveStore } = rootStore
    const [formState, setFormState] = useState([])

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
      <>
      <Modal open={diveStore.editSightings}>
        <Modal.Header>Edit Sightings for Dive #{diveId}</Modal.Header>
        <Modal.Content>
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
                          onChange={e =>
                            handleUpdateCount(index, e.target.value)
                          }
                        />
                      </Form.Field>
                    </Grid.Column>
                  </Grid.Row>
                ))}
              </Grid>
            </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group fluid widths={2}>
            <Button
              className='small-buttons'
              primary
              
              onClick={() => diveStore.openConfirmationModal()}
            >
              Review Changes
            </Button>
            <Button.Or className='or-button' />
            <Button
              className='small-buttons'
              negative
              onClick={() => diveStore.closeEditSightingsModal()}
            >
              Cancel
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
      <EditSightingsConfirm
      formState={formState}
      diveId={diveId}
      />
      </>
    )
  })
)
export default EditSightingsModal
