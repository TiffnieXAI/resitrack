import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ICONS

const personIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const houseIconSafe = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1524/1524815.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const houseIconNotSafe = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1534/1534049.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const houseIconUnverified = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/679/679922.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const incidentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/564/564619.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// Fix Leaflet default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Helpers

function Recenter({ position }) {
  const map = useMap();
  const done = useRef(false);

  useEffect(() => {
    if (position && !done.current) {
      map.setView(position, 15);
      done.current = true;
    }
  }, [position, map]);

  return null;
}

const distanceMeters = (a, b) => {
  const R = 6371e3;
  const φ1 = (a[0] * Math.PI) / 180;
  const φ2 = (b[0] * Math.PI) / 180;
  const Δφ = ((b[0] - a[0]) * Math.PI) / 180;
  const Δλ = ((b[1] - a[1]) * Math.PI) / 180;

  const x =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

// Main Component

export default function CurrentLocationMap({
  initialPosition = [14.5995, 120.9842],
  initialZoom = 13,
}) {
  const [pos, setPos] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [households, setHouseholds] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alertLevel, setAlertLevel] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const mapRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user?.role;
  const userId = user?.id;

  console.log("=== USER INFO ===");
  console.log("User role:", role);
  console.log("User ID:", userId);
  console.log("Is Admin:", role === "ROLE_ADMIN");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((p) => {
      setPos([p.coords.latitude, p.coords.longitude]);
      setAccuracy(p.coords.accuracy);
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/households", {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (role === "ROLE_USER") {
          data = data.filter((h) => String(h.createdBy) === String(userId));
        }
        setHouseholds(data);
      })
      .catch((error) => {
        console.error("Error fetching households:", error);
      });
  }, [role, userId]);

  useEffect(() => {
    const fetchIncidents = () => {
      fetch("http://localhost:5000/api/incidents", {
        credentials: "include",
      })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
          return r.json();
        })
        .then((data) => {
          setIncidents(data);
        })
        .catch((error) => {
          console.error("Error fetching incidents:", error);
        });
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const RADIUS = 5000;
    let highestAlert = null;

    // Only check alerts for regular users, not admins
    if (role === "ROLE_USER") {
      if (pos && pos[0] !== undefined && pos[1] !== undefined) {
        for (const inc of incidents) {
          const lat = Number(inc.latitude);
          const lng = Number(inc.longitude);
          
          if (isNaN(lat) || isNaN(lng)) continue;
          
          const incPos = [lat, lng];
          const distance = distanceMeters(pos, incPos);
          
          if (distance < RADIUS) {
            const severity = inc.severity?.toLowerCase();
            if (severity === "critical" || severity === "high") {
              highestAlert = "DANGER";
              break;
            } else {
              highestAlert = "WARNING";
            }
          }
        }
      }

      if (!highestAlert) {
        for (const h of households) {
          const hLat = Number(h.latitude);
          const hLng = Number(h.longitude);
          
          if (isNaN(hLat) || isNaN(hLng)) continue;

          for (const inc of incidents) {
            const incLat = Number(inc.latitude);
            const incLng = Number(inc.longitude);
            
            if (isNaN(incLat) || isNaN(incLng)) continue;

            const hPos = [hLat, hLng];
            const incPos = [incLat, incLng];
            const distance = distanceMeters(hPos, incPos);

            if (distance < RADIUS) {
              const severity = inc.severity?.toLowerCase();
              if (severity === "critical" || severity === "high") {
                highestAlert = "DANGER";
                break;
              } else {
                highestAlert = "WARNING";
              }
            }
          }
          
          if (highestAlert) break;
        }
      }
    }

    setAlertLevel(highestAlert);
  }, [pos, incidents, households, role]);

  const getIncidentsInRadius = () => {
    const RADIUS = 5000;
    const nearbyIncidents = [];
    const seenIncidents = new Set();

    for (const h of households) {
      const hLat = Number(h.latitude);
      const hLng = Number(h.longitude);
      
      if (isNaN(hLat) || isNaN(hLng)) continue;

      for (const inc of incidents) {
        const incLat = Number(inc.latitude);
        const incLng = Number(inc.longitude);
        
        if (isNaN(incLat) || isNaN(incLng)) continue;

        const hPos = [hLat, hLng];
        const incPos = [incLat, incLng];
        const distance = distanceMeters(hPos, incPos);

        if (distance < RADIUS && !seenIncidents.has(inc._id)) {
          seenIncidents.add(inc._id);
          nearbyIncidents.push({
            ...inc,
            distance: distance.toFixed(0),
            nearestHousehold: h.name,
          });
        }
      }
    }

    return nearbyIncidents;
  };

  const nearbyIncidents = getIncidentsInRadius();

  // Get list to display based on user role
  const getIncidentsToDisplay = () => {
    console.log("=== INCIDENTS DISPLAY ===");
    console.log("Role:", role);
    console.log("All incidents count:", incidents.length);
    
    if (role === "ROLE_ADMIN") {
      // Show ALL incidents for admin, sorted by latest first
      const sorted = [...incidents].sort((a, b) => {
        const dateA = new Date(a.timestamp || 0).getTime();
        const dateB = new Date(b.timestamp || 0).getTime();
        return dateB - dateA;
      });
      console.log("Admin mode - showing all:", sorted.length);
      return sorted;
    } else {
      // Show only nearby incidents for regular users
      console.log("User mode - showing nearby:", nearbyIncidents.length);
      return nearbyIncidents;
    }
  };

  const incidentsToDisplay = getIncidentsToDisplay();

  const getHouseIcon = (status) => {
    if (!status) return houseIconUnverified;
    if (status.toLowerCase() === "safe") return houseIconSafe;
    if (status.toLowerCase() === "not safe") return houseIconNotSafe;
    return houseIconUnverified;
  };

  const handleIncidentClick = (incident) => {
    if (mapRef.current && incident.latitude !== undefined && incident.longitude !== undefined) {
      mapRef.current.setView([incident.latitude, incident.longitude], 16);
    }
  };

  return (
    <>
      {alertLevel && showAlert && (
        <div
          onClick={() => setShowAlert(false)}
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "16px 32px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "18px",
            color: "white",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
            backgroundColor: alertLevel === "DANGER" ? "#dc2626" : "#eab308",
            zIndex: 9999,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          title="Click to dismiss"
        >
          ⚠️ {alertLevel}: Incident nearby
        </div>
      )}

      <div className="relative h-[60vh] w-full rounded-2xl overflow-hidden">
        <MapContainer
          center={pos && pos[0] !== undefined ? pos : initialPosition}
          zoom={initialZoom}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url={
              darkMode
                ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                : "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            }
          />

          {pos && role !== "ROLE_ADMIN" && (
            <>
              <Marker position={pos} icon={personIcon} />
              <Circle
                center={pos}
                radius={accuracy * 0.1}
                pathOptions={{
                  color: alertLevel === "DANGER" ? "#dc2626" : alertLevel === "WARNING" ? "#eab308" : "#00eaff",
                  fillColor: alertLevel === "DANGER" ? "#dc2626" : alertLevel === "WARNING" ? "#eab308" : "#00eaff",
                  fillOpacity: 0.2,
                }}
              />
              <Recenter position={pos} />
            </>
          )}

          {households
            .filter((h) => h.latitude !== undefined && h.longitude !== undefined)
            .map((h) => (
              <Marker
                key={h._id}
                position={[h.latitude, h.longitude]}
                icon={getHouseIcon(h.status)}
              >
                <Tooltip className="my-custom-tooltip">
                  <strong>{h.name}</strong>
                  <br />
                  Status: {h.status || "unverified"}
                </Tooltip>
              </Marker>
            ))}

          {incidents
            .filter((i) => i.latitude !== undefined && i.longitude !== undefined)
            .map((i) => (
              <Marker
                key={i._id}
                position={[i.latitude, i.longitude]}
                icon={incidentIcon}
              >
                <Tooltip className="my-custom-tooltip">
                  <strong>{i.type}</strong>
                  <br />
                  Severity: {i.severity}
                  <br />
                  Phase: {i.phase}
                </Tooltip>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* Incidents list */}
      <div className="incidents-list-wrapper" style={{ maxHeight: "400px", overflowY: "auto" }}>
        <h3 className="incidents-list-title">
          {role === "ROLE_ADMIN" ? "All Incidents" : "Incidents Near Your Households"}
        </h3>
        
        {incidentsToDisplay.length === 0 ? (
          <p className="incidents-list-empty">
            {role === "ROLE_ADMIN" ? "No incidents found" : "No incidents within 5km of your households"}
          </p>
        ) : (
          <div className="incidents-list-items">
            {incidentsToDisplay.map((inc, idx) => (
              <div
                key={`incident-${inc._id}-${idx}`}
                onClick={() => handleIncidentClick(inc)}
                className={`incident-card ${inc.severity?.toLowerCase()} ${
                  inc.latitude === undefined || inc.longitude === undefined ? "no-location" : ""
                }`}
                onMouseEnter={(e) => {
                  if (inc.latitude !== undefined && inc.longitude !== undefined) {
                    e.currentTarget.style.backgroundColor = "#4b5563";
                  }
                }}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#374151"}
              >
                <div className="incident-card-header">
                  <div className="incident-card-type">{inc.type}</div>
                  <span className={`incident-severity-badge ${inc.severity?.toLowerCase()}`}>
                    {inc.severity?.toUpperCase()}
                  </span>
                </div>
                <p className="incident-detail">
                  <strong>Area:</strong> {inc.affectedArea}
                </p>
                <p className="incident-detail">
                  <strong>Phase:</strong> {inc.phase}
                  {inc.latitude !== undefined && inc.longitude !== undefined && role !== "ROLE_ADMIN" && (
                    <> | <strong>Distance:</strong> {inc.distance}m from {inc.nearestHousehold}</>
                  )}
                  {inc.latitude === undefined || inc.longitude === undefined ? (
                    <span className="incident-no-location-warning"> ⚠️ No location</span>
                  ) : null}
                </p>
                <p className="incident-time">
                  <strong>Time:</strong> {new Date(inc.timestamp).toLocaleString()}
                </p>
                <p className="incident-description">
                  <strong>Description:</strong> {inc.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}