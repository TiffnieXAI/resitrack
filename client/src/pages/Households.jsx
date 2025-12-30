import React, { useState } from "react";
import PageHeader from "../components/PageHeader";

function HouseholdRegistry() {
  const [isFormVisible, setFormVisible] = useState(false);

  const showHouseholdForm = () => {
    setFormVisible(true);
  };

  const cancelHouseholdForm = () => {
    setFormVisible(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    // Handle form submission logic here
  };

  return (
    <div className="content-wrapper">
      <PageHeader />
      <div id="household" className="tab-content">
        <button onClick={showHouseholdForm} className="register-button">
          <h3>Register Household</h3>
        </button>
        {isFormVisible && (
          <div id="householdForm" className="form-overlay">
            <form
              id="registerHousehold"
              className="household-form"
              onSubmit={handleSubmit}
            >
              <label>Name:</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Juan A. Dela Cruz"
              />

              <label>Address:</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="123 Main Street, Anytown, Philippines"
              />

              <div className="coordinates">
                <div>
                  <label>Latitude:</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="40.6892"
                  />
                </div>
                <div>
                  <label>Longitude:</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="-74.0445"
                  />
                </div>
              </div>

              <label>Contact:</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="+639112345678"
              />

              <label>Special Needs (optional):</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. person with disability"
              />

              <div className="button-group">
                <button type="submit" className="submit-button">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={cancelHouseholdForm}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );

}

export default HouseholdRegistry;
