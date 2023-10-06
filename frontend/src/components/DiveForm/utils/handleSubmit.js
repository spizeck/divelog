import api from '../../../utils/api'
import unitConverter from '../../../utils/convertUnits'

const handleSubmit = async (
  e,
  formData,
  sightingData,
  step,
  totalSteps,
  setSubmitted,
  setConfirmationMessage,
  setErrorMessage,
  units
) => {
  e.preventDefault()

  if (step === totalSteps) {
    // Convert depth and temperature to metric if units are imperial
      formData.maxDepth = unitConverter.convertDepthToDatabase(
        parseInt(formData.maxDepth, 10),
        units.units
      )
      formData.waterTemperature = unitConverter.convertTempToDatabase(
        parseInt(formData.waterTemperature, 10),
        units.units
      )
    // Submit dive data to the /dives endpoint
    try {
      const diveResponse = await api.createDive(formData)
      const { diveId } = diveResponse

      // Create a new sighting instance using the form data and the dive ID
      const sightings = sightingData.map(item => {
        const count = item.count || item.defaultValue
        return {
          species: item.name,
          count: parseInt(count, 10),
          dive_id: diveId
        }
      })

      const sightingsResponse = await api.createSighting({ sightings })


      if (sightingsResponse.status === 201) {
        setConfirmationMessage('Dive logged successfully')
        setErrorMessage('')
        setSubmitted(true)
      } else {
        throw new Error('Failed to create sightings')
      }
    } catch (error) {
      setErrorMessage('An error occurred: ' + error.message)
      if (error.response) {
        setErrorMessage('An error occurred: ' + error.response.data.message)
      }
    }
  }
}

export default handleSubmit
