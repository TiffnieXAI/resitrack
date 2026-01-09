const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getDB } = require("../db/mongo");

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // Validation
  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ 
      message: "Username, password, and confirmation required" 
    });
  }

  if (username.length < 3) {
    return res.status(400).json({ 
      message: "Username must be at least 3 characters" 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      message: "Password must be at least 6 characters" 
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ 
      message: "Passwords do not match" 
    });
  }

  try {
    const db = getDB();

    // Check for duplicate username (case-insensitive)
    const existingUser = await db.collection("users").findOne({ 
      username: { $regex: `^${username}$`, $options: "i" } 
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: "Username already exists" 
      });
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user document
    const newUser = {
      username: username.trim(),
      password: hashedPassword,
      role: "ROLE_USER",
      _class: "com.thecroods.resitrack.security.models.UserModel",
      createdAt: new Date().toISOString(),
    };

    // Insert into database
    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({
      message: "Registration successful",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// LOGIN
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

    // Store user in session (no password)
    const sessionUser = {
      id: user._id,
      username: user.username,
      role: user.role || "ROLE_USER",
    };

    req.session.user = sessionUser;

    res.json({
      message: "Login successful",
      user: sessionUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("resitrack.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// CHECK SESSION
router.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({
      loggedIn: true,
      user: req.session.user,
    });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;