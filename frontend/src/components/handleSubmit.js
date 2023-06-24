import api from "../utils/api";

const handleSubmit = async (e, formData, sightingData, step, totalSteps, setSubmitted) => {
    e.preventDefault();

    if (step === totalSteps) {
      // Submit dive data to the /dives endpoint
      try {
        const diveResponse = await api.createDive(formData);
        const diveId = diveResponse.id;
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
            const sightingsResponse = await api.createSightings(sightings);
            console.log("Sightings response:", sightingsResponse);

            if (sightingsResponse.status === 200) {
                console.log("Sightings logged successfully");
                setSubmitted(true);
            } else {
                throw new Error("Failed to create sightings");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            if (error.response) {
                console.log("Response data:", error.response.data);
                console.log("Response status:", error.response.status);
                console.log("Response headers:", error.response.headers);
            }
        }
    }
};

export default handleSubmit;