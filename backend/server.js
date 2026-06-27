// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
//  ENTRY POINT
//  - connects to MongoDB
//  - starts Apollo Server + Express
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

const mongoose = require("mongoose")
const { app, startServer } = require("./app")

const PORT = 4000
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/graphql_learning"

async function bootServer() {
  // ── 1. Connect to MongoDB ─────────────────
  //  mongoose.connect() returns a Promise
  //  Once resolved, all Model.save() / find() etc. will work
  try {
    await mongoose.connect(MONGO_URI)
    console.log("✓ Connected to MongoDB")
  } catch (err) {
    console.error("✗ MongoDB connection error:", err.message)
    process.exit(1)
  }

  // ── 2. Start Apollo Server ────────────────
  await startServer()

  // ── 3. Listen on port ─────────────────────
  app.listen(PORT, () => {
    console.log(`✓ Server ready at http://localhost:${PORT}/graphql`)
  })
}

bootServer().catch((err) => {
  console.error("Failed to boot server:", err)
  process.exit(1)
})
