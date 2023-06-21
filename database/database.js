const Sequelize = require('sequelize')

const connection = new Sequelize('logins', 'root', '18031988', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = connection;