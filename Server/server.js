const express = require("express")
const cors = require("cors")
require("dotenv").config({ path: "./config.env" })

const { connectDB } = require("./db/mongo")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use("/api/households", require("./routes/households"))

// Routes
app.use("/api/receipts", require("./routes/receipts"))

// Start server AFTER DB connects
connectDB(process.env.ATLAS_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch(err => {
        console.error("Failed to connect to DB", err)
        process.exit(1)
    })

app.get("/", (req, res) => {
  res.send("Welcome to the ResiTrack API backend!")
})