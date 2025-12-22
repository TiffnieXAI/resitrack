const { MongoClient } = require('mongodb')
require("dotenv").config({ path: "./config.env" })

async function main() {
    console.log(JSON.stringify(process.env.ATLAS_URI))

    const client = new MongoClient(process.env.ATLAS_URI)

    try {
        await client.connect()
        console.log("Connected to MongoDB")

        const db = client.db("resitrack") // <-- FIX THIS NAME
        const collections = await db.collections()

        collections.forEach(c =>
            console.log(c.collectionName)
        )
    } catch (e) {
        console.error(e)
    } finally {
        await client.close()
    }
}

main().catch(console.error)
