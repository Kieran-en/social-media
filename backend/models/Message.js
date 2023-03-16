const db = require('../config')
const Sequelize = require('sequelize');

const Message = db.define('Message', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    text: {
        type: Sequelize.DataTypes.STRING
    }
})

module.exports = Message;