const express = require("express")
const router = express.Router()
const { getDB } = require("../db/mongo")


router.post("/households", async (req, res) => {
  try {
    const household = await Household.create(req.body);
    res.status(201).json(household);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});