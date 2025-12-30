const express = require("express");
const router = express.Router();
const { getDB } = require("../db/mongo"); // your MongoDB connection helper

// POST /api/households - create a new household
router.post("/", async (req, res) => {
  try {
    const db = getDB();

    const householdData = {
      ...req.body,
      status: "unverified",           // default field
      createdBy: "",                  // empty for now
      _class: "com.thecroods.resitrack.models.Household", // your class identifier
    };

    const result = await db.collection("households").insertOne(householdData);

    res.status(201).json({ message: "Household created", id: result.insertedId });
  } catch (error) {
    console.error("Error creating household:", error);
    res.status(500).json({ error: "Failed to create household" });
  }
});

module.exports = router;
