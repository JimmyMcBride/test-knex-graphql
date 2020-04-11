exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { id: 1, username: "rowValue1", email: "email1@email.com" },
        { id: 2, username: "rowValue2", email: "email2@email.com" },
        { id: 3, username: "rowValue3", email: "email3@email.com" },
      ]);
    });
};
