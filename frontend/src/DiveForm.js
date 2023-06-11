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
    // Perform form submission logic here, e.g., send data to backend API

    // Reset form data
    setFormData({
      date: '',
      diveNumber: '',
      boat: '',
      diveGuide: '',
      diveSite: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Date:
        <input
          type="text"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </label>
      <label>
        Dive Number:
        <input
          type="text"
          name="diveNumber"
          value={formData.diveNumber}
          onChange={handleChange}
        />
      </label>
      <label>
        Boat:
        <input
          type="text"
          name="boat"
          value={formData.boat}
          onChange={handleChange}
        />
      </label>
      <label>
        Dive Guide:
        <input
          type="text"
          name="diveGuide"
          value={formData.diveGuide}
          onChange={handleChange}
        />
      </label>
      <label>
        Dive Site:
        <input
          type="text"
          name="diveSite"
          value={formData.diveSite}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default DiveForm;
