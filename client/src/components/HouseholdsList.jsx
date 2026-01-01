import React, { useEffect, useState } from "react";

function HouseholdsList() {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit mode control
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    address: "",
    contact: "",
    status: "",
    specialNeeds: "",
  });

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/households")
      .then((res) => res.json())
      .then((data) => {
        setHouseholds(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching households:", err);
        setLoading(false);
      });
  };

  const handleEditClick = (household) => {
    setEditingId(household._id);
    setEditFormData({
      name: household.name || "",
      address: household.address || "",
      contact: household.contact || "",
      status: household.status || "",
      specialNeeds: household.specialNeeds || "",
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/households/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        throw new Error("Failed to update household");
      }

      // Update local households state immediately without re-fetching everything
      setHouseholds((prev) =>
        prev.map((h) =>
          h._id === editingId ? { ...h, ...editFormData } : h
        )
      );

      setEditingId(null);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p>Loading households...</p>;

  return (
    <div>
      <h2>Households</h2>
      <ul>
        {households.map((h) => (
          <li key={h._id} style={{ marginBottom: "1.5rem" }}>
            {editingId === h._id ? (
              <>
                <input
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                />
                <br />
                <input
                  name="address"
                  value={editFormData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                />
                <br />
                <input
                  name="contact"
                  value={editFormData.contact}
                  onChange={handleInputChange}
                  placeholder="Contact"
                />
                <br />
                <input
                  name="status"
                  value={editFormData.status}
                  onChange={handleInputChange}
                  placeholder="Status"
                />
                <br />
                <input
                  name="specialNeeds"
                  value={editFormData.specialNeeds}
                  onChange={handleInputChange}
                  placeholder="Special Needs"
                />
                <br />
                <button onClick={handleSaveClick}>Save</button>
                <button onClick={handleCancelClick}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{h.name}</strong>
                <br />
                Address: {h.address}
                <br />
                Contact: {h.contact}
                <br />
                Status: {h.status}
                <br />
                Special Needs: {h.specialNeeds || "None"}
                <br />
                <button onClick={() => handleEditClick(h)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HouseholdsList;
