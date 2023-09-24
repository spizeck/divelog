import React from 'react'
import { Form, Input } from 'semantic-ui-react'

const RenderFormStep = ({
  step,
  title,
  sightingData,
  handleChangeFn,
  fieldError
}) => {
  return (
    <div>
      <h2 className='dive-form-heading'>{title}</h2>
      {sightingData
        .filter(item => item.step === step)
        .map(item => {
          const fieldValue =
            sightingData.find(data => data.name === item.name)
              ?.defaultValue || ''
          return (
            <Form.Field className='dive-form-field' key={item.name}>
              <label className='dive-form-label'>{item.name}</label>
              <Input
                className='dive-form-input'
                type='number'
                min='0'
                name={item.name}
                value={fieldValue}
                onChange={handleChangeFn}
              />
              {fieldError[item.name] && (
                <div className='error-message'> {fieldError[item.name]} </div>
              )}
            </Form.Field>
          )
        })}
      <p></p>
    </div>
  )
}

export default RenderFormStep
