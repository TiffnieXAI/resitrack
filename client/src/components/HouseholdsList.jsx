import React, { useEffect, useState } from "react"

function HouseholdsList() {
  const [households, setHouseholds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5000/api/households")
      .then(res => res.json())
      .then(data => {
        setHouseholds(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching households:", err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading households...</p>

  return (
    <div>
      <h2>Households</h2>
      <ul>
        {households.map(h => (
          <li key={h._id}>
            <strong>{h.name}</strong><br />
            Address: {h.address}<br />
            Contact: {h.contact}<br />
            com.thecroods.resitrack.enums.Status: {h.status}<br />
            Special Needs: {h.specialNeeds || "None"}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HouseholdsList
