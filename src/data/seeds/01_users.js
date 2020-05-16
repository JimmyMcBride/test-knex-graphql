const bcrypt = require("bcrypt");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(async function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 1,
          username: "TestUser",
          password: await bcrypt.hash("password", 12),
        },
      ]);
    });
};
