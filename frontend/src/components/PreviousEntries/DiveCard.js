import React from 'react'
import { Button, Card, Icon } from 'semantic-ui-react'
import unitConverter from '../../utils/convertUnits'
import '../../styles/DiveCard.css'

const DiveCard = ({
  dive,
  units,
  handleEditOpen,
  handleDeleteOpen,
  handleViewSightingsOpen,
  timeMap,
  preferredUnits,
  userStore
}) => {
  return (
    <Card className='dive-card' fluid>
      <Card.Content>
        <Card.Header>Date: {dive.date}</Card.Header>
        <Card.Meta>Dive ID: {dive.id}</Card.Meta>
        <Card.Description>
          <p>Dive Number: {timeMap[dive.diveNumber]}</p>
          <p>Boat: {dive.boat}</p>
          <p>Dive Guide: {dive.diveGuide}</p>
          <p>Dive Site: {dive.diveSite}</p>
          <p>
            Max Depth:{' '}
            {unitConverter.convertDepthToForm(dive.maxDepth, preferredUnits)}{' '}
            {units.depth}
          </p>
          <p>
            Water Temp:{' '}
            {unitConverter.convertTempToForm(
              dive.waterTemperature,
              preferredUnits
            )}{' '}
            {units.temperature}
          </p>
          <p></p>
        </Card.Description>
        <Card.Content extra>
          <Button.Group fluid widths={3}>
            <Button
              icon
              color='green'
              size='small'
              onClick={() => handleViewSightingsOpen(dive)}
            >
              <Icon name='binoculars' />
            </Button>
            <Button.Or className='or-button' />
            <Button
              icon
              color='blue'
              size='small'
              onClick={() => handleEditOpen(dive)}
              disabled={!userStore.approved}
            >
              <Icon name='edit' />
            </Button><Button.Or className='or-button' />
            <Button
              icon
              color='red'
              size='small'
              onClick={() => handleDeleteOpen(dive.id)}
              disabled={!userStore.approved}
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
