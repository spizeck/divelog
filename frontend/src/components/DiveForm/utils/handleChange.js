// handleChange.js is a function that handles the change of the form data and sighting data
// handleChange.js is imported into DiveForm.js

import unitConverter from '../../../utils/convertUnits';

const handleChange =
  (
    setFormData,
    setSightingData,
    setFieldError,
    setFormError,
    DiveFormData,
    SightingsFormData,
    step,
    totalSteps,
    units
  ) =>
  (e, { name, value }) => {
    // console.log('Changing value of', name, 'to', value, 'in step', step, 'of', totalSteps, 'steps')
    
    if (step === 1) {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }))
      // After updating the state, run validation for this specific input field
      const fieldDefinition = DiveFormData[name]
      if (fieldDefinition) {
        let convertedValue = value;
        if (units.units === 'imperial') {
          if (parseFloat(value, 10) % 1 !== 0) {
            setFieldError(prevErrors => ({ ...prevErrors, [name]: 'Must be a whole number' }))
            setFormError(true)
          } else if (name === 'maxDepth') {
            convertedValue = unitConverter.convertDepthToDatabase(value, units.units);
          } else if (name === 'waterTemperature') {
            convertedValue = unitConverter.convertTempToDatabase(value, units.units);
          }
        }
        const fieldValue =
          fieldDefinition.type === 'number' ? parseFloat(convertedValue, 10) : convertedValue

        const { validate } = fieldDefinition
        const error = validate(fieldValue)

        if (error) {
          setFieldError(prevErrors => ({ ...prevErrors, [name]: error }))
          setFormError(true)
        } else {
          setFieldError(prevErrors => {
            const newErrors = { ...prevErrors }
            delete newErrors[name]
            setFormError(false)
            return newErrors
          })
        }
      }
    } else if (step >= 2 && step <= totalSteps) {
      setSightingData(prevData =>
        prevData.map(item =>
          item.name === name ? { ...item, defaultValue: value } : item
        )
      )
      // Validate the data
      const sightingFieldDefinition = SightingsFormData.find(
        item => item.name === name
      )
      if (sightingFieldDefinition) {
        const fieldValue =
          sightingFieldDefinition.type === 'number'
            ? parseFloat(value, 10)
            : value
        const { validate } = sightingFieldDefinition
        const error = validate(fieldValue)

        if (error) {
          setFieldError(prevErrors => ({ ...prevErrors, [name]: error }))
          setFormError(true)
        } else {
          setFieldError(prevErrors => {
            const newErrors = { ...prevErrors }
            delete newErrors[name]
            setFormError(false)
            return newErrors
          })
        }
      }
    }
  }

export default handleChange
