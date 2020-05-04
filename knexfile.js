require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.RDS_HOSTNAME,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      port: process.env.RDS_PORT,
      database: "postgres",
    },
    migrations: {
      directory: "./src/data/migrations",
    },
    seeds: {
      directory: "./src/data/seeds",
    },
  },
};
