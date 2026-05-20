const { app, startServer } = require("./app")

const PORT = 4000

async function bootServer() {
  await startServer()

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
  })
}

bootServer().catch((error) => {
  console.error("Failed to start server", error)
  process.exit(1)
})
