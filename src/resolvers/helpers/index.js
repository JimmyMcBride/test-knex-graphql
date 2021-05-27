const db = require("../../data/knexConf");

const insert = (table, data) => db(table).insert(data).returning("*");

module.exports = {
  insert,
};
