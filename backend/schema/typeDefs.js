const typeDefs = `#graphql

  # ─────────────────────────────────────────────
  #  TYPE  → describes the shape of an object
  # ─────────────────────────────────────────────
  type User {
    id:    ID!      # !  =  non-nullable (always returns a value)
    name:  String!
    email: String!
    age:   Int!
  }

  # ─────────────────────────────────────────────
  #  INPUT  → like a Type but used for arguments
  # ─────────────────────────────────────────────
  input UserInput {
    name:  String!
    email: String!
    age:   Int!
  }

  # ─────────────────────────────────────────────
  #  QUERY  → entry-points for reading data (GET)
  # ─────────────────────────────────────────────
  type Query {
    message: String!        # simple health-check
    users:   [User]!        # get ALL users  (array can be empty, never null)
    user(id: ID!): User     # get ONE user   (returns null if not found)
  }

  # ─────────────────────────────────────────────
  #  MUTATION  → entry-points for changing data (POST/PUT/DELETE)
  # ─────────────────────────────────────────────
  type Mutation {
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): String
  }
`

module.exports = typeDefs
