const express = require("express");
const router = express.Router();
const { getDB } = require("../db/mongo");

// GET /api/households - get all households
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const households = await db.collection("households").find().toArray();
    res.json(households);
  } catch (error) {
    console.error("Error fetching households:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /api/households - create a new household with numeric _id
router.post("/", async (req, res) => {
  try {
    const db = getDB();

    // Find current max numeric _id in the collection
    const lastHousehold = await db.collection("households")
      .find({ _id: { $type: "number" } }) // ensure we only compare numeric _id
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    const newId = lastHousehold.length > 0 ? lastHousehold[0]._id + 1 : 1;

    const householdData = {
      _id: newId,
      ...req.body,
      status: "unverified",
      createdBy: "",
      _class: "com.thecroods.resitrack.models.Household",
    };

    console.log("Inserting household with _id:", newId);

    const result = await db.collection("households").insertOne(householdData);

    res.status(201).json({ message: "Household created", id: result.insertedId });
  } catch (error) {
    console.error("Error creating household:", error);
    res.status(500).json({ error: "Failed to create household" });
  }
});


// PATCH /api/households/:id - partial update (now with numeric _id)
router.patch("/:id", async (req, res) => {
  try {
    const db = getDB();
    const householdId = Number(req.params.id);

    if (isNaN(householdId)) {
      return res.status(400).json({ message: "Invalid household ID" });
    }

    const updateFields = req.body;

    const result = await db.collection("households").updateOne(
      { _id: householdId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Household not found" });
    }

    res.json({ message: "Household updated" });
  } catch (error) {
    console.error("Error updating household:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT /api/households/:id - full replace update with numeric _id
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const householdId = Number(req.params.id);

    if (isNaN(householdId)) {
      return res.status(400).json({ message: "Invalid household ID" });
    }

    const { name, address, contact, status, specialNeeds } = req.body;

    // Validation: required fields and types
    if (
      !name || typeof name !== "string" ||
      !address || typeof address !== "string" ||
      !contact || typeof contact !== "string" ||
      !status || typeof status !== "string"
    ) {
      return res.status(400).json({ message: "Missing or invalid required fields" });
    }

    const newHousehold = {
      _id: householdId,
      name,
      address,
      contact,
      status,
      specialNeeds: typeof specialNeeds === "string" ? specialNeeds : "",
      _class: "com.thecroods.resitrack.models.Household",
    };

    console.log("Replacing household with data:", newHousehold);

    const result = await db.collection("households").replaceOne(
      { _id: householdId },
      newHousehold
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Household not found" });
    }

    res.json({ message: "Household replaced" });
  } catch (error) {
    console.error("Error replacing household:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE /api/households/:id - delete household with numeric _id
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const householdId = Number(req.params.id);

    if (isNaN(householdId)) {
      return res.status(400).json({ message: "Invalid household ID" });
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
