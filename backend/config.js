const { Sequelize } = require('sequelize');

module.exports = new Sequelize('groupamania', 'root', '@yesyes21', {
    host: 'localhost',
    dialect: 'mysql'
  });
