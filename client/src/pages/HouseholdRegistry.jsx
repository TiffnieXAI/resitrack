import React, { useState } from "react";
import PageHeader from "../components/PageHeader";

    
function HouseholdRegistry() {
    // State to toggle form visibility
    const [showForm, setShowForm] = useState(false);

    // Toggle form visibility
    const showHouseholdForm = () => setShowForm(true);
    const cancelHouseholdForm = () => setShowForm(false);
return(
    <div className="content-wrapper">
        <PageHeader></PageHeader>
        <div id="household" className="tab-content" style={{ display: showForm ? "block" : "none" }}>
      <h2>Household Registry</h2>
      
      {/* Button to show the form */}
      {!showForm && (
        <button onClick={showHouseholdForm}>Register Household</button>
      )}

      {/* Household form */}
      {showForm && (
        <div id="householdForm">
          <h3>Register Household</h3>
          <form id="registerHousehold">
            <label>Name:</label>
            <input type="text" required />

            <label>Address:</label>
            <input type="text" required />

            <label>Latitude:</label>
            <input type="text" required />

            <label>Longitude:</label>
            <input type="text" required />

            <label>Contact:</label>
            <input type="text" required />

            <label>Special Needs (optional):</label>
            <input type="text" />

            <div style={{ marginTop: "10px" }}>
              <button type="submit">Submit</button>
              <button
                type="button"
                onClick={cancelHouseholdForm}
                style={{ marginLeft: "8px" }}
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
