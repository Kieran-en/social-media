const { DataTypes } = require('sequelize');
const db = require('../config');
const User = require('./User'); // Make sure this path is correct

const Notification = db.define('Notification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { 
    type: DataTypes.ENUM('message', 'post', 'comment', 'like', 'follow', 'event'), 
    allowNull: false 
  },
  text: { type: DataTypes.STRING, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  receiverId: { type: DataTypes.INTEGER, allowNull: false },
  senderId: { type: DataTypes.INTEGER, allowNull: true },
  // Champs optionnels pour lier la notification à un contenu spécifique
  postId: { type: DataTypes.INTEGER, allowNull: true },
  commentId: { type: DataTypes.INTEGER, allowNull: true },
  messageId: { type: DataTypes.INTEGER, allowNull: true },
  eventId: { type: DataTypes.INTEGER, allowNull: true }
}, {
  timestamps: true
});

//  associations
Notification.belongsTo(User, { 
  as: 'sender', 
  foreignKey: 'senderId',
  onDelete: 'CASCADE'
});
Notification.belongsTo(User, { 
  as: 'receiver', 
  foreignKey: 'receiverId',
  onDelete: 'CASCADE'
});

module.exports = Notification;
