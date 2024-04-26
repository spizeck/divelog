const _validateCount = value => {
  if (value < 0) {
    return 'Count must be greater than or equal to 0'
  }
  return null
}

const SightingsFormData = [
  { name: 'Green Turtle', defaultValue: 0, step: 2, validate: _validateCount }, // step = the rendering step
  {
    name: 'Hawksbill Turtle',
    defaultValue: 0,
    step: 2,
    validate: _validateCount
  },
  {
    name: 'Caribbean Reef Shark',
    defaultValue: 0,
    step: 2,
    validate: _validateCount
  },
  {
    name: 'Blacktip Reef Shark',
    defaultValue: 0,
    step: 2,
    validate: _validateCount
  },
  { name: 'Nurse Shark', defaultValue: 0, step: 2, validate: _validateCount },
  {
    name: 'Roughtail Stingray',
    defaultValue: 0,
    step: 3,
    validate: _validateCount
  },
  {
    name: 'Southern Stingray',
    defaultValue: 0,
    step: 3,
    validate: _validateCount
  },
  {
    name: 'Spotted Eagle Ray',
    defaultValue: 0,
    step: 3,
    validate: _validateCount
  },
  {
    name: 'Nassau Grouper',
    defaultValue: 0,
    step: 3,
    validate: _validateCount
  },
  {
    name: 'Yellowfin Grouper',
    defaultValue: 0,
    step: 3,
    validate: _validateCount
  },
  { name: 'Tiger Grouper', defaultValue: 0, step: 3, validate: _validateCount },
  {
    name: 'Longspine Sea Urchin',
    defaultValue: 0,
    step: 4,
    validate: _validateCount
  },
  { name: 'Sea Egg', defaultValue: 0, step: 4, validate: _validateCount },
  { name: 'Pencil Urchin', defaultValue: 0, step: 4, validate: _validateCount },
  {
    name: 'Magnificent Urchin',
    defaultValue: 0,
    step: 4,
    validate: _validateCount
  },
  { name: 'Reef Urchin', defaultValue: 0, step: 4, validate: _validateCount },
  {
    name: 'Variegated Urchin',
    defaultValue: 0,
    step: 4,
    validate: _validateCount
  },
  {
    name: 'Red-tipped Sea Goddess',
    defaultValue: 0,
    step: 5,
    validate: _validateCount
  },
  {
    name: 'Lettuce Sea Slug',
    defaultValue: 0,
    step: 5,
    validate: _validateCount
  },
  {
    name: 'Leech Head Shield Slug',
    defaultValue: 0,
    step: 5,
    validate: _validateCount
  },
  {
    name: 'Flamingo Tongue',
    defaultValue: 0,
    step: 5,
    validate: _validateCount
  },
  {
    name: 'Fingerprint Cyphoma',
    defaultValue: 0,
    step: 5,
    validate: _validateCount
  },
  {
    name: 'White-nosed Pipefish',
    defaultValue: 0,
    step: 6,
    validate: _validateCount
  },
  {
    name: 'Long Snout Seahorse',
    defaultValue: 0,
    step: 6,
    validate: _validateCount
  },
  {
    name: 'Longlure Frogfish',
    defaultValue: 0,
    step: 6,
    validate: _validateCount
  },
  {
    name: 'Red-lipped Batfish',
    defaultValue: 0,
    step: 6,
    validate: _validateCount
  },
  {
    name: 'Flying Gurnard',
    defaultValue: 0,
    step: 6,
    validate: _validateCount
  },
  {
    name: 'Lionfish Alive',
    defaultValue: 0,
    step: 6,
    validate: _validateCount
  },
  { name: 'Lionfish Dead', defaultValue: 0, step: 6, validate: _validateCount }
]

export default SightingsFormData
