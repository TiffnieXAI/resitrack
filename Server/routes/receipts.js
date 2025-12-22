const express = require("express")
const router = express.Router()
const { getDB } = require("../db/mongo")

// GET all receipts
router.get("/", async (req, res) => {
    try {
        const db = getDB()
        const receipts = await db
            .collection("receipts")
            .find({})
            .toArray()

        res.json(receipts)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST new receipt
router.post("/", async (req, res) => {
    try {
        const db = getDB()
        const result = await db
            .collection("receipts")
            .insertOne(req.body)

        res.status(201).json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
