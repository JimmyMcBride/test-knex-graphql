const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const session = require("express-session");

require("dotenv").config();

const app = express();
const db = require("./data/knexConf");
const connectRedis = require("connect-redis");
const redis = require("./redis.js");

const RedisStore = connectRedis(session);

const port = process.env.PORT;

const sessionOptions = {
  store: new RedisStore({
    client: redis,
  }),
  name: "qid",
  secret: String(process.env.SECRET),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
  },
};

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    admin: Boolean!
    blah: String!
  }
  type LoginResponse {
    status: Boolean!
    message: String!
  }
  type Query {
    users: [User]!
    user(id: ID!): User!
    me: User!
  }
  type Mutation {
    login(username: String!): LoginResponse!
    logout: Boolean!
    something: String!
  }
`;

const resolvers = {
  Query: {
    users(parent, args, ctx) {
      return db("users");
    },
    user(_, { id }) {
      return db("users").where({ id }).first();
    },
    me(_, __, ctx) {
      return db("users").where({ id: ctx.req.session.userId }).first();
    },
  },
  Mutation: {
    async login(_, { username }, ctx) {
      try {
        const user = await db("users").where({ username }).first();
        ctx.req.session.userId = user.id;
        console.log(ctx.req.session);
        return {
          status: true,
          message: `Welcome, ${user.username}! 🔥`,
        };
      } catch (err) {
        return {
          status: false,
          message: err.message,
        };
      }
    },
    async logout(_, __, ctx) {
      return new Promise((res, rej) =>
        ctx.req.session.destroy((err) => {
          if (err) {
            console.log("Logout error: ", err);
            return rej(false);
          }

          ctx.res.clearCookie("qid");
          return res(true);
        })
      );
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

app.use(session(sessionOptions));

server.applyMiddleware({ app });

app.listen(port, () =>
  console.log(`🖥 Server ready on http://localhost:${port}/grahql 🔥🚀`)
);
