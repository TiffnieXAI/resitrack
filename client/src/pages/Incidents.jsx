import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import "../index.css"; // Ensure to import the CSS file

function Incidents() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showIncidentForm = () => {
    setFormVisible(true);
  };

  const cancelIncidentForm = () => {
    setFormVisible(false);
    setErrorMessage(""); // Reset error message on cancel
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    if (!data.affectedArea || !data.numberOfAffectedFamilies) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    console.log(data); // Submission logic
    setFormVisible(false); // Hide form after submission
    setErrorMessage(""); // Clear error message on successful submission
  };

  return (
    <div className="content-wrapper">
      <PageHeader />
      <div id="incidents" className="tab-content">
        <button onClick={showIncidentForm} className="list-incident-button">
          <h3>List Incident</h3>
        </button>
        {isFormVisible && (
          <div id="householdForm" className="form-overlay">
            <form
              id="registerHousehold"
              className="household-form"
              onSubmit={handleSubmit}
            >
              <h3>List Incident</h3>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <label>Type:</label>
              <select required className="form-input">
                <option value="Earthquake">Earthquake</option>
                <option value="Fire">Fire</option>
                <option value="Flood">Flood</option>
                <option value="Landslide">Landslide</option>
                <option value="Typhoon">Typhoon</option>
              </select>
              <label>Phase:</label>
              <select required className="form-input">
                <option value="Incoming">Incoming</option>
                <option value="Occurring">Occurring</option>
                <option value="Past">Past</option>
              </select>
              <label>Severity:</label>
              <select required className="form-input">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              <label>Affected Area:</label>
              <input type="text" required className="form-input" />
              <label>Number of Affected Families:</label>
              <input type="number" required className="form-input" />
              <label>Relief Distributed:</label>
              <input type="text" required className="form-input" />
              <label>Description:</label>
              <input type="text" required className="form-input" />
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
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Incidents;
