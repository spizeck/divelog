import React, { useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../styles/DiveForm.css'
import sightingsData from '../components/sightingsData';
import diveFormData from '../components/diveData';
import handleChange from '../components/handleChange';
import handleSubmit from '../components/handleSubmit';

const DiveForm = ({username}) => {
  const totalSteps = 7;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const defaultData = {};

    Object.entries(diveFormData).forEach(([key, value]) => {
      if (value.defaultValue) {
        defaultData[key] = value.defaultValue;
      } else {
        defaultData[key] = "";
      }
    });

    if (username) {
      defaultData.diveGuide = username;
    }

    return defaultData;
  });

  const [sightingData, setSightingData] = useState(sightingsData);
  // todo: Add otherSightings options
  const [submitted, setSubmitted] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldError, setFieldError] = useState({});
  const [formError, setFormError] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit(e, formData, sightingData, step, totalSteps, setSubmitted, setConfirmationMessage, setErrorMessage);
    } catch (error) {
      if (error.response) {
        setErrorMessage("An error occurred: " + error.response.data.message);
      } else {
        setErrorMessage("An error occurred: " + error.message);
      }
    }
  };

  const handleChangeFn = handleChange(setFormData, setSightingData, setFieldError, setFormError, diveFormData, step, totalSteps);

  const handlePrevious = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
      if (step === totalSteps) {
        setErrorMessage("");
        setConfirmationMessage("");
      }
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleResetForm = () => {
    setStep(1);
    setFormData(() => {
      const defaultData = {};

      Object.entries(diveFormData).forEach(([key, value]) => {
        if (value.defaultValue) {
          defaultData[key] = value.defaultValue;
        } else {
          defaultData[key] = "";
        }
      });

      return defaultData;
    });
    setSightingData(sightingsData);
    setSubmitted(false);
    setErrorMessage("");
    setConfirmationMessage("");
  };

  const RenderFormStep = ({ step, title, formData, sightingData, handleChangeFn, fieldError }) => {
    return (
      <div>
        <h2 className='dive-form-heading'>{title}</h2>
        {sightingData
          .filter((item) => item.step === step)
          .map((item) => {
            const fieldValue = sightingData.find((data) => data.name === item.name)?.defaultValue || "";
            return (
              <Form.Field className='dive-form-field' key={item.name}>
                <label className='dive-form-label'>{item.name}</label>
                <Input className='dive-form-input'
                  type="number"
                  min="0"
                  name={item.name}
                  value={fieldValue}
                  onChange={handleChangeFn}
                />
                {fieldError[item.name] && <div className="error-message"> {fieldError[item.name]} </div>}
              </Form.Field>
            )
          })}
        <p></p>
      </div>
    );
  };

  const renderStep = () => {

    switch (step) {
      case 1:
        return (

          <div>
            <h2 className='dive-form-heading'>Dive Information</h2>
            {Object.entries(diveFormData).map(([key, value]) => (
              <Form.Field className='dive-form-field' key={key}>
                <label className='dive-form-label'>{value.label}</label>
                {value.type === 'select' ? (
                  <Form.Select className='dive-form-select'
                    name={value.name}
                    options={value.options}
                    value={formData[value.name] || ""}
                    onChange={handleChangeFn}
                  />
                ) : (
                  <Input className='dive-form-input'
                    type={value.type}
                    name={value.name}
                    value={formData[value.name] || ""}
                    onChange={handleChangeFn}
                  />
                )}
                <div className='error-message'>
                  {fieldError[value.name] && <div className="error-message"> {fieldError[value.name]} </div>}
                </div>
              </Form.Field>
            ))}
            <p></p>
          </div>

        );
      case 2:
        return <RenderFormStep step={step} title="Sharks & Turtles" formData={formData} sightingData={sightingData} handleChangeFn={handleChangeFn} fieldError={fieldError} />;
      case 3:
        return <RenderFormStep step={step} title="Rays & Groupers" formData={formData} sightingData={sightingData} handleChangeFn={handleChangeFn} fieldError={fieldError} />;
      case 4:
        return <RenderFormStep step={step} title="Urchins" formData={formData} sightingData={sightingData} handleChangeFn={handleChangeFn} fieldError={fieldError} />;
      case 5:
        return <RenderFormStep step={step} title="Gastropods" formData={formData} sightingData={sightingData} handleChangeFn={handleChangeFn} fieldError={fieldError} />;
      case 6:
        return <RenderFormStep step={step} title="Other Sightings" formData={formData} sightingData={sightingData} handleChangeFn={handleChangeFn} fieldError={fieldError} />;
      case 7:
        return (
          <div>
            <h2>Please confirm your dive</h2>
            <div className="confirmation">
              <div className="confirmation__item">
                <h3>Dive Information</h3>
                <ul>
                  {Object.entries(diveFormData).map(([key, value]) => (
                    <li key={key}>
                      <strong>{value.label}:</strong> {formData[value.name]}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="confirmation__item">
                <h3>Sightings</h3>
                <ul>
                  {sightingData
                    .filter((item) => item.defaultValue > 0)
                    .map((item) => (
                      <li key={item.name}>
                        <strong>{item.name}:</strong> {item.defaultValue}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            {/* Display messages here */}
            <h3>
              {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </h3>
            <p></p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Form onSubmit={handleFormSubmit}>
        <div className='dive-form'>
          {renderStep()}
          <Button.Group fluid style={{marginTop:'10px'}}>
            {step > 1 && !submitted ? (
              <Button className="form-buttons"color='grey' type="button" onClick={handlePrevious}>Previous</Button>
            ) : (
              <Button className="form-buttons" negative type="button" onClick={handleResetForm}>Reset Form</Button>
            )}
            <Button.Or className='or-button'/>
            {step < totalSteps ? (
              <Button className="form-buttons" primary type="button" onClick={handleNext} disabled={formError} >Next</Button>
            ) : (
              <Button className="form-buttons" positive type="submit" disabled={submitted}>Submit</Button>
            )}
          </Button.Group>
        </div>
      </Form>
    </div>
  );
};

export default DiveForm;
