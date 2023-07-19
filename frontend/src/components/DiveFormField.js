import React from 'react'
import { Form, Input } from 'semantic-ui-react'

const DiveFormField = ({ fieldData, handleChangeFn, fieldError, units }) => {
  const { key, value, type } = fieldData;

  const formLabel = (value.name === 'maxDepth' || value.name === 'waterTemperature') ?
    `${value.label} (${units[value.name === 'maxDepth' ? 'depth' : 'temp']})` :
    value.label;

  return (
    <Form.Field className='dive-form-field' key={key}>
      <label className='dive-form-label'>{formLabel}</label>
      <Input
        className='dive-form-input'
        type={type}
        name={value.name}
        value={value.value || ''}
        onChange={handleChangeFn}
      />
      <div className='error-message'>
        {fieldError[value.name] && (
          <div className='error-message'>
            {' '}
            {fieldError[value.name]}{' '}
          </div>
        )}
      </div>
    </Form.Field>
  );
}

export default DiveFormField;
