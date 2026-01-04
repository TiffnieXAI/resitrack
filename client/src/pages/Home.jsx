import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";

const API_BASE = "http://localhost:5000";

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    danger: 0,
    unverified: 0,
    safetyPercentage: "0%",
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/households`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((households) => {
        const total = households.length;
        const safe = households.filter((h) => h.status === "safe").length;
        const danger = households.filter((h) => h.status === "not safe").length;
        const unverified = households.filter(
          (h) => h.status !== "safe" && h.status !== "not safe"
        ).length;
        const safetyPercentage = total > 0 ? `${((safe / total) * 100).toFixed(1)}%` : "0%";

        setStats({ total, safe, danger, unverified, safetyPercentage });
      })
      .catch((err) => {
        console.error("Failed to fetch households", err);
      });
  }, []);

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
    </div>
  );
}

export default Home;
