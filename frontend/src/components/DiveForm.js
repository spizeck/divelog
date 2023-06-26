import React, { useState } from 'react';
import { Form, Input, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../styles/DiveForm.css'
import sightingsData from './sightingsData';
import diveFormData from './diveData';
import handleChange from './handleChange';
import handleSubmit from './handleSubmit';

const DiveForm = () => {
  const totalSteps = 5;
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

    return defaultData;
  });

  const [sightingData, setSightingData] = useState(sightingsData);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit(e, formData, sightingData, step, totalSteps, setSubmitted, setConfirmationMessage, setErrorMessage);
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
        setErrorMessage("An error occurred: " + error.response.data.message);
      } else {
        setErrorMessage("An error occurred: " + error.message);
      }
    }
  };

  const handleChangeFn = handleChange(setFormData, setSightingData, step, totalSteps);

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

  const handleReseForm = () => {
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

  const renderStep = () => {
  
    switch (step) {
      case 1:
        return (
          <div>
            <h2>Dive Information</h2>
            {Object.entries(diveFormData).map(([key, value]) => (
              <Form.Field key={key}>
                <label>{value.label}</label>
                {value.type === 'select' ? (
                  <Form.Select
                    name={value.name}
                    options={value.options}
                    value={formData[value.name] || ""}
                    onChange={handleChangeFn}
                  />
                ) : (
                  <Input
                    type={value.type}
                    name={value.name}
                    value={formData[value.name] || ""}
                    onChange={handleChangeFn}
                  />
                )}
              </Form.Field>
            ))}
            <p></p>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Sightings</h2>
            {sightingData
              .filter((item) => item.step === step)
              .map((item) => {
                const fieldValue = sightingData.find(
                  (data) => data.name === item.name)?.defaultValue || "";
                return (
                  <Form.Field key={item.name}>
                    <label>{item.name}</label>
                    <Input
                      type="number"
                      name={item.name}
                      value={fieldValue}
                      onChange={handleChangeFn}
                    />
                  </Form.Field>
                )
              })}
            <p></p>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Sightings cont.</h2>
            {sightingData
              .filter((item) => item.step === step)
              .map((item) => {
                const fieldValue = sightingData.find(
                  (data) => data.name === item.name)?.defaultValue || "";
                return (
                  <Form.Field key={item.name}>
                    <label>{item.name}</label>
                    <Input
                      type="number"
                      name={item.name}
                      value={fieldValue}
                      onChange={handleChangeFn}
                    />
                  </Form.Field>
                )
              })}
            <p></p>
          </div>
        );
      case 4:
        return (
          <div>
            <h2>Sightings cont.</h2>
            {sightingData
              .filter((item) => item.step === step)
              .map((item) => {
                const fieldValue = sightingData.find(
                  (data) => data.name === item.name)?.defaultValue || "";
                return (
                  <Form.Field key={item.name}>
                    <label>{item.name}</label>
                    <Input
                      type="number"
                      name={item.name}
                      value={fieldValue}
                      onChange={handleChangeFn}
                    />
                  </Form.Field>
                )
              })}
            <p></p>
          </div>
        );
      case 5:
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
                  {sightingData.map((item) => (
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
        {renderStep()}
        <div className="buttons">
          {step > 1 && !submitted ? (
          <Button type="button" onClick={handlePrevious}>Previous</Button>
          ) : (
            <Button type="button" onClick={handleReseForm}>Reset Form</Button>
          )}

          {step < totalSteps ? (
            <Button type="button" onClick={handleNext}>Next</Button>
          ) : (
            <Button type="submit" disabled={submitted}>Submit</Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default DiveForm;