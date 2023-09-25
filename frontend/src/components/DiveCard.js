import React from 'react'
import { Button, Card, Icon } from 'semantic-ui-react'
import '../styles/DiveCard.css'

const DiveCard = ({
  dive,
  units,
  handleEditOpen,
  handleDeleteOpen,
  timeMap
}) => {
  return (
    <Card className='dive-card' centered>
      <h3>Date: {dive.date}</h3>
      <p>Dive Number: {timeMap[dive.diveNumber]}</p>
      <p>Boat: {dive.boat}</p>
      <p>Dive Site: {dive.diveSite}</p>
      <p>
        Max Depth: {dive.maxDepth} {units.depth}
      </p>
      <p>
        Water Temp: {dive.waterTemperature} {units.temperature}
      </p>
      <div>
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
        color='blue'
        size='small'
        onClick={() => handleDeleteOpen(dive.id)}
      >
        <Icon name='trash alternate outline' />
      </Button></div>
    </Card>
  )
}
export default DiveCard
