// hashPasswords.js
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./config.env" });

async function run() {
  const client = new MongoClient(process.env.ATLAS_URI);
  try {
    await client.connect();
    const db = client.db("resitrack"); // your DB name
    const users = db.collection("users");

    // Find users with plaintext passwords (you might add a check here if needed)
    const cursor = users.find();

    while (await cursor.hasNext()) {
      const user = await cursor.next();

      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
        const hashed = await bcrypt.hash(user.password, 10);
        await users.updateOne(
          { _id: user._id },
          { $set: { password: hashed } }
        );
        console.log(`Hashed password for user: ${user.username}`);
      }
    }

    console.log("Password hashing completed.");
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

run();
