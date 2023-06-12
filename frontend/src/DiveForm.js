import React, { useState } from 'react';
import { Form, Input, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './Form.css';

const DiveForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    diveNumber: '',
    boat: '',
    diveGuide: '',
    diveSite: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Send an HTTP POST request to the Flask API endpoint

    fetch('http://localhost:5000/dives', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Dive logged successfully');

      // Reset form data or show a success message
      } else {
       console.error('Failed to create dive');
      // Handle the error or show an error message
      }
    })
    .catch((error) => {
      console.error('An error occurred:', error);
      // Handle the error or show an error message
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="form-container">
      <Form.Field>
        <label>Date:</label>
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Dive Number:</label>
        <Input
          type="text"
          name="diveNumber"
          value={formData.diveNumber}
          onChange={handleChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Boat:</label>
        <Input
          type="text"
          name="boat"
          value={formData.boat}
          onChange={handleChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Dive Guide:</label>
        <Input
          type="text"
          name="diveGuide"
          value={formData.diveGuide}
          onChange={handleChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Dive Site:</label>
        <Input
          type="text"
          name="diveSite"
          value={formData.diveSite}
          onChange={handleChange}
        />
      </Form.Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default DiveForm;
