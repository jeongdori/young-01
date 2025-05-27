const { Sequelize } = require('sequelize');
const dbConfig = require('@config/db');

const sequelize = new Sequelize(
    dbConfig.dbName,
    dbConfig.dbUser,
    dbConfig.dbPass,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: true,
    },
);

module.exports = sequelize;
