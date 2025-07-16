const { DataTypes } = require('sequelize');
const db = require('../config');
const User = require('./User');
const Group = require('./Group');

const GroupMessage = db.define('GroupMessage', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Relations
User.hasMany(GroupMessage, { foreignKey: 'senderId' });
GroupMessage.belongsTo(User, { foreignKey: 'senderId' });

Group.hasMany(GroupMessage, { foreignKey: 'groupId' });
GroupMessage.belongsTo(Group, { foreignKey: 'groupId' });

module.exports = GroupMessage;
