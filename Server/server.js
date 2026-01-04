const express = require("express");
const cors = require("cors");
const session = require("express-session");
// Fix here: import default export for connect-mongo
const MongoStore = require("connect-mongo").default || require("connect-mongo");
require("dotenv").config({ path: "./config.env" });

const { connectDB } = require("./db/mongo");

const app = express();
const PORT = process.env.PORT || 5000;

/* =======================
   CORS (REQUIRED FOR SESSIONS)
======================= */
app.use(cors({
  origin: "http://localhost:5173", // React frontend
  credentials: true
}));

app.use(express.json());

/* =======================
   SESSION CONFIG
======================= */
app.use(session({
  name: "resitrack.sid", // cookie name
  secret: process.env.SESSION_SECRET || "resitrack_super_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.ATLAS_URI,
    collectionName: "sessions"
  }),
  cookie: {
    httpOnly: true,
    secure: false,        // MUST be false on localhost
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

/* =======================
   ROUTES
======================= */
app.use("/api/households", require("./routes/households"));
app.use("/api/incidents", require("./routes/incidents"));
app.use("/api/users", require("./routes/users")); // login/logout/me goes here

app.get("/", (req, res) => {
  res.send("Welcome to the ResiTrack API backend!");
});

/* =======================
   START SERVER AFTER DB
======================= */
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
