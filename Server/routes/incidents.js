const express = require("express");
const router = express.Router();
const { getDB } = require("../db/mongo");

// POST /api/incidents - create a new incident with numeric _id
router.post("/", async (req, res) => {
  try {
    const db = getDB();

    // Get max numeric _id for incidents collection
    const lastIncident = await db.collection("incidents")
      .find({ _id: { $type: "number" } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    const newId = lastIncident.length > 0 ? lastIncident[0]._id + 1 : 1;

    const {
      type,
      phase,
      severity,
      affectedArea,
      numberOfAffectedFamilies,
      reliefDistributed,
      description,
      latitude,   // <--- Added
      longitude,  // <--- Added
    } = req.body;

    // Basic validation - include latitude & longitude
    if (
      !type ||
      !phase ||
      !severity ||
      !affectedArea ||
      !numberOfAffectedFamilies ||
      !reliefDistributed ||
      !description ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const incidentData = {
      _id: newId,
      type,
      phase,
      severity,
      affectedArea,
      numberOfAffectedFamilies: Number(numberOfAffectedFamilies),
      reliefDistributed,
      description,
      latitude: Number(latitude),    // save as number
      longitude: Number(longitude),  // save as number
      status: "unverified",  // default status
      timestamp: new Date().toISOString(),
      _class: "com.thecroods.resitrack.models.Incident",
    };

    const result = await db.collection("incidents").insertOne(incidentData);

    res.status(201).json({ message: "Incident created", id: result.insertedId });
  } catch (error) {
    console.error("Error creating incident:", error);
    res.status(500).json({ error: "Failed to create incident" });
  }
});

module.exports = router;
