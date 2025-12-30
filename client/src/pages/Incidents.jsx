import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import "../index.css";

function Incidents() {
 
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    type: "Earthquake",
    phase: "Incoming",
    severity: "Low",
    affectedArea: "",
    numberOfAffectedFamilies: "",
    reliefDistributed: "",
    description: "",
  });



  const cancelIncidentForm = () => {
  setErrorMessage("");
  setFormData({
    type: "Earthquake",
    phase: "Incoming",
    severity: "Low",
    affectedArea: "",
    numberOfAffectedFamilies: "",
    reliefDistributed: "",
    description: "",
  });

  document.getElementById("incidents").classList.add("hide-form");
  console.log("Form hidden");
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.affectedArea ||
      !formData.numberOfAffectedFamilies
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    console.log("Submitted Incident:", formData);

   
    setErrorMessage("");
  };

  return (
    <div className="content-wrapper">
      <PageHeader />

      <div id="incidents" className="tab-content hide-form">
     

          <div id="householdForm" className="form-overlay">
            <form
              className="household-form"
              onSubmit={handleSubmit}
            >
              <h3>List Incident</h3>
              {errorMessage && (
                <p className="error-message">{errorMessage}</p>
              )}

              <label>Type:</label>
              <select
                name="type"
                className="form-input"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Earthquake">Earthquake</option>
                <option value="Fire">Fire</option>
                <option value="Flood">Flood</option>
                <option value="Landslide">Landslide</option>
                <option value="Typhoon">Typhoon</option>
              </select>

              <label>Phase:</label>
              <select
                name="phase"
                className="form-input"
                value={formData.phase}
                onChange={handleChange}
                required
              >
                <option value="Incoming">Incoming</option>
                <option value="Occurring">Occurring</option>
                <option value="Past">Past</option>
              </select>

              <label>Severity:</label>
              <select
                name="severity"
                className="form-input"
                value={formData.severity}
                onChange={handleChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>

              <label>Affected Area:</label>
              <input
                type="text"
                name="affectedArea"
                className="form-input"
                value={formData.affectedArea}
                onChange={handleChange}
                required
              />

              <label>Number of Affected Families:</label>
              <input
                type="number"
                name="numberOfAffectedFamilies"
                className="form-input"
                value={formData.numberOfAffectedFamilies}
                onChange={handleChange}
                required
              />

              <label>Relief Distributed:</label>
              <input
                type="text"
                name="reliefDistributed"
                className="form-input"
                value={formData.reliefDistributed}
                onChange={handleChange}
                required
              />

              <label>Description:</label>
              <input
                type="text"
                name="description"
                className="form-input"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <div className="button-group">
                <button type="submit" className="submit-button">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={cancelIncidentForm}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
}

export default Incidents;
