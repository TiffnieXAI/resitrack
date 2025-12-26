const { MongoClient } = require("mongodb");

let db;

async function connectDB(uri) {
  if (db) return db;

  const client = new MongoClient(uri);
  await client.connect();

  console.log("MongoDB connected");
  db = client.db("resitrack");
  return db;
}

function getDB() {
  if (!db) throw new Error("Database not initialized");
  return db;
}

module.exports = { connectDB, getDB };
