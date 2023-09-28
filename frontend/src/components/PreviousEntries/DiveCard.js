import React from 'react'
import { Button, Card, Icon } from 'semantic-ui-react'
import '../../styles/DiveCard.css'

const DiveCard = ({
  dive,
  units,
  handleEditOpen,
  handleDeleteOpen,
  handleViewSightingsOpen,
  timeMap
}) => {
  return (
    <Card className='dive-card' fluid >
      <Card.Content>
        <Card.Header>Date: {dive.date}</Card.Header>
        <Card.Meta>Dive ID: {dive.id}</Card.Meta>
        <Card.Description>
          <p>Dive Number: {timeMap[dive.diveNumber]}</p>
          <p>Boat: {dive.boat}</p>
          <p>Dive Site: {dive.diveSite}</p>
          <p>
            Max Depth: {dive.maxDepth} {units.depth}
          </p>
          <p>
            Water Temp: {dive.waterTemperature} {units.temperature}
          </p>
        </Card.Description>
        <Card.Content extra>
          <Button.Group fluid >
            <Button
              icon
              color='green'
              size='small'
              onClick={() => handleViewSightingsOpen(dive)}
            >
              <Icon name='binoculars' />
            </Button>
            <Button
              icon
              color='blue'
              size='small'
              onClick={() => handleEditOpen(dive)}
            >
              <Icon name='edit' />
            </Button>

            <Button
              icon
              color='red'
              size='small'
              onClick={() => handleDeleteOpen(dive.id)}
            >
              <Icon name='trash alternate outline' />
            </Button>
          </Button.Group>
        </Card.Content>
      </Card.Content>
    </Card>
  )
}
export default DiveCard
