const db = require('../config')
const Sequelize = require('sequelize');

const Conversation = db.define('Conversation', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    senderId: {
        type: Sequelize.DataTypes.INTEGER
    },
    receiverId: {
        type: Sequelize.DataTypes.INTEGER
    }
})

module.exports = Conversation;