const express = require("express")
const cors = require("cors")
const { ApolloServer } = require("@apollo/server")//server import kiya
const { expressMiddleware } = require("@as-integrations/express5")//middilware
const typeDefs = require("./schema/typeDefs")
const resolvers = require("./src/resolvers")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({
    name: "maknne",
    age: 10,
  })
})

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  await server.start()

  app.use(
    "/graphql",
    expressMiddleware(server)
  )

  return server
}

module.exports = {
  app,
  startServer,
}
