const { Sequelize } = require('sequelize');

module.exports = new Sequelize('groupamania', 'root', '@yesyes21', {
    host: '127.0.0.1',
    dialect: 'mysql'
  });
