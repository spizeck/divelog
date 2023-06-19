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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (step === 1) {
      diveFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (step >= 2 && step <= totalSteps) {
      sightingsData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === totalSteps) {
      // Submit dive data to the /dives endpoint
      createDive(diveFormData)
        .then((response) => {
          const diveId = response.data.id;
          console.log("Dive ID:", diveId);

          // Create a new sighting instance using the form data and the dive ID
          const sightings = Object.entries(sightingsData).map((species) => {
            return {
              species,
              count: sightingsData[species],
              dive_id: diveId,
            };
          });
          console.log("Sightings:", sightings);

          // Submit sightings data to the /sightings endpoint
          return createSighting(sightings);
        })
        .then((response) => {
          if (response.ok) {
            console.log("Sightings logged successfully");
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

    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            {Object.entries(diveFormData).map(([key, value]) => (
              <Form.Field key={key}>
                <label>{value.label} </label>
                {value.type === 'select' ? (
                  <Form.Select
                    name={key}
                    options={value.options}
                    value={diveFormData[key]}
                    onChange={handleChange}
                  />
                ) : (
                  <Input
                    type={value.type}
                    name={key}
                    value={diveFormData[key]}
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
            {Object.entries(sightingsData).map(([key, value]) => (
              <Form.Field key={key}>
                <label>{value.label}</label>
                {value.type === 'select' ? (
                  <Form.Select
                    name={key}
                    options={value.options}
                    value={sightingsData[key]}
                    onChange={handleChange}
                  />
                ) : (
                  <Input
                    type={value.type}
                    name={key}
                    value={sightingsData[key]}
                    onChange={handleChange}
                  />
                )}
              </Form.Field>
            ))}
          </>
        );

      case 3:
        return (
          <>
            {Object.entries(sightingsData).map(([key, value]) => (
              <Form.Field key={key}>
                <label>{value.label}</label>
                {value.type === 'select' ? (
                  <Form.Select
                    name={key}
                    options={value.options}
                    value={sightingsData[key]}
                    onChange={handleChange}
                  />
                ) : (
                  <Input
                    type={value.type}
                    name={key}
                    value={sightingsData[key]}
                    onChange={handleChange}
                  />
                )}
              </Form.Field>
            ))}
          </>
        );
      case 4:
        return (
          <>
            {Object.entries(sightingsData).map(([key, value]) => (
              <Form.Field key={key}>
                <label>{value.label}</label>
                {value.type === 'select' ? (
                  <Form.Select
                    name={key}
                    options={value.options}
                    value={sightingsData[key]}
                    onChange={handleChange}
                  />
                ) : (
                  <Input
                    type={value.type}
                    name={key}
                    value={sightingsData[key]}
                    onChange={handleChange}
                  />
                )}
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
