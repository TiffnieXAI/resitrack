import React, { useEffect, useState } from "react";
import AddHouseHold from "./AddHouseHold";

function HouseHoldList() {
  const [households, setHouseholds] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // For edit control
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

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
      if (editingId === id) {
        // If deleting the household currently being edited, reset editing state
        setEditingId(null);
        setEditFormData({});
      }
    } catch (error) {
      alert("Error deleting household");
    }
  };

  // Edit button handler
  const handleEditClick = (household) => {
    if (editingId === household._id) {
      // Save clicked
      handleSaveClick(household._id);
    } else {
      // Enter edit mode
      setEditingId(household._id);
      setEditFormData({ ...household });
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Save updated data
  const handleSaveClick = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/households/${id}`, {
        method: "PUT", // or PATCH depending on your backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      if (!res.ok) throw new Error("Failed to save household");

      const updatedHousehold = await res.json();

      setHouseholds((prev) =>
        prev.map((h) => (h._id === id ? updatedHousehold : h))
      );
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      alert("Failed to save changes");
      console.error(error);
    }
  };

  // Update edit form fields on change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <p>Loading households...</p>;
  if (households.length === 0) return <p>No households found.</p>;

  return (
    <div className="household-list-wrapper">
      {paginatedHouseholds.map((household) => (
        <div className="household-list-container" key={household._id}>
          <div className="household-list-header">
            <div className="house-hold-list-header-main">
              {editingId === household._id ? (
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleInputChange}
                  style={{ color: "black" }}
                />
              ) : (
                <div className="hosuehold-list-name">{household.name}</div>
              )}

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
                style={{ cursor: "pointer" }}
                onClick={() => handleEditClick(household)}
              >
                {editingId === household._id ? "Save" : "Edit"}
              </div>
              <div
                className="edit-household"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  editingId === household._id
                    ? handleCancelClick()
                    : deleteHousehold(household._id)
                }
              >
                {editingId === household._id ? "Cancel" : "Delete"}
              </div>
            </div>
          </div>

          <div className="household-list-content">
            <div className="household-contents">
              <div className="household-infos">
                Address:{" "}
                {editingId === household._id ? (
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address || ""}
                    onChange={handleInputChange}
                    style={{ color: "black" }}
                  />
                ) : (
                  <p>{household.address}</p>
                )}
              </div>
              <div className="household-infos">
                Contact:{" "}
                {editingId === household._id ? (
                  <input
                    type="text"
                    name="contact"
                    value={editFormData.contact || ""}
                    onChange={handleInputChange}
                    style={{ color: "black" }}
                  />
                ) : (
                  <p>{household.contact}</p>
                )}
              </div>
              <div className="household-infos">
                Coordinates:{" "}
                {editingId === household._id ? (
                  <>
                    <input
                      type="text"
                      name="latitude"
                      value={editFormData.latitude || ""}
                      onChange={handleInputChange}
                      style={{ color: "black", width: "80px" }}
                    />
                    ,
                    <input
                      type="text"
                      name="longitude"
                      value={editFormData.longitude || ""}
                      onChange={handleInputChange}
                      style={{ color: "black", width: "80px" }}
                    />
                  </>
                ) : (
                  <p>
                    {household.latitude}, {household.longitude}
                  </p>
                )}
              </div>
              <div className="household-infos">
                Special Needs:{" "}
                {editingId === household._id ? (
                  <input
                    type="text"
                    name="specialNeeds"
                    value={editFormData.specialNeeds || ""}
                    onChange={handleInputChange}
                    style={{ color: "black" }}
                  />
                ) : (
                  <p>{household.specialNeeds || "None"}</p>
                )}
              </div>
            </div>

            <div className="household-status-change">
              <div
                className="marksafe"
                onClick={() => updateStatus(household._id, "safe")}
                style={{ cursor: "pointer" }}
              >
                Mark Safe
              </div>
              <div
                className="mark-notsafe"
                onClick={() => updateStatus(household._id, "not safe")}
                style={{ cursor: "pointer" }}
              >
                Mark Not Safe
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* STICKY PAGINATION */}
      <div className="pagination-bar">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          Prev
        </button>

        <button
          onClick={() =>
            setPage((p) =>
              (p + 1) * ITEMS_PER_PAGE < households.length ? p + 1 : p
            )
          }
          disabled={(page + 1) * ITEMS_PER_PAGE >= households.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HouseHoldList;
