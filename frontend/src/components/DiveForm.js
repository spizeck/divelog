import React, { useState } from 'react';
import { Form, Input, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../styles/DiveForm.css'
import { createDive, createSighting } from '../utils/api';
import sightingsData from './sightingsData';
import diveFormData from './diveData';

const DiveForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (step === 1) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (step >= 2 && step <= totalSteps) {
      setSightingData((prevData) => 
        prevData.map(item =>
          item.name === name ? { ...item, defaultValue: value } : item
          )
      );          
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === totalSteps) {
      // Submit dive data to the /dives endpoint
      createDive(formData)
        .then((response) => {
          const diveId = response.data.id;
          console.log("Dive ID:", diveId);

          // Create a new sighting instance using the form data and the dive ID
          const sightings = Object.entries(sightingData).map(([key, value]) => {
            return {
              species: key,
              count: value,
              dive_id: diveId,
            };
          });
          console.log("Sightings:", sightings);

          // Submit sightings data to the /sightings endpoint
          return createSighting(sightings);
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("Sightings logged successfully");
            setSubmitted(true);
          } else {
            throw new Error("Failed to create sightings");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
          if (error.response) {
            console.log("Response data:", error.response.data);
            console.log("Response status:", error.response.status);
            console.log("Response headers:", error.response.headers);
          }

        });

    }

    // Set submitted to true to render the confirmation screen
    
    setStep((prevStep) => prevStep + 1);
    
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleReset = () => {
    setFormData(diveFormData);
    setSightingData(sightingsData);
    setSubmitted(false);
    setStep(1);
  };

  const renderConfirmationScreen = () => {
    return (
      <div>
        <h2>Form Submission Successful!</h2>
        <p>Summary of submitted data:</p>
        {/* Render a summary of the submitted data */}
        {Object.entries(formData).map(([key, value]) => (
          <p key={key}>{value.label}:
            {value.type === 'select' ? value.options.find(option =>
              option.value === value.value)?.text : value.value}</p>
        ))}
        <Button onClick={handleReset}>Reset Form</Button>
      </div>
    );
  };

  const renderStep = () => {
    if (submitted) {
      return renderConfirmationScreen();
    }

    switch (step) {
      case 1:
        return (
          <>
            {Object.entries(diveFormData).map(([key, value]) => (
              <Form.Field key={key}>
                <label>{value.label} </label>
                {value.type === 'select' ? (
                  <Form.Select
                    name={value.name}
                    options={value.options}
                    value={formData[value.name]}
                    onChange={handleChange}
                  />
                ) : (
                  <Input
                    type={value.type}
                    name={value.name}
                    value={formData[value.name]}
                    onChange={handleChange}
                  />
                )}
              </Form.Field>
            ))}
          </>
        );
      case 2:
        return (
          <>
            {sightingsData
              .filter((sighting) => sighting.step === step)
              .map((sighting) => (
                <Form.Field key={sighting.name}>
                  <label>{sighting.name}</label>
                  <input
                    type="number"
                    name={sighting.name}
                    defaultValue={sighting.defaultValue}
                    onChange={handleChange}
                  />
                </Form.Field>
              ))}
          </>
        );

      case 3:
        return (
          <>
            {sightingsData
              .filter((sighting) => sighting.step === step)
              .map((sighting) => (
                <Form.Field key={sighting.name}>
                  <label>{sighting.name}</label>
                  <input
                    type="number"
                    name={sighting.name}
                    defaultValue={sighting.defaultValue}
                    onChange={handleChange}
                  />
                </Form.Field>
              ))}
          </>
        );
      case 4:
        return (
          <>
            {sightingsData
              .filter((sighting) => sighting.step === step)
              .map((sighting) => (
                <Form.Field key={sighting.name}>
                  <label>{sighting.name}</label>
                  <input
                    type="number"
                    name={sighting.name}
                    defaultValue={sighting.defaultValue}
                    onChange={handleChange}
                  />
                </Form.Field>
              ))}
          </>
        );
      default:
        return null;
    }


  };

  return (
    <Form onSubmit={handleSubmit} className="form-container">
      {renderStep()}
      <div className="button-container">
        {step > 1 && (
          <Button type="button" onClick={handlePrevious} className="previous-button">
            Previous
          </Button>
        )}
        <Button type="submit" primary>
          {step === totalSteps ? "Submit" : "Next"}
        </Button>
      </div>
    </Form>
  );
};

export default DiveForm;
