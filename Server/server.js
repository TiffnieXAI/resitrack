const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
require("dotenv").config({ path: "./config.env" });
const { connectDB } = require("./db/mongo");

const app = express();
const PORT = process.env.PORT || 5000;

/* ========== CORS ========== */

// IMPORTANT: Make sure this matches exactly the frontend origin you use
const FRONTEND_ORIGIN = "http://localhost:5173";  // <-- use localhost if your frontend is at localhost:5173

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));

app.use(express.json());

/* ========== SESSION SETUP ========== */

app.use(session({
  name: "resitrack.sid",
  secret: process.env.SESSION_SECRET || "resitrack_super_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.ATLAS_URI,
    collectionName: "sessions"
  }),
  cookie: {
    httpOnly: true,
    secure: false,  // false for localhost http (true if using https in production)
    sameSite: "lax", // 'lax' is usually good for session cookies and frontend-backend on different ports
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

/* ========== ROUTES ========== */
app.use("/api/households", require("./routes/households"));
app.use("/api/incidents", require("./routes/incidents"));
app.use("/api/users", require("./routes/users"));
app.use("/api/incidents", require("./routes/incidents"));


app.get("/", (req, res) => {
  res.send("Welcome to the ResiTrack API backend!");
});

/* ========== START SERVER ========== */
connectDB(process.env.ATLAS_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to connect to DB", err);
    process.exit(1);
  });
