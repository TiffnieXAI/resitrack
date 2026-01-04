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
  iconUrl: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const houseIconNotSafe = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const houseIconUnverified = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946488.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
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
  const [darkMode, setDarkMode] = useState(true);

  const mapRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user?.role;
  const userId = user?.id;

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
    fetch("http://localhost:5000/api/incidents", {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then(setIncidents)
      .catch((error) => {
        console.error("Error fetching incidents:", error);
      });
  }, []);

  useEffect(() => {
    if (!pos) return;
    const RADIUS = 300;

    for (const inc of incidents) {
      const incPos = [inc.latitude, inc.longitude];
      if (distanceMeters(pos, incPos) < RADIUS) {
        setAlertLevel(
          inc.severity?.toLowerCase() === "high" ? "DANGER" : "WARNING"
        );
        return;
      }
      for (const h of households) {
        const hPos = [h.latitude, h.longitude];
        if (distanceMeters(hPos, incPos) < RADIUS) {
          setAlertLevel("WARNING");
          return;
        }
      }
    }
    setAlertLevel(null);
  }, [pos, incidents, households]);

  const getHouseIcon = (status) => {
    if (!status) return houseIconUnverified;
    if (status.toLowerCase() === "safe") return houseIconSafe;
    if (status.toLowerCase() === "not safe") return houseIconNotSafe;
    return houseIconUnverified;
  };

  return (
    <div className="relative h-[80vh] w-full rounded-2xl overflow-hidden">
      {alertLevel && (
        <div
          className={`absolute z-50 top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-bold text-white shadow-xl
          ${alertLevel === "DANGER" ? "bg-red-600" : "bg-yellow-500"}`}
        >
          ⚠️ {alertLevel}: Incident nearby
        </div>
      )}

      <MapContainer
        center={pos && pos[0] !== undefined ? pos : initialPosition}
        zoom={initialZoom}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(m) => (mapRef.current = m)}
      >
        <TileLayer
          url={
            darkMode
              ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              : "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          }
        />

        {pos && (
          <>
            <Marker position={pos} icon={personIcon} />
            <Circle
              center={pos}
              radius={accuracy * 0.1}
              pathOptions={{
                color: "#00eaff",
                fillOpacity: 0.15,
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
  );
}