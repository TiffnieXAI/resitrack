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

// Recenter helper
function Recenter({ position, zoom = 15 }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, zoom);
  }, [position, map, zoom]);
  return null;
}

export default function CurrentLocationMap({
  initialPosition = [14.5995, 120.9842],
  initialZoom = 13,
  watch = true,
}) {
  const [pos, setPos] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);
  const mapRef = useRef(null);

  // Dark mode toggle
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    const success = (p) => {
      const coords = [p.coords.latitude, p.coords.longitude];
      setPos(coords);
      setAccuracy(p.coords.accuracy);
      setLoading(false);
    };

    const fail = (e) => {
      setError(e.message || "Unable to retrieve location.");
      setLoading(false);
    };

    if (watch) {
      watchIdRef.current = navigator.geolocation.watchPosition(success, fail, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 20000,
      });
    } else {
      navigator.geolocation.getCurrentPosition(success, fail, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
      });
    }

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [watch]);

  const handleCenter = () => {
    if (pos && mapRef.current) {
      mapRef.current.setView(pos, 16);
    }
  };

  return (
    <div className="h-[70vh] md:h-[80vh] w-full rounded-2xl shadow-lg overflow-hidden p-2">
      <div className="relative h-full w-full">

        {/* Error Overlay */}
        {error && (
          <div className="absolute z-20 top-4 left-4 bg-white bg-opacity-90 p-3 rounded shadow">
            <strong className="block">Location error</strong>
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute z-20 inset-0 flex items-center justify-center bg-white bg-opacity-60">
            <div className="text-lg">Getting location…</div>
          </div>
        )}

        <MapContainer
          center={pos || initialPosition}
          zoom={initialZoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          {/* 🌙 DARK / ☀️ LIGHT TILE SWITCH */}
          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url={
              darkMode
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />

          {pos && (
            <>
              <Marker position={pos} />

              {/* Updated accuracy circle for dark mode */}
              {accuracy && (
                <Circle
                  center={pos}
                  radius={accuracy}
                  pathOptions={{
                    color: darkMode ? "#00eaff" : "#1363df",
                    fillColor: darkMode ? "#00eaff" : "#1363df",
                    fillOpacity: 0.15,
                    weight: 1,
                  }}
                />
              )}

              <Recenter position={pos} />
            </>
          )}
        </MapContainer>

        {/* Controls */}
        <div className="absolute z-30 top-4 right-4 flex flex-col gap-2">

          {/* Center Button */}
          <button
            onClick={handleCenter}
            className="px-3 py-2 bg-white rounded-lg shadow hover:scale-105 active:scale-95"
          >
            Center
          </button>

          {/* Track Toggle */}
          <button
            onClick={() => {
              if (!("geolocation" in navigator)) return setError("Geolocation not supported");
              setLoading(true);

              if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;

                // Single update
                navigator.geolocation.getCurrentPosition(
                  (p) => {
                    setPos([p.coords.latitude, p.coords.longitude]);
                    setAccuracy(p.coords.accuracy);
                    setLoading(false);
                  },
                  (e) => {
                    setError(e.message);
                    setLoading(false);
                  },
                );
              } else {
                watchIdRef.current = navigator.geolocation.watchPosition(
                  (p) => {
                    setPos([p.coords.latitude, p.coords.longitude]);
                    setAccuracy(p.coords.accuracy);
                    setLoading(false);
                  },
                  (e) => {
                    setError(e.message);
                    setLoading(false);
                  },
                  { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 },
                );
              }
            }}
            className="px-3 py-2 bg-white rounded-lg shadow hover:scale-105 active:scale-95"
          >
            {watchIdRef.current ? "Stop tracking" : "Track"}
          </button>

          {/* 🌗 Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-2 bg-white rounded-lg shadow hover:scale-105 active:scale-95"
          >
            {darkMode ? "Light Map" : "Dark Map"}
          </button>
        </div>

        {/* Position readout */}
        <div className="absolute z-20 left-4 bottom-4 bg-white bg-opacity-90 p-3 rounded shadow max-w-xs">
          <div className="text-sm">
            <strong>Position:</strong>{" "}
            {pos ? `${pos[0].toFixed(6)}, ${pos[1].toFixed(6)}` : "—"}
          </div>
          <div className="text-sm">
            <strong>Accuracy:</strong> {accuracy ? `${Math.round(accuracy)} m` : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
