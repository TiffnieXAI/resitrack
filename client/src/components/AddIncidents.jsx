import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "../index.css";

// Fix default marker icon issues for leaflet
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

// Recenter helper component to focus map on marker once
function Recenter({ position, zoom = 15 }) {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    if (position && !hasCentered.current) {
      map.setView(position, zoom);
      hasCentered.current = true;
    }
  }, [position, map, zoom]);

  return null;
}

export default function AddIncidents() {
  const philippinesBounds = L.latLngBounds(
    L.latLng(4.5, 116.0),
    L.latLng(21.5, 127.0)
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [pos, setPos] = useState(null); // position for marker [lat, lng]
  const [accuracy, setAccuracy] = useState(null);

  const mapRef = useRef(null);

  // Form data (excluding lat/lng here, will use pos directly)
  const [formData, setFormData] = useState({
    type: "Earthquake",
    phase: "Incoming",
    severity: "Low",
    affectedArea: "",
    numberOfAffectedFamilies: "",
    reliefDistributed: "",
    description: "",
  });

  // Map click handler: place marker on map click if inside PH bounds
  function MapClickHandler() {
    const map = useMap();

    useEffect(() => {
      const onClick = (e) => {
        if (!philippinesBounds.contains(e.latlng)) return;
        const { lat, lng } = e.latlng;
        setPos([lat, lng]);
      };
      map.on("click", onClick);
      return () => map.off("click", onClick);
    }, [map]);

    return null;
  }

  // Get user's current location and set marker
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let { latitude, longitude, accuracy } = position.coords;

        // Clamp location inside PH bounds or default to center
        if (!philippinesBounds.contains([latitude, longitude])) {
          latitude = 12.8797;
          longitude = 121.7740;
          alert("Current location is outside the Philippines, defaulting map center.");
        }

        setPos([latitude, longitude]);
        setAccuracy(accuracy);
        setLoadingLocation(false);
      },
      () => {
        alert("Unable to retrieve your location.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Marker drag end handler to update position
  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setPos([lat, lng]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.affectedArea ||
      !formData.numberOfAffectedFamilies ||
      !formData.reliefDistributed ||
      !formData.description
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!pos) {
      setErrorMessage("Please select a location on the map.");
      return;
    }

    setErrorMessage("");

    // Prepare payload including lat/lng from pos
    const payload = {
      ...formData,
      latitude: pos[0],
      longitude: pos[1],
    };

    try {
      const response = await fetch("http://localhost:5000/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to submit incident");
      }

      const result = await response.json();
      console.log("Incident submitted:", result);

      // Reset form and marker
      setFormData({
        type: "Earthquake",
        phase: "Incoming",
        severity: "Low",
        affectedArea: "",
        numberOfAffectedFamilies: "",
        reliefDistributed: "",
        description: "",
      });
      setPos(null);
      setAccuracy(null);

      document.getElementById("incidents").classList.add("hide-form");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

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
    setPos(null);
    setAccuracy(null);
    document.getElementById("incidents").classList.add("hide-form");
  };

  return (
    <div id="incidents" className="tab-content hide-form">
      <div id="incidentForm" className="form-overlay">
        <form className="household-form" onSubmit={handleSubmit}>
          <h3>List Incident</h3>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

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

          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={loadingLocation}
            style={{ marginBottom: "10px" }}
          >
            {loadingLocation ? "Getting Location..." : "Get Current Location"}
          </button>

          <div style={{ height: "300px", width: "100%", marginBottom: "1rem" }}>
            <MapContainer
              center={pos || [12.8797, 121.774]}
              zoom={pos ? 15 : 6}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              maxBounds={philippinesBounds}
              maxBoundsViscosity={1.0}
              minZoom={5}
              maxZoom={18}
              whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap &copy; Stadia Maps"
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              />

              <MapClickHandler />

              {pos && (
                <>
                  <Marker
                    position={pos}
                    draggable={true}
                    eventHandlers={{ dragend: handleMarkerDragEnd }}
                  />
                  {accuracy && (
                    <Circle
                      center={pos}
                      radius={accuracy * 0.1}
                      pathOptions={{
                        color: "#00eaff",
                        fillColor: "#00eaff",
                        fillOpacity: 0.15,
                        weight: 1,
                      }}
                    />
                  )}
                  <Recenter position={pos} />
                </>
              )}
            </MapContainer>
          </div>

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
  );
}