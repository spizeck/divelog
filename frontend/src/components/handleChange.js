// handleChange.js is a function that handles the change of the form data and sighting data
// handleChange.js is imported into DiveForm.js
const handleChange = (setFormData, setSightingData, step, totalSteps) => (e) => {
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
  
  export default handleChange;