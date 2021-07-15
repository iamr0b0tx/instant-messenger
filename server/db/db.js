require('dotenv').config()
const Sequelize = require("sequelize");

let databaseUrl;
if(process.env.NODE_ENV === "test"){
  databaseUrl = process.env.TEST_DATABASE_URL || "postgres://postgres:postgres@localhost:5432/messenger_test";
}else{
  databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/messenger"
}

const db = new Sequelize(databaseUrl, {
  logging: false
});

module.exports = db;
