import api from "../utils/api";

const handleSubmit = async (
  e, 
  formData, 
  sightingData, 
  step, 
  totalSteps, 
  setSubmitted, 
  setConfirmationMessage, 
  setErrorMessage
  ) => {
  e.preventDefault();

  if (step === totalSteps) {
    // Submit dive data to the /dives endpoint
    try {
      const diveResponse = await api.createDive(formData);
      const { diveId } = diveResponse;
      // console.log("Dive ID:", diveId);

      // Create a new sighting instance using the form data and the dive ID
      const sightings = sightingData.map((item) => {
        const count = item.count || item.defaultValue;
        return {
          species: item.name,
          count: parseInt(count, 10),
          dive_id: diveId,
        };
      });

      // console.log("Sightings:", sightings);

      // Submit sightings data to the /sightings endpoint
      const sightingsResponse = await api.createSighting({ sightings });
      // console.log("Sightings response:", sightingsResponse, sightingsResponse.status);

      if (sightingsResponse.status === 201) {
        // console.log("Sightings logged successfully");
        setConfirmationMessage("Dive logged successfully");
        setErrorMessage("");
        setSubmitted(true);
      } else {
        throw new Error("Failed to create sightings");
      }
    } catch (error) {
      // console.error("An error occurred:", error);
      setErrorMessage("An error occurred: " + error.message);
      if (error.response) {
        // console.log("Response data:", error.response.data);
        // console.log("Response status:", error.response.status);
        // console.log("Response headers:", error.response.headers);
        setErrorMessage("An error occurred: " + error.response.data.message);
      }
    }
  }
};

export default handleSubmit;