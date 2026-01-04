import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issues
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

// Recenter helper component
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

export default function AddHouseHold() {
  const philippinesBounds = L.latLngBounds(
    L.latLng(4.5, 116.0),
    L.latLng(21.5, 127.0)
  );

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
    contact: "",
    specialNeeds: "",
  });

  const [pos, setPos] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const mapRef = useRef(null);

  // Update formData lat/lng when pos changes
  useEffect(() => {
    if (pos) {
      setFormData((prev) => ({
        ...prev,
        latitude: pos[0].toFixed(6),
        longitude: pos[1].toFixed(6),
      }));
    }
  }, [pos]);

  // Click on map to set marker position
  function MapClickHandler() {
    const map = useMap();

    useEffect(() => {
      const onClick = (e) => {
        const { lat, lng } = e.latlng;

        // Bound check: ignore clicks outside PH bounding box
        if (!philippinesBounds.contains(e.latlng)) return;

        setPos([lat, lng]);
      };
      map.on("click", onClick);
      return () => map.off("click", onClick);
    }, [map]);

    return null;
  }

  // Get current user location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Clamp location inside PH bounds if needed
        let lat = latitude;
        let lng = longitude;
        if (!philippinesBounds.contains([lat, lng])) {
          lat = 12.8797;
          lng = 121.7740;
          alert("Current location is outside the Philippines, defaulting map center.");
        }

        setPos([lat, lng]);
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

  // Marker drag handler
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Optional: Validate coordinates before submit
      if (!formData.latitude || !formData.longitude) {
        alert("Please select a location on the map.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/households", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",  // <-- ADD THIS LINE
        body: JSON.stringify(formData),
      });


      if (!response.ok) throw new Error("Failed to submit form");

      const result = await response.json();
      console.log("Success:", result);

      setFormData({
        name: "",
        address: "",
        latitude: null,
        longitude: null,
        contact: "",
        specialNeeds: "",
      });
      setPos(null);
      setAccuracy(null);

      document.getElementById("household").classList.add("hide-form");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  const cancelHouseholdForm = () => {
    setFormData({
      name: "",
      address: "",
      latitude: null,
      longitude: null,
      contact: "",
      specialNeeds: "",
    });
    setPos(null);
    setAccuracy(null);
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

          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={loadingLocation}
            style={{ marginBottom: "10px" }}
          >
            {loadingLocation ? "Getting Location..." : "Get Current Location"}
          </button>

          <div
            style={{ height: "300px", width: "100%", marginBottom: "1rem" }}
          >
            <MapContainer
              center={pos || [12.8797, 121.7740]}
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
            <button type="button" onClick={cancelHouseholdForm} className="cancel-button">
              Cancel
            </button>
          </div>

          
        </form>
      </div>
    </div>
  );
}
