// routes/households.js (or wherever you keep routes)
const express = require("express");
const router = express.Router();
const { getDB } = require("../db/mongo"); // your Mongo connection helper

router.post("/", async (req, res) => {
  try {
    const db = getDB();

    // Add default fields required by your model
    const householdData = {
      ...req.body,
      status: "unverified", // default status
      createdBy: "",        // empty as you requested
      _class: "com.thecroods.resitrack.models.Household",
    };

    const result = await db.collection("households").insertOne(householdData);

    res.status(201).json({ message: "Household created", id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create household" });
  }
});

module.exports = router;
