import React, { useState } from 'react';
import { Form, Input, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './Form.css';

const DiveForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [diveFormData, setDiveFormData] = useState({
    date: '',
    diveNumber: '',
    boat: '',
    diveGuide: '',
    diveSite: '',
  });

  const [sightingsData, setSightingsData] = useState({
    turtles: 0,
    sharks: 0,
    groupers: 0,
    invertebrates: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (step === 1) {
      setDiveFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (step >= 2 && step <= totalSteps) {
      setSightingsData((prevData) => ({
        ...prevData,
        [name]: parseInt(value, 10),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === totalSteps) {
      // Submit dive data to the /dives endpoint
      fetch("http://localhost:5000/dives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diveFormData),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Dive logged successfully");
            return response.json();
          } else {
            throw new Error("Failed to create dive");
          }
        })
        .then((data) => {
          const diveId = data.diveId;
          console.log("Dive ID:", diveId);

          // Create a new sighting instance using the form data and the dive ID
          const sightings = Object.keys(sightingsData).map((species) => {
            return {
              species,
              count: sightingsData[species],
              dive_id: diveId,
            };
          });
          console.log("Sightings:", sightings);
          // Submit sightings data to the /sightings endpoint
          return fetch("http://localhost:5000/sightings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sightings }),
            
          });
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
            <Form.Field>
              <label>Date:</label>
              <Input
                type="date"
                name="date"
                value={diveFormData.date}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Dive Number:</label>
              <Input
                type="text"
                name="diveNumber"
                value={diveFormData.diveNumber}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Boat:</label>
              <Input
                type="text"
                name="boat"
                value={diveFormData.boat}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Dive Guide:</label>
              <Input
                type="text"
                name="diveGuide"
                value={diveFormData.diveGuide}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Dive Site:</label>
              <Input
                type="text"
                name="diveSite"
                value={diveFormData.diveSite}
                onChange={handleChange}
              />
            </Form.Field>
          </>
        );
      case 2:
        return (
          <>
            <h3>Turtles and Sharks</h3>
            <Form.Field>
              <label>Turtles:</label>
              <Input
                type="number"
                name="turtles"
                value={sightingsData.turtles}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Sharks:</label>
              <Input
                type="number"
                name="sharks"
                value={sightingsData.sharks}
                onChange={handleChange}
              />
            </Form.Field>
          </>
        );
      case 3:
        return (
          <>
            <h3>Groupers</h3>
            <Form.Field>
              <label>Groupers:</label>
              <Input
                type="number"
                name="groupers"
                value={sightingsData.groupers}
                onChange={handleChange}
              />
            </Form.Field>
          </>
        );
      case 4:
        return (
          <>
            <h3>Invertebrates</h3>
            <Form.Field>
              <label>Invertebrates:</label>
              <Input
                type="number"
                name="invertebrates"
                value={sightingsData.invertebrates}
                onChange={handleChange}
              />
            </Form.Field>
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
