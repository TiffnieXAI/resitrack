import React, { useEffect, useState } from "react";

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const ITEMS_PER_PAGE = 5;

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Get logged-in user & role
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = storedUser?.role === "ROLE_ADMIN";

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/incidents`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch incidents");

      const data = await res.json();
      setIncidents(data);
      setPage(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // DELETE (ADMIN ONLY)
  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this incident?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/incidents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      setIncidents((prev) => prev.filter((i) => i._id != id));
    } catch (err) {
      console.error(err);
      alert("Error deleting incident");
    }
  };

  // START EDIT
  const handleEdit = (incident) => {
    setEditingId(incident._id);
    setEditForm({ ...incident });
  };

  // SAVE EDIT
  const handleSave = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/incidents/${editingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(editForm),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      setIncidents((prev) =>
        prev.map((i) => (i._id === editingId ? editForm : i))
      );

      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    }
  };

  const paginatedIncidents = incidents.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  if (loading) return <p>Loading incidents...</p>;
  if (incidents.length === 0) return <p>No incidents found.</p>;

  return (
    <div className="incidents-list-wrapper">
      {paginatedIncidents.map((incident) => {
        const isEditing = editingId === incident._id;

        return (
          <div className="incidents-con" key={incident._id}>
            <div className="incident-container">
              <div className="incident-header">
                <div className="incident-title">
                  <div className="incident-head-title">
                    {isEditing ? (
                      <input
                        value={editForm.type}
                        onChange={(e) =>
                          setEditForm({ ...editForm, type: e.target.value })
                        }
                      />
                    ) : (
                      incident.type
                    )}
                  </div>

                  <div className="incident-status">
                    <div className="status-date">
                      {isEditing ? (
                        <input
                          value={editForm.phase}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              phase: e.target.value,
                            })
                          }
                        />
                      ) : (
                        incident.phase?.toUpperCase()
                      )}
                    </div>
                    <div className="status-severity">
                      {isEditing ? (
                        <input
                          value={editForm.severity}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              severity: e.target.value,
                            })
                          }
                        />
                      ) : (
                        incident.severity?.toUpperCase()
                      )}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                {isAdmin && (
                  <div className="incident-actions">
                    {isEditing ? (
                      <>
                        <button onClick={handleSave} style={{ color: "white" }}>
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{ color: "white" }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(incident)}
                          style={{ color: "white" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(incident._id)}
                          style={{ color: "white" }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="incident-divider">
                <div></div>
              </div>

              <div className="incident-content">
                <div className="incident-list">
                  <div>
                    <strong>Affected Area:</strong>{" "}
                    {isEditing ? (
                      <input
                        value={editForm.affectedArea}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            affectedArea: e.target.value,
                          })
                        }
                      />
                    ) : (
                      incident.affectedArea
                    )}
                  </div>

                  <div>
                    <strong>Number of Affected Families:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.numberOfAffectedFamilies}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            numberOfAffectedFamilies: e.target.value,
                          })
                        }
                      />
                    ) : (
                      incident.numberOfAffectedFamilies
                    )}
                  </div>

                  <div>
                    <strong>Relief Distributed:</strong>{" "}
                    {isEditing ? (
                      <input
                        value={editForm.reliefDistributed}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            reliefDistributed: e.target.value,
                          })
                        }
                      />
                    ) : (
                      incident.reliefDistributed || "None"
                    )}
                  </div>

                  <div>
                    <strong>Description:</strong>{" "}
                    {isEditing ? (
                      <input
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                      />
                    ) : (
                      incident.description
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* PAGINATION */}
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
              (p + 1) * ITEMS_PER_PAGE < incidents.length ? p + 1 : p
            )
          }
          disabled={(page + 1) * ITEMS_PER_PAGE >= incidents.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default IncidentList;
