const express = require("express");
const router = express.Router();
const { getDB } = require("../db/mongo");

// GET /api/receipts - get all receipts
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const receipts = await db.collection("receipts").find().toArray();
    res.json(receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;