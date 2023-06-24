import React, { useState } from 'react';
import { Form, Input, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../styles/DiveForm.css'
import sightingsData from './sightingsData';
import diveFormData from './diveData';
import handleChange from './handleChange';
import handleSubmit from './handleSubmit';

const DiveForm = () => {
  const totalSteps = 4;
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

  const handleFormSubmit = (e) => {
    handleSubmit(e, formData, sightingData, step, totalSteps, setSubmitted);
  };

  const handleChangeFn = handleChange(setFormData, setSightingData, step, totalSteps);

  const handlePrevious = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleReset = () => {
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
  };

  const renderConfirmationScreen = () => {
    return (
      <div className="confirmation">
        <h2>Thank you for logging your dive!</h2>
        <Button onClick={handleReset}>Log another dive</Button>
      </div>
    );
  }

  const renderStep = () => {
    if (submitted) {
      return renderConfirmationScreen();
    }

    switch (step) {
      case 1:
        return (
          <div className="step">
            <h2>Dive Information</h2>
            {Object.entries(diveFormData).map(([key, value]) => (
              <Form.Field key={key}>
                <label>{value.label}</label>
                {value.type === 'select' ? (
                  <Form.Select
                    name={value.name}
                    options={value.options}
                    value={formData[value.name]}
                    onChange={handleChangeFn}
                  />
                ) : (
                  <Input
                    type={value.type}
                    name={value.name}
                    value={formData[value.name]}
                    onChange={handleChangeFn}
                  />
                )}
              </Form.Field>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="step">
            <h2>Sightings</h2>
            <Form>
              {sightingData
                .filter((item) => item.step === step)
                .map((item) => (
                  <Form.Field key={item.name}>
                    <label>{item.name}</label>
                    <Input
                      type="number"
                      name={item.name}
                      value={formData[item.name]}
                      onChange={handleChangeFn}
                    />
                  </Form.Field>
                ))}
            </Form>
          </div>
        );
      case 3:
        return (
          <div className="step">
            <h2>Sightings</h2>
            <Form>
              {sightingData
                .filter((item) => item.step === step)
                .map((item) => (
                  <Form.Field key={item.name}>
                    <label>{item.name}</label>
                    <Input
                      type="number"
                      name={item.name}
                      value={formData[item.name]}
                      onChange={handleChangeFn}
                    />
                  </Form.Field>
                ))}
            </Form>
          </div>
        );
      case 4:
        return (
          <div className="step">
            <h2>Sightings</h2>
            <Form>
              {sightingData
                .filter((item) => item.step === step)
                .map((item) => (
                  <Form.Field key={item.name}>
                    <label>{item.name}</label>
                    <Input
                      type="number"
                      name={item.name}
                      value={formData[item.name]}
                      onChange={handleChangeFn}
                    />
                  </Form.Field>
                ))}
            </Form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <Form onSubmit={handleFormSubmit}>
        {renderStep()}
        <div className="buttons">
          <Button onClick={handlePrevious}>Previous</Button>
          {step < totalSteps ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default DiveForm;
