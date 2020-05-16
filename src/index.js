const {
  ApolloServer,
  // ApolloError,
  ValidationError,
} = require("apollo-server-express");
const express = require("express");
const session = require("express-session");
const connectRedis = require("connect-redis");
const db = require("./data/knexConf");
const app = express();
const redis = require("./redis.js");
const cors = require("cors");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

require("dotenv").config();

const port = process.env.PORT;

const RedisStore = connectRedis(session);

const sessionOptions = {
  store: new RedisStore({
    client: redis,
  }),
  name: "qid",
  secret: String(process.env.SECRET),
  resave: false,
  saveUninitialized: false,
};

// const resolvers = {
//   Todo: {
//     async user(parent) {
//       try {
//         const user = await db("users").where({ id: parent.user_id }).first();
//         if (!user) throw new ValidationError("User ID not found 🤷‍♂");
//         return user;
//       } catch (err) {
//         console.log(err);
//         return err;
//       }
//     },
//   },
// };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(session(sessionOptions));

server.applyMiddleware({ app, cors: false });

app.listen(port, () => {
  console.log(`💻 Server ready on http://localhost:${port}/graphql 🚀`);
});
