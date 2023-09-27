import React from 'react'
import { Modal, Select } from 'semantic-ui-react'
import { DiveFormData } from '../../components/DiveFormData'

const FilterModal = ({
  filterModalOpen,
  setFilterModalOpen,
  setSelectedDiveGuide,
  setSelectedBoat,
  setSelectedDiveSite,
  selectedDiveGuide,
  selectedBoat,
  selectedDiveSite,
  applyFilters
}) => {
  return (
    <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
      <Modal.Header>Filter Dives</Modal.Header>
      <Modal.Content>
        <Select
          placeholder='Filter by Dive Guide'
          options='' // Add array of users
          onChange={(e, { value }) => setSelectedDiveGuide(value)}
          value={selectedDiveGuide}
        />
        <Select
          placeholder='Filter by Boat'
          options={DiveFormData.boatNameOptions.options}
          onChange={(e, { value }) => setSelectedBoat(value)}
          value={selectedBoat}
        />
        <Select
          placeholder='Filter by Dive Site'
          options={DiveFormData.diveSiteOptions.options}
          onChange={(e, { value }) => setSelectedDiveSite(value)}
          defaultValue={'All'}
          value={selectedDiveSite}
        />
      </Modal.Content>
      <Modal.Actions>
        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={() => setFilterModalOpen(false)}>Cancel</button>
      </Modal.Actions>
    </Modal>
  )
}

export default FilterModal
