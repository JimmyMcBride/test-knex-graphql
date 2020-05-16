exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("todos")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("todos").insert([
        {
          id: 1,
          name: "Learn Graphql",
          description: "GraphQL is the future, so I really need to learn it.",
          user_id: 1,
        },
      ]);
    });
};
