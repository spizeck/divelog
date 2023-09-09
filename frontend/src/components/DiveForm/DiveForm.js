import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Form } from 'semantic-ui-react'
import '../../styles/DiveForm.css'
import {
  DiveFormField,
  handleChange,
  handleSubmit,
  RenderFormStep,
  SightingsFormData,
  DiveFormData
} from './'
import { unitConverter } from '../../utils/convertUnits'

const DiveForm = inject('userStore')(
  observer(({ userStore }) => {
    const { preferredUnits, firstName } = userStore
    const totalSteps = 7
    const [step, setStep] = useState(1)
    const [sightingData, setSightingData] = useState(SightingsFormData)
    const [diveFormData, setDiveFormData] = useState({})
    // todo: Add otherSightings options
    const [submitted, setSubmitted] = useState(false)
    const [confirmationMessage, setConfirmationMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [fieldError, setFieldError] = useState('')
    const [formError, setFormError] = useState(false)

    const [units, setUnits] = useState({})
    const [defaultData, setDefaultData] = useState({})

    useEffect(() => {
      if (preferredUnits === 'metric') {
        setUnits({
          units: 'metric',
          depth: 'm',
          temp: '°C'
        })
      } else if (preferredUnits === 'imperial') {
        setUnits({
          units: 'imperial',
          depth: 'ft',
          temp: '°F'
        })
      }

      let defaultData = {}
      Object.entries(diveFormData).forEach(([key, value]) => {
        if (value.defaultValue) {
          if (key === 'maxDepth') {
            defaultData[key] = unitConverter.convertDepthToForm(
              value.defaultValue,
              units.units
            )
          } else if (key === 'waterTemperature') {
            defaultData[key] = unitConverter.convertTempToForm(
              value.defaultValue,
              units.units
            )
          } else {
            defaultData[key] = value.defaultValue
          }
        } else {
          defaultData[key] = ''
        }
      })
      if (firstName) {
        defaultData.diveGuide = firstName
      }
      setFormData(defaultData)
    }, [units, firstName])

    const handleNext = e => {
      e.preventDefault()
      if (step < totalSteps) {
        setStep(prevStep => prevStep + 1)
      }
    }

    const handlePrevious = e => {
      e.preventDefault()
      if (step > 1) {
        setStep(prevStep => prevStep - 1)
      }
    }

    const handleFormSubmit = async e => {
      e.preventDefault()
      try {
        await handleSubmit(
          e,
          formData,
          sightingData,
          step,
          totalSteps,
          setSubmitted,
          setConfirmationMessage,
          setErrorMessage,
          units
        )
      } catch (error) {
        if (error.response) {
          setErrorMessage('An error occurred: ' + error.response.data.message)
        } else {
          setErrorMessage('An error occurred: ' + error.message)
        }
      }
    }

    const handleChangeFn = handleChange(
      setFormData,
      setSightingData,
      setFieldError,
      setFormError,
      DiveFormData,
      step,
      totalSteps,
      units
    )

    const handleResetForm = () => {
      setStep(1)
      setFormData(() => {
        const defaultData = {}

        Object.entries(diveFormData).forEach(([key, value]) => {
          if (value.defaultValue) {
            if (key === 'maxDepth') {
              defaultData[key] = unitConverter.convertDepthToForm(
                value.defaultValue,
                units.units
              )
            } else if (key === 'waterTemperature') {
              defaultData[key] = unitConverter.convertTempToForm(
                value.defaultValue,
                units.units
              )
            } else {
              defaultData[key] = value.defaultValue
            }
          } else {
            defaultData[key] = ''
          }
        })
        if (firstName) {
          defaultData.diveGuide = firstName
        }
        return defaultData
      })
      setSightingData(SightingsFormData)
      setSubmitted(false)
      setErrorMessage('')
      setConfirmationMessage('')
    }

    const renderStep = () => {
      switch (step) {
        case 1:
          return (
            <div>
              <h2 className='dive-form-heading'>Dive Information</h2>
              {Object.entries(diveFormData).map(([key, value]) => {
                return (
                  <DiveFormField
                    key={key}
                    fieldData={{ key, value, type: value.type }}
                    handleChangeFn={handleChangeFn}
                    fieldError={fieldError}
                    units={units}
                  />
                )
              })}
            </div>
          )
        case 2:
          return (
            <RenderFormStep
              step={step}
              title='Sharks & Turtles'
              formData={formData}
              sightingData={sightingData}
              handleChangeFn={handleChangeFn}
              fieldError={fieldError}
            />
          )
        case 3:
          return (
            <RenderFormStep
              step={step}
              title='Rays & Groupers'
              formData={formData}
              sightingData={sightingData}
              handleChangeFn={handleChangeFn}
              fieldError={fieldError}
            />
          )
        case 4:
          return (
            <RenderFormStep
              step={step}
              title='Urchins'
              formData={formData}
              sightingData={sightingData}
              handleChangeFn={handleChangeFn}
              fieldError={fieldError}
            />
          )
        case 5:
          return (
            <RenderFormStep
              step={step}
              title='Gastropods'
              formData={formData}
              sightingData={sightingData}
              handleChangeFn={handleChangeFn}
              fieldError={fieldError}
            />
          )
        case 6:
          return (
            <RenderFormStep
              step={step}
              title='Other Sightings'
              formData={formData}
              sightingData={sightingData}
              handleChangeFn={handleChangeFn}
              fieldError={fieldError}
            />
          )
        case 7:
          return (
            <div>
              <h2>Please confirm your dive</h2>
              <div className='confirmation'>
                <div className='confirmation__item'>
                  <h3>Dive Information</h3>
                  <ul>
                    {Object.entries(diveFormData).map(([key, value]) => (
                      <li key={key}>
                        <strong>{value.label}:</strong> {formData[value.name]}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='confirmation__item'>
                  <h3>Sightings</h3>
                  <ul>
                    {sightingData
                      .filter(item => item.defaultValue > 0)
                      .map(item => (
                        <li key={item.name}>
                          <strong>{item.name}:</strong> {item.defaultValue}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              {/* Display messages here */}
              <h3>
                {confirmationMessage && (
                  <p className='confirmation-message'>{confirmationMessage}</p>
                )}
                {errorMessage && (
                  <p className='error-message'>{errorMessage}</p>
                )}
              </h3>
              <p></p>
            </div>
          )

        default:
          return null
      }
    }

    return (
      <div>
        <Form onSubmit={handleFormSubmit}>
          <div className='dive-form'>
            {renderStep()}
            <Button.Group fluid style={{ marginTop: '10px' }}>
              {step > 1 && !submitted ? (
                <Button
                  className='form-buttons'
                  color='grey'
                  type='button'
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
              ) : (
                <Button
                  className='form-buttons'
                  negative
                  type='button'
                  onClick={handleResetForm}
                >
                  Reset Form
                </Button>
              )}
              <Button.Or className='or-button' />
              {step < totalSteps ? (
                <Button
                  className='form-buttons'
                  primary
                  type='button'
                  onClick={handleNext}
                  disabled={formError}
                >
                  Next
                </Button>
              ) : (
                <Button
                  className='form-buttons'
                  positive
                  type='submit'
                  disabled={submitted}
                >
                  Submit
                </Button>
              )}
            </Button.Group>
          </div>
        </Form>
      </div>
    )
  })
)

export default DiveForm
