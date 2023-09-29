// DiveTable.js
import React from 'react';
import { Table, Button, Icon } from 'semantic-ui-react';
import unitConverter from '../../utils/convertUnits';

const DiveTable = ({ dives, units, preferredUnits, handleEditOpen, handleDeleteOpen, handleViewSightingsOpen, timeMap }) => {
  return (
    <Table celled textAlign='center'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Dive Number</Table.HeaderCell>
                <Table.HeaderCell>Boat</Table.HeaderCell>
                <Table.HeaderCell>Dive Guide</Table.HeaderCell>
                <Table.HeaderCell>Dive Site</Table.HeaderCell>
                <Table.HeaderCell>Max Depth ({units.depth})</Table.HeaderCell>
                <Table.HeaderCell>
                  Water Temp ({units.temperature})
                </Table.HeaderCell>
                <Table.HeaderCell>View Sightings</Table.HeaderCell>
                <Table.HeaderCell>Edit</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dives.map((dive, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{dive.date}</Table.Cell>
                  <Table.Cell>{timeMap[dive.diveNumber]}</Table.Cell>
                  <Table.Cell>{dive.boat}</Table.Cell>
                  <Table.Cell>{dive.diveGuide}</Table.Cell>
                  <Table.Cell>{dive.diveSite}</Table.Cell>
                  <Table.Cell>
                    {unitConverter.convertDepthToForm(
                      dive.maxDepth,
                      preferredUnits
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {unitConverter.convertTempToForm(
                      dive.waterTemperature,
                      preferredUnits
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      icon
                      color='blue'
                      size='medium'
                      className='center-this-button'
                      onClick={() => handleViewSightingsOpen(dive)}
                    >
                      <Icon name='binoculars' />
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      icon
                      color='blue'
                      size='medium'
                      className='center-this-button'
                      onClick={() => handleEditOpen(dive)}
                    >
                      <Icon name='edit outline' />
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      icon
                      color='red'
                      size='medium'
                      className='center-this-button'
                      onClick={() => handleDeleteOpen(dive.id)}
                    >
                      <Icon name='trash alternate outline' />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
  );
};

export default DiveTable;
