// handleChange.js is a function that handles the change of the form data and sighting data
// handleChange.js is imported into DiveForm.js
const handleChange = (setFormData, setSightingData, setFieldError, setFormError, diveFormData, step, totalSteps) => (e, { name, value }) => {
  console.log('Changing value of', name, 'to', value, 'in step', step, 'of', totalSteps, 'steps')

  if (step === 1) {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // After updating the state, run validation for this specific input field
    const fieldDefinition = diveFormData[name];
    const fieldValue = parseFloat(value, 10);
    console.log('Field Value:', fieldValue);
    if (fieldDefinition) {
      const { validate } = fieldDefinition;
      const error = validate(fieldValue);

      if (error) {
        setFieldError((prevErrors) => ({ ...prevErrors, [name]: error }));
        console.log('Error:', error);
        setFormError(true)
      } else {
        setFieldError((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          setFormError(false)
          return newErrors;
        });
      }
    }
  } else if (step >= 2 && step <= totalSteps) {
    setSightingData((prevData) =>
      prevData.map(item =>
        item.name === name ? { ...item, defaultValue: value } : item
      )
    );
  }
};

export default handleChange;