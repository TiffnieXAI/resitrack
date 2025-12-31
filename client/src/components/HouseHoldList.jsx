import React, { useEffect, useState } from "react";

function HouseHoldList() {
  const [households, setHouseholds] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/households")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched households:", data); // Debug output

        // Sort descending by _id string (newest first)
        const sorted = data.sort((a, b) => (b._id > a._id ? 1 : -1));

        setHouseholds(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch households", err);
        setLoading(false);
      });
  };

  const paginatedHouseholds = households.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/households/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setHouseholds((prev) =>
        prev.map((h) => (h._id === id ? { ...h, status } : h))
      );
    } catch (error) {
      alert("Error updating status");
      console.error(error);
    }
  };

  const deleteHousehold = async (id) => {
    if (!window.confirm("Are you sure you want to delete this household?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/households/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete household");
      setHouseholds((prev) => prev.filter((h) => h._id !== id));
    } catch (error) {
      alert("Error deleting household");
      console.error(error);
    }
  };

  console.log("Current households state:", households); // Debug output

  if (loading) return <p>Loading households...</p>;
  if (households.length === 0) return <p>No households found.</p>;

  return (
    <div className="household-list-wrapper">
      {paginatedHouseholds.map((household) => (
        <div className="household-list-container" key={household._id}>
          <div className="household-list-header">
            <div className="house-hold-list-header-main">
              <div className="hosuehold-list-name">{household.name}</div>
              <div
                className={
                    household.status === "safe" ? "statusSafe" : "statusNot"
                }
                >
                {household.status === "safe" ? "Safe" : "Not Safe"}
                </div>
            </div>
            <div className="household-list-actions">
              <div
                className="edit-household"
                onClick={() => alert("Edit popup not implemented yet")}
                style={{ cursor: "pointer" }}
              >
                edit
              </div>
              <div
                className="edit-household"
                onClick={() => deleteHousehold(household._id)}
                style={{ cursor: "pointer" }}
              >
                delete
              </div>
            </div>
          </div>
          <div className="household-list-content">
            <div className="household-contents">
              <div className="household-infos">
                Address: <p>{household.address}</p>
              </div>
              <div className="household-infos">
                Contact: <p>{household.contact}</p>
              </div>
              <div className="household-infos">
                Coordinates: <p>{household.latitude}, {household.longitude}</p>
              </div>
              <div className="household-infos">
                Special Needs: <p>{household.specialNeeds || "None"}</p>
              </div>
            </div>
            <div className="household-status-change">
              <div
                className="marksafe"
                onClick={() => updateStatus(household._id, "safe")}
                
              >
                Mark Safe
              </div>
              <div
                className="mark-notsafe"
                onClick={() => updateStatus(household._id, "not safe")}
                
              >
                Mark Not Safe
              </div>
            </div>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>
          Prev
        </button>
        <button
          onClick={() => setPage(p => ((p + 1) * ITEMS_PER_PAGE < households.length ? p + 1 : p))}
          disabled={(page + 1) * ITEMS_PER_PAGE >= households.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HouseHoldList;
