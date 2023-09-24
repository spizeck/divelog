import React from 'react'
import { Form, Input, Dropdown } from 'semantic-ui-react'

const DiveFormField = ({
  fieldData,
  handleChangeFn,
  fieldError,
  units,
  formData
}) => {
  const { key, value, type } = fieldData

  const formLabel =
    value.name === 'maxDepth' || value.name === 'waterTemperature'
      ? `${value.label} (${
          units[value.name === 'maxDepth' ? 'depth' : 'temp']
        })`
      : value.label

  return (
    <Form.Field className='dive-form-field' key={key}>
      <label className='dive-form-label'>{formLabel}</label>
      {type === 'dropdown' ? (
        <Dropdown
          selection
          options={value.options}
          name={value.name}
          value={formData[value.name] || ''}
          onChange={handleChangeFn}
        />
      ) : (
        <Input
          className='dive-form-input'
          type={type}
          name={value.name}
          value={formData[value.name] || ''}
          onChange={handleChangeFn}
        />
      )}
      <div className='error-message'>
        {fieldError[value.name] && (
          <div className='error-message'> {fieldError[value.name]} </div>
        )}
      </div>
    </Form.Field>
  )
}

export default DiveFormField
