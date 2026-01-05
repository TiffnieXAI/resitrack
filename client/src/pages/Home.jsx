import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import PageHeader from "../components/PageHeader";

const API_BASE = "http://localhost:5000";

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

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    danger: 0,
    unverified: 0,
    safetyPercentage: "0%",
  });

  const [nearbyIncidents, setNearbyIncidents] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [incidentsChartData, setIncidentsChartData] = useState([]);

  // Fetch user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/session`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.loggedIn && data.user) {
          // Convert 'id' to '_id' for consistency with household createdBy checks
          setUser({ ...data.user, _id: data.user.id });
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch households
  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE}/api/households`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        let filteredData = data;
        if (user.role === "ROLE_USER") {
          filteredData = data.filter((h) => String(h.createdBy) === String(user._id || user.id));
        }
        setHouseholds(filteredData);

        const total = filteredData.length;
        const safe = filteredData.filter((h) => h.status === "safe").length;
        const danger = filteredData.filter((h) => h.status === "not safe").length;
        const unverified = filteredData.filter(
          (h) => h.status !== "safe" && h.status !== "not safe"
        ).length;
        const safetyPercentage =
          total > 0 ? `${((safe / total) * 100).toFixed(1)}%` : "0%";

        setStats({ total, safe, danger, unverified, safetyPercentage });
      })
      .catch((err) => {
        console.error("Failed to fetch households", err);
      });
  }, [user]);

  // Fetch incidents
  useEffect(() => {
    fetch(`${API_BASE}/api/incidents`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setIncidents(data);
      })
      .catch((err) => {
        console.error("Failed to fetch incidents", err);
      });
  }, []);

  // Get nearby incidents within 48 hours for users
  useEffect(() => {
    if (user?.role === "ROLE_USER" && households.length > 0 && incidents.length > 0) {
      const RADIUS = 5000;
      const now = new Date();
      const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
      const nearbySet = new Set();
      const nearby = [];

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
          const incidentTime = new Date(inc.timestamp);

          if (distance < RADIUS && incidentTime > fortyEightHoursAgo && !nearbySet.has(inc._id)) {
            nearbySet.add(inc._id);
            nearby.push({
              ...inc,
              distance: distance.toFixed(0),
              nearestHousehold: h.name,
            });
          }
        }
      }

      // Sort by latest first
      nearby.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNearbyIncidents(nearby);
    }
  }, [user, households, incidents]);

  // Generate chart data for last 24 hours
  useEffect(() => {
    if (user?.role === "ROLE_ADMIN" && incidents.length > 0) {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Create hourly buckets using hour index (0-23)
      const hourlyData = {};
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourIndex = hour.getHours();
        const hourKey = String(hourIndex).padStart(2, "0") + ":00";
        hourlyData[hourKey] = 0;
      }

      // Count incidents per hour
      incidents.forEach((inc) => {
        const incTime = new Date(inc.timestamp);
        if (incTime > oneDayAgo) {
          const hourIndex = incTime.getHours();
          const hourKey = String(hourIndex).padStart(2, "0") + ":00";
          if (hourlyData.hasOwnProperty(hourKey)) {
            hourlyData[hourKey]++;
          }
        }
      });

      // Convert to array format for chart
      const chartData = Object.entries(hourlyData).map(([time, count]) => ({
        time,
        incidents: count,
      }));

      setIncidentsChartData(chartData);
    }
  }, [user, incidents]);

  const handleIncidentClick = (incident) => {
    // Store incident location in sessionStorage
    sessionStorage.setItem("focusIncident", JSON.stringify({
      latitude: incident.latitude,
      longitude: incident.longitude,
    }));
    // Navigate to map
    navigate("/map");
  };

  // Stats for admin
  const adminStats = {
    totalIncidents: incidents.length,
    criticalIncidents: incidents.filter((i) => i.severity?.toLowerCase() === "critical").length,
    highIncidents: incidents.filter((i) => i.severity?.toLowerCase() === "high").length,
    incidentsByType: incidents.reduce((acc, inc) => {
      acc[inc.type] = (acc[inc.type] || 0) + 1;
      return acc;
    }, {}),
  };

  if (loading) {
    return <div className="content-wrapper"><p>Loading...</p></div>;
  }

  if (!user) {
    return <div className="content-wrapper"><p>Unauthorized</p></div>;
  }

  return (
    <div className="content-wrapper">
      <PageHeader />
      <div className="summary-container">
        {/* Your UI for stats */}
        <div className="summary-bar summary-line">
          <div className="summary-bar-desc">
            <div>
              <p>Households</p>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="summary-bar-desc">
            <div>
              <p>Safe</p>
              <p>{stats.safe}</p>
            </div>
          </div>
          <div className="summary-bar-desc">
            <div>
              <p>Danger</p>
              <p>{stats.danger}</p>
            </div>
          </div>
          <div className="summary-bar-desc">
            <div>
              <p>Unverified</p>
              <p>{stats.unverified}</p>
            </div>
          </div>
        </div>
        <div className="summary-bar smaller-bar">
          <div className="summary-bar-desc">
            <div>
              <p>Safety Percentage</p>
              <p>{stats.safetyPercentage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Section - Nearby Incidents */}
      {user.role === "ROLE_USER" && (
        <div style={{ marginTop: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
            Nearby Incidents (Last 48 Hours)
          </h3>
          
          {nearbyIncidents.length === 0 ? (
            <p style={{ color: "#9ca3af" }}>No incidents within 5km in the last 48 hours</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {nearbyIncidents.map((inc) => (
                <div
                  key={`incident-${inc._id}`}
                  onClick={() => handleIncidentClick(inc)}
                  className={`incident-card ${inc.severity?.toLowerCase()}`}
                  style={{
                    padding: "16px",
                    backgroundColor: "#374151",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${
                      inc.severity?.toLowerCase() === "critical" ? "#dc2626" :
                      inc.severity?.toLowerCase() === "high" ? "#ea580c" :
                      inc.severity?.toLowerCase() === "medium" ? "#eab308" :
                      "#10b981"
                    }`,
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#374151"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "16px" }}>{inc.type}</strong>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor:
                        inc.severity?.toLowerCase() === "critical" ? "#dc2626" :
                        inc.severity?.toLowerCase() === "high" ? "#ea580c" :
                        inc.severity?.toLowerCase() === "medium" ? "#eab308" :
                        "#10b981",
                      color: "white",
                    }}>
                      {inc.severity?.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0", fontSize: "14px", color: "#d1d5db" }}>
                    <strong>Area:</strong> {inc.affectedArea}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "14px", color: "#d1d5db" }}>
                    <strong>Phase:</strong> {inc.phase} | <strong>Distance:</strong> {inc.distance}m from {inc.nearestHousehold}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "14px", color: "#9ca3af" }}>
                    <strong>Time:</strong> {new Date(inc.timestamp).toLocaleString()}
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#d1d5db" }}>
                    <strong>Description:</strong> {inc.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin Section - Charts and Stats */}
      {user.role === "ROLE_ADMIN" && (
        <div style={{ marginTop: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
            Incidents Overview
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            <div style={{
              padding: "16px",
              backgroundColor: "#292C2C",
              borderRadius: "8px",
              color: "white",
              borderLeft: "4px solid #3b82f6",
            }}>
              <p style={{ color: "#9ca3af", margin: "0 0 8px 0" }}>Total Incidents</p>
              <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>{adminStats.totalIncidents}</p>
            </div>

            <div style={{
              padding: "16px",
              backgroundColor: "#292C2C",
              borderRadius: "8px",
              color: "white",
              borderLeft: "4px solid #dc2626",
            }}>
              <p style={{ color: "#9ca3af", margin: "0 0 8px 0" }}>Critical</p>
              <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>{adminStats.criticalIncidents}</p>
            </div>

            <div style={{
              padding: "16px",
              backgroundColor: "#292C2C",
              borderRadius: "8px",
              color: "white",
              borderLeft: "4px solid #ea580c",
            }}>
              <p style={{ color: "#9ca3af", margin: "0 0 8px 0" }}>High</p>
              <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>{adminStats.highIncidents}</p>
            </div>
          </div>

          {/* Line Chart - Last 24 Hours */}
          <div style={{
            padding: "16px",
            backgroundColor: "#292C2C",
            borderRadius: "8px",
            color: "white",
            marginBottom: "24px",
          }}>
            <h4 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "bold" }}>Incidents Last 24 Hours</h4>
            {incidentsChartData.length === 0 ? (
              <p style={{ color: "#9ca3af", margin: 0 }}>No incidents in the last 24 hours</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={incidentsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#374151",
                      border: "1px solid #4b5563",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="incidents" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Incidents"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Incidents by Type */}
          <div style={{
            padding: "16px",
            backgroundColor: "#292C2C",
            borderRadius: "8px",
            color: "white",
          }}>
            <h4 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "bold" }}>Incidents by Type</h4>
            {Object.keys(adminStats.incidentsByType).length === 0 ? (
              <p style={{ color: "#9ca3af", margin: 0 }}>No incidents</p>
            ) : (
              <div style={{ display: "grid", gap: "8px" }}>
                {Object.entries(adminStats.incidentsByType).map(([type, count]) => (
                  <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{type}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        height: "24px",
                        width: `${(count / adminStats.totalIncidents) * 200}px`,
                        backgroundColor: "#3b82f6",
                        borderRadius: "4px",
                      }}></div>
                      <span style={{ minWidth: "30px", textAlign: "right" }}>{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;