const DiveFormData = {
  date: {
    name: 'date',
    label: 'Date',
    type: 'date',
    defaultValue: new Date().toISOString().slice(0, 10),
    // Validate that the date is within the last 7 days and not in the future
    validate: value => {
      const date = new Date(value)
      const today = new Date()
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(today.getDate() - 7)
      if (date > today) {
        return 'Date must not be in the future'
      }
      if (date < sevenDaysAgo) {
        return 'Date must be within the last 7 days'
      }
      return null
    }
  },
  diveNumberOptions: {
    name: 'diveNumber',
    label: 'Dive Number',
    type: 'select',
    options: [
      { key: '1', text: '9:00 am', value: 1 },
      { key: '2', text: '11:00 am', value: 2 },
      { key: '3', text: '1:00 pm', value: 3 },
      { key: '4', text: '3:00 pm', value: 4 },
      { key: '5', text: 'Night Dive', value: 5 }
    ],
    validate: value => {
      if (value.length === 0) {
        return 'Please select a dive number'
      }
      return null
    }
  },
  boatNameOptions: {
    name: 'boatName',
    label: 'Boat Name',
    type: 'select',
    options: [
      { key: '1', text: 'Shark Bait', value: 'Shark Bait' },
      { key: '2', text: 'Fin & Tonic', value: 'Fin & Tonic' },
      { key: '3', text: 'Northern Sky', value: 'Northern Sky' },
      { key: '4', text: 'Private Boat', value: 'Private Boat' }
    ],
    validate: value => {
      if (value.length === 0) {
        return 'Please select a boat'
      }
      return null
    }
  },
  diveGuide: {
    name: 'diveGuide',
    label: 'Dive Guide',
    type: 'text',
    validate: value => {
      if (value.length > 20) {
        return 'Dive Guide must be 20 characters or less'
      }
      if (value.length < 1) {
        return 'Dive Guide is required'
      }
      return null
    }
  },
  diveSiteOptions: {
    name: 'diveSite',
    label: 'Dive Site',
    type: 'select',
    options: [
      { key: '1', text: 'Mt. Michel', value: 'Mt Michel' },
      { key: '2', text: 'Third Encounter', value: 'Third Encounter' },
      { key: '3', text: 'Twilight Zone', value: 'Twilight Zone' },
      { key: '4', text: 'Outer Limits', value: 'Outer Limits' },
      { key: '5', text: 'Shark Shoals', value: 'Shark Shoals' },
      { key: '6', text: 'Diamond Rock', value: 'Diamond Rock' },
      { key: '7', text: "Man O'War Shoals", value: 'Man of War Shoals' },
      { key: '8', text: 'Otto Limits', value: 'Otto Limits' },
      { key: '9', text: 'Torrens Point', value: 'Torrens Point' },
      { key: '10', text: 'Customs House', value: 'Customs House' },
      { key: '11', text: 'Porites Point', value: 'Porites Point' },
      { key: '12', text: 'Babylon', value: 'Babylon' },
      { key: '13', text: 'Ladder Labyrinth', value: 'Ladder Labyrinth' },
      { key: '14', text: '50/50', value: '50 50' },
      { key: '15', text: 'Hot Springs', value: 'Hot Springs' },
      { key: '16', text: 'Rays and Anchors', value: 'Rays and Anchors' },
      { key: '17', text: 'Tedran Wall', value: 'Tedran Wall' },
      { key: '18', text: 'Tent Reef Wall', value: 'Tent Reef Wall' },
      { key: '19', text: 'Tent Boulders', value: 'Tent Boulders' },
      { key: '20', text: 'Tent Reef', value: 'Tent Reef' },
      { key: '21', text: 'Tent Deep', value: 'Tent Deep' },
      { key: '22', text: 'Tent Shallow', value: 'Tent Shallow' },
      { key: '23', text: 'Muck Dive', value: 'Muck Dive' },
      { key: '24', text: 'Greer Gut', value: 'Greer Gut' },
      { key: '25', text: 'Big Rock Market', value: 'Big Rock Market' },
      { key: '26', text: 'Big Rock Deep', value: 'Big Rock Deep' },
      { key: '27', text: 'Otto Zone', value: 'Otto Zone' },
      { key: '28', text: 'Hole in the Corner', value: 'Hole in the Corner' },
      { key: '29', text: 'Abrahams Hole', value: 'Abrahams Hole' },
      { key: '30', text: 'Core Gut', value: 'Core Gut' },
      { key: '31', text: 'Cove Bay', value: 'Cove Bay' },
      { key: '32', text: 'End of the Runway', value: 'End of the Runway' },
      { key: '33', text: 'Airport Drift', value: 'Airport Drift' },
      { key: '34', text: 'Airport North', value: 'Airport North' },
      { key: '35', text: 'Green Island', value: 'Green Island' },
      { key: '36', text: 'Great Point Drift', value: 'Great Point Drift' },
      { key: '37', text: 'Ghost Wreck', value: 'Ghost Wreck' },
      { key: '38', text: 'Saba Bank', value: 'Saba Bank' },
      { key: '39', text: 'Blackwater', value: 'Blackwater' }
    ],
    validate: value => {
      if (value.length === 0) {
        return 'Please select a dive site'
      }
      return null
    }
  },

  maxDepth: {
    name: 'maxDepth',
    label: 'Max Depth',
    type: 'number',
    defaultValue: 22, // This is in meters
    min: 0,
    validate: value => {
      if (value % 1 !== 0) {
        return 'Depth must be a whole number'
      }
      if (value > 60 || value < 4) {
        return 'Please verify your depth'
      }
      return null
    }
  },

  waterTemperature: {
    name: 'waterTemperature',
    label: 'Water Temperature',
    type: 'number',
    min: 0,
    defaultValue: 27,
    validate: value => {
      if (value % 1 !== 0) {
        return 'Must be a whole number'
      }
      if (value > 32 || value < 21) {
        return 'Are you sure about that temperature?'
      }
      return null
    }
  }
}

export default DiveFormData
