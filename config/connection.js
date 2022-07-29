const Sequelize = require('sequelize');

require('dotenv').config();

console.log("presequel")
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host:'localhost',
    dialect:'mysql',
    port:3306    
});
console.log("postsequel")

module.exports = sequelize;