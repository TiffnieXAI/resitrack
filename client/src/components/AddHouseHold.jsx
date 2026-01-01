import { useState } from "react";

function AddHouseHold() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    contact: "",
    specialNeeds: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/households", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      const result = await response.json();
      console.log("Success:", result);

      // Clear form after submit
      setFormData({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        contact: "",
        specialNeeds: "",
      });

      // Hide form
      document.getElementById("household").classList.add("hide-form");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  const cancelHouseholdForm = () => {
    // Clear form fields
    setFormData({
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      contact: "",
      specialNeeds: "",
    });

    // Hide form
    document.getElementById("household").classList.add("hide-form");
  };

  return (
    <div id="household" className="tab-content hide-form">
      <div id="householdForm" className="form-overlay">
        <form id="registerHousehold" className="household-form" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            required
            className="form-input"
            placeholder="Juan A. Dela Cruz"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Address:</label>
          <input
            type="text"
            name="address"
            required
            className="form-input"
            placeholder="123 Main Street, Philippines"
            value={formData.address}
            onChange={handleChange}
          />

          <div className="coordinates">
            <div>
              <label>Latitude:</label>
              <input
                type="text"
                name="latitude"
                required
                className="form-input"
                placeholder="14.5995"
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Longitude:</label>
              <input
                type="text"
                name="longitude"
                required
                className="form-input"
                placeholder="120.9842"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            required
            className="form-input"
            placeholder="+639112345678"
            value={formData.contact}
            onChange={handleChange}
          />

          <label>Special Needs (optional):</label>
          <input
            type="text"
            name="specialNeeds"
            className="form-input"
            placeholder="e.g. PWD, senior citizen"
            value={formData.specialNeeds}
            onChange={handleChange}
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
    </div>
  );
}

export default AddHouseHold;
