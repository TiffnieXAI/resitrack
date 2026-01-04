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

// GET households
router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const user = req.session.user;

    let query = {};
    if (user.role !== "ROLE_ADMIN") {
      query.createdBy = user.id;
    }

    const households = await db.collection("households").find(query).toArray();
    res.json(households);
  } catch (error) {
    console.error("Error fetching households:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST new household
router.post("/", authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const user = req.session.user;

    // Find max numeric _id
    const lastHousehold = await db
      .collection("households")
      .find({ _id: { $type: "number" } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    const newId = lastHousehold.length > 0 ? lastHousehold[0]._id + 1 : 1;

    const householdData = {
      _id: newId,
      ...req.body,
      status: "unverified",
      createdBy: user.id,
      _class: "com.thecroods.resitrack.models.Household",
    };

    const result = await db.collection("households").insertOne(householdData);

    res.status(201).json({ message: "Household created", id: result.insertedId });
  } catch (error) {
    console.error("Error creating household:", error);
    res.status(500).json({ error: "Failed to create household" });
  }
});

// PATCH household
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const user = req.session.user;
    const householdId = Number(req.params.id);

    if (isNaN(householdId)) {
      return res.status(400).json({ message: "Invalid household ID" });
    }

    const household = await db.collection("households").findOne({ _id: householdId });
    if (!household) return res.status(404).json({ message: "Household not found" });

    if (user.role !== "ROLE_ADMIN" && household.createdBy !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updateFields = req.body;

    const result = await db.collection("households").updateOne(
      { _id: householdId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Household not found" });
    }

    const updated = await db.collection("households").findOne({ _id: householdId });
    res.json(updated);
  } catch (error) {
    console.error("Error updating household:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE household
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const user = req.session.user;
    const householdId = Number(req.params.id);

    if (isNaN(householdId)) {
      return res.status(400).json({ message: "Invalid household ID" });
    }

    const household = await db.collection("households").findOne({ _id: householdId });
    if (!household) return res.status(404).json({ message: "Household not found" });

    if (user.role !== "ROLE_ADMIN" && household.createdBy !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const result = await db.collection("households").deleteOne({ _id: householdId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Household not found" });
    }

    res.json({ message: "Household deleted" });
  } catch (error) {
    console.error("Error deleting household:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
