const Sequelize = require('sequelize');
const db = require('../config');
const User = require('./User')

const Follow = db.define('Follow', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
})

module.exports = Follow;