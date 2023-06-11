import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Dive Number:</label>
        <input
          type="text"
          name="diveNumber"
          value={formData.diveNumber}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Boat:</label>
        <input
          type="text"
          name="boat"
          value={formData.boat}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Dive Guide:</label>
        <input
          type="text"
          name="diveGuide"
          value={formData.diveGuide}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Dive Site:</label>
        <input
          type="text"
          name="diveSite"
          value={formData.diveSite}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default DiveForm;
