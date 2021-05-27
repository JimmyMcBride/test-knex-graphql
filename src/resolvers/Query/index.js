const db = require("../../data/knexConf");
const { ApolloError } = require("apollo-server-express");

const Query = {
  Query: {
    users() {
      return db("users");
    },
    user(_, { id }) {
      return db("users").where({ id }).first();
    },
    todos() {
      return db("todos");
    },
    async todo(_, { id }) {
      try {
        const todo = await db("todos").where({ id }).first();
        if (!todo)
          throw new ApolloError("A todo with that id could not be found. 🤷‍♂");
        return todo;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    async me(_, __, ctx) {
      try {
        if (!ctx.req.session.userId)
          throw new ApolloError(
            "You must be logged in to access current user information. 💀"
          );
        const me = await db("users")
          .where({ id: ctx.req.session.userId })
          .first();
        return me;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    myTodos(_, __, ctx) {
      return db("todos").where({ user_id: ctx.req.session.userId });
    },
  },
};

module.exports = Query;
