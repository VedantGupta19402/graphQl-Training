// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
//  RESOLVERS
//  ─────────
//  Resolvers are the FUNCTIONS that actually FETCH or CHANGE data.
//  When a client sends a GraphQL query/mutation, Apollo calls the
//  matching resolver function to produce the result.
//
//  Every resolver receives 4 arguments:
//    1. parent      → result from the PREVIOUS resolver (for nested types)
//    2. args        → arguments passed by the client
//    3. context     → shared data (DB, auth user, etc.) — set up in server.js
//    4. info        → query AST (rarely used)
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

const User = require("../models/User") // Mongoose model → talks to MongoDB

const resolvers = {

  // ══════════════════════════════════════════════
  //  QUERIES  (read-only operations)
  // ══════════════════════════════════════════════

  Query: {

    // ── message ──────────────────────────────
    //  Simple resolver — no args, no DB, just a string.
    //  Good for checking if the server is alive.
    message: () => "GraphQL Server Running ✔",

    // ── users ────────────────────────────────
    //  Fetches ALL users from MongoDB.
    //  "async" because DB calls return a Promise.
    //  "await" pauses until the DB responds.
    users: async () => {
      try {
        // User.find()   → get every document in the "users" collection
        // .populate()   → if there were references to other collections
        const allUsers = await User.find({})
        return allUsers  // return array → GraphQL formats it as [User]!
      } catch (err) {
        // Always handle errors so the client gets a clear message
        throw new Error("Failed to fetch users: " + err.message)
      }
    },

    // ── user(id) ─────────────────────────────
    //  Fetches ONE user by its MongoDB _id.
    //  args.id  → comes from the GraphQL query: user(id: "abc123")
    user: async (parent, args) => {
      try {
        const found = await User.findById(args.id)
        return found  // null if not found → GraphQL allows this (no !)
      } catch (err) {
        throw new Error("Failed to fetch user: " + err.message)
      }
    },

  },

  // ══════════════════════════════════════════════
  //  MUTATIONS  (create / update / delete)
  // ══════════════════════════════════════════════

  Mutation: {

    // ── createUser ───────────────────────────
    //  Creates a new user in the DB.
    //  args.input  → matches "input: UserInput!" in the schema
    createUser: async (parent, args) => {
      try {
        // args.input = { name: "...", email: "...", age: ... }
        const newUser = new User({
          name:  args.input.name,
          email: args.input.email,
          age:   args.input.age,
        })

        // .save() actually writes to MongoDB
        const saved = await newUser.save()
        return saved  // return the saved doc → client gets it back
      } catch (err) {
        throw new Error("Failed to create user: " + err.message)
      }
    },

    // ── updateUser ───────────────────────────
    //  Finds a user by ID and updates their fields.
    //  { new: true }  → return the UPDATED document (not the old one)
    updateUser: async (parent, args) => {
      try {
        const updated = await User.findByIdAndUpdate(
          args.id,
          {
            name:  args.input.name,
            email: args.input.email,
            age:   args.input.age,
          },
          { new: true } // ← IMPORTANT: without this you get the OLD data
        )
        return updated // null if ID doesn't exist
      } catch (err) {
        throw new Error("Failed to update user: " + err.message)
      }
    },

    // ── deleteUser ───────────────────────────
    //  Deletes a user and returns a simple success message.
    deleteUser: async (parent, args) => {
      try {
        const deleted = await User.findByIdAndDelete(args.id)

        if (!deleted) {
          throw new Error("User not found")
        }

        return `User "${deleted.name}" was deleted successfully`
      } catch (err) {
        throw new Error("Failed to delete user: " + err.message)
      }
    },

  },

  // ══════════════════════════════════════════════
  //  TYPE-SPECIFIC RESOLVERS (field-level)
  // ══════════════════════════════════════════════
  //
  //  These let you customise how individual fields resolve.
  //  The "parent" argument holds the object returned by the
  //  Query/Mutation resolver above.
  //
  //  If you DON'T write a field resolver, GraphQL looks for
  //  a property with the SAME name on the parent object.
  //
  //  Example — transform "id" to always be a string:
  //
  // User: {
  //   id: (parent) => parent._id.toString(),
  //   fullName: (parent) => `${parent.name} (${parent.email})`,
  // },
  //
  //  NOTE: _id is MongoDB's internal ID (ObjectId).
  //  GraphQL expects "id" (from the schema), but Mongoose returns "_id".
  //  Apollo auto-resolves _id → id, but you can override it here.
  User: {
    id: (parent) => parent._id.toString(),
  },

}

module.exports = resolvers
