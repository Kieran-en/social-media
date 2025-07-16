const { DataTypes } = require('sequelize');
const db = require('../config');
const User = require('./User');
const Group = require('./Group');

const GroupMember = db.define('GroupMember', {
  role: {
    type: DataTypes.ENUM('admin', 'member'),
    defaultValue: 'member'
  }
});

// Relations many-to-many
User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

module.exports = GroupMember;
