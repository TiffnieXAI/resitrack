const express = require("express")
const router = express.Router()
const { getDB } = require("../db/mongo")

// GET /api/households - get all households
router.get("/", async (req, res) => {
  try {
    const db = getDB()
    const households = await db.collection("households").find().toArray()
    res.json(households)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch households" })
  }
})

module.exports = router
