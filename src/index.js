const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");

const db = require("./data/knexConf");
const app = express();

require("dotenv").config();

const port = process.env.PORT;

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    admin: Boolean!
  }
  type Query {
    users: [User]!
    user(id: ID!): User!
  }
`;

const resolvers = {
  Query: {
    async users(parent, args, ctx) {
      return await db("users");
    },
    async user(_, { id }) {
      return await db("users").where({ id }).first();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.listen(port, () =>
  console.log(`🖥 Server ready on http://localhost:${port}/grahql 🔥🚀`)
);
