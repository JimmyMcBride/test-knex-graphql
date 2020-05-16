const db = require("../../data/knexConf");
const { ValidationError, ApolloError } = require("apollo-server-express");
const bcrypt = require("bcryptjs");

const Mutation = {
  Mutation: {
    async login(_, { data }, ctx) {
      try {
        const { password, username } = data;
        const user = await db("users").where({ username }).first();
        console.log(user);

        if (!user)
          throw new ValidationError(
            "That username is not currently in the database. Try registering! 🚀"
          );

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          throw new ValidationError("Password is not valid. 💀");
        }

        ctx.req.session.userId = user.id;

        return user;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    async register(_, data, ctx) {
      try {
        if (data.username.length >= 4)
          throw new ValidationError(
            "Username must be more than 4 characters. 🙄"
          );

        if (data.password.length >= 6)
          throw new ValidationError(
            "Password must be more than 6 characters. 🙄"
          );

        const user = await db("users").insert(data).returning("*");

        if (!user) throw new ApolloError("Something went wrong... 🤕");

        console.log("User:", user, data.username);

        ctx.req.session.userId = user.id;

        return user;
      } catch (err) {
        console.log(err);
        return err;
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
    async addTodo(_, { data }, ctx) {
      try {
        const input = {
          ...data,
          user_id: ctx.req.session.userId,
        };
        const todo = await db("todos").insert(input).returning("*");

        if (!todo) throw new ApolloError("Something went wrong... 🤕");

        return todo[0];
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    async editTodo(_, { data }, ctx) {
      try {
        const input = {
          ...data,
          user_id: ctx.req.session.userId,
        };

        const todo = await db("todos")
          .where({ id: data.id })
          .update(input)
          .returning("*");

        console.log(todo);
        if (!todo) throw new "Something went wrong... 🤕"();

        return todo[0];
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    async deleteTodo(_, { id }) {
      return new Promise(async (res, rej) => {
        const deleteUser = await db("todos").where({ id }).del();
        if (!deleteUser) return rej(false);
        return res(true);
      });
    },
  },
};

module.exports = Mutation;
