const { DataTypes } = require('sequelize');
const db = require('../config');
const User = require('./User'); // Make sure this path is correct

const Notification = db.define('Notification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.ENUM('message', 'post', 'event', 'follow'), allowNull: false },
  text: { type: DataTypes.STRING, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  receiverId: { type: DataTypes.INTEGER, allowNull: false },
  senderId: { type: DataTypes.INTEGER, allowNull: true }
}, {
  timestamps: true
});

//  associations
Notification.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Notification.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

module.exports = Notification;
