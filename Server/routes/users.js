const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getDB } = require("../db/mongo");
const { ObjectId } = require("mongodb");

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = getDB();

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const user = await db.collection("users").findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Save user info in session (avoid saving password)
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    res.json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// Check session route
router.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;
