exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { id: 1, username: "billy bob", email: "email1@email.com" },
        { id: 2, username: "ricky bobby", email: "email2@email.com" },
        { id: 3, username: "bobby brown", email: "email3@email.com" },
      ]);
    });
};
