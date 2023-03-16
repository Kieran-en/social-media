const db = require('../config')
const Sequelize = require('sequelize');
const Message = require('./Message')

const Conversation = db.define('Conversation', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    receiverId: {
        type: Sequelize.DataTypes.INTEGER
    }
})

Conversation.hasMany(Message, {
    onDelete: 'CASCADE'
})

Message.belongsTo(Conversation)

module.exports = Conversation;