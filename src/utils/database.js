// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "nodejs-shopping",
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize");
const sequelize = new Sequelize("nodejs-shopping", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
