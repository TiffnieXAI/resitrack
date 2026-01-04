const express = require("express");
const router = express.Router();
const { getDB } = require("../db/mongo");

// Middleware to check user session
function authMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

/**
 * GET /api/incidents
 * Needed for IncidentList.jsx
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = getDB();

    const incidents = await db
      .collection("incidents")
      .find({})
      .sort({ timestamp: -1 }) // newest first
      .toArray();

    res.json(incidents);
  } catch (error) {
    console.error("Error fetching incidents:", error);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

// POST /api/incidents - create a new incident with numeric _id
router.post("/", authMiddleware, async (req, res) => {
  try {
    const db = getDB();

    // Get max numeric _id for incidents collection
    const lastIncident = await db
      .collection("incidents")
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
      latitude,
      longitude,
    } = req.body;

    // Basic validation
    if (
      !type ||
      !phase ||
      !severity ||
      !affectedArea ||
      numberOfAffectedFamilies === undefined ||
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
      reliefDistributed: reliefDistributed || "",
      description,
      latitude: Number(latitude),
      longitude: Number(longitude),
      status: "unverified",
      timestamp: new Date().toISOString(),
      _class: "com.thecroods.resitrack.models.Incident",
    };

    await db.collection("incidents").insertOne(incidentData);

    res.status(201).json({
      message: "Incident created",
      incident: incidentData,
    });
  } catch (error) {
    console.error("Error creating incident:", error);
    res.status(500).json({ error: "Failed to create incident" });
  }
});

// PATCH /api/incidents/:id  (EDIT INCIDENT)
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid incident ID" });
    }

    const {
      type,
      phase,
      severity,
      affectedArea,
      numberOfAffectedFamilies,
      reliefDistributed,
      description,
      latitude,
      longitude,
    } = req.body;

    const updateData = {
      ...(type && { type }),
      ...(phase && { phase }),
      ...(severity && { severity }),
      ...(affectedArea && { affectedArea }),
      ...(numberOfAffectedFamilies !== undefined && {
        numberOfAffectedFamilies: Number(numberOfAffectedFamilies),
      }),
      ...(reliefDistributed !== undefined && { reliefDistributed }),
      ...(description && { description }),
      ...(latitude !== undefined && { latitude: Number(latitude) }),
      ...(longitude !== undefined && { longitude: Number(longitude) }),
    };

    const result = await db.collection("incidents").updateOne(
      { _id: id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json({ message: "Incident updated successfully" });
  } catch (error) {
    console.error("Error updating incident:", error);
    res.status(500).json({ error: "Failed to update incident" });
  }
});

// DELETE /api/incidents/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id); // convert to number since your _id is numeric

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid incident ID" });
    }

    const result = await db.collection("incidents").deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json({ message: "Incident deleted successfully" });
  } catch (error) {
    console.error("Error deleting incident:", error);
    res.status(500).json({ error: "Failed to delete incident" });
  }
});

module.exports = router;