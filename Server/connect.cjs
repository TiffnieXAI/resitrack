const { MongoClient } = require('mongodb')
require('dotenv').config({ path: './config.env' })

async function main() {
  const client = new MongoClient(process.env.ATLAS_URI)  // removed options

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db('resitrack')  // your database name
    const testCollection = db.collection('testCollection')

    // Insert a test document
    const result = await testCollection.insertOne({ test: 'Connection successful', date: new Date() })
    console.log('Inserted document with _id:', result.insertedId)

    // Fetch and print all documents in testCollection
    const docs = await testCollection.find().toArray()
    console.log('Documents in testCollection:', docs)

  } catch (error) {
    console.error('❌ Error connecting or inserting:', error)
  } finally {
    await client.close()
  }
}

main()
