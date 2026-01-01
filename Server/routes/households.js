const express = require("express");
const router = express.Router();
const { getDB } = require("../db/mongo");
const { ObjectId } = require("mongodb");

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

// POST /api/households - create a new household
router.post("/", async (req, res) => {
  try {
    const db = getDB();

    const householdData = {
      ...req.body,
      status: "unverified",
      createdBy: "",
      _class: "com.thecroods.resitrack.models.Household",
    };

    const result = await db.collection("households").insertOne(householdData);

    res.status(201).json({ message: "Household created", id: result.insertedId });
  } catch (error) {
    console.error("Error creating household:", error);
    res.status(500).json({ error: "Failed to create household" });
  }
});

// PATCH /api/households/:id - partial update (e.g., update status)
router.patch("/:id", async (req, res) => {
  try {
    const db = getDB();
    const householdId = req.params.id;

    if (!ObjectId.isValid(householdId)) {
      return res.status(400).json({ message: "Invalid household ID" });
    }

    const updateFields = req.body;

    const result = await db.collection("households").updateOne(
      { _id: new ObjectId(householdId) },
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

// PUT /api/households/:id - full replace update
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const householdId = req.params.id;

    if (!ObjectId.isValid(householdId)) {
      return res.status(400).json({ message: "Invalid household ID" });
    }

    // Remove _id from req.body before replace
    const { _id, ...rest } = req.body;

    const newHousehold = {
      ...rest,
      _class: "com.thecroods.resitrack.models.Household",
    };

    console.log("Replacing household with data:", newHousehold);

    const result = await db.collection("households").replaceOne(
      { _id: new ObjectId(householdId) },
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


// DELETE /api/households/:id - delete household
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const householdId = req.params.id;

    if (!ObjectId.isValid(householdId)) {
      return res.status(400).json({ message: "Invalid household ID" });
    }

    const result = await db.collection("households").deleteOne({ _id: new ObjectId(householdId) });

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
