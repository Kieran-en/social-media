const { DataTypes } = require('sequelize');
const db = require('../config');
const User = require('./User');

const Group = db.define('Group', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  profileImg: {
    type: DataTypes.STRING,
    defaultValue: "http://localhost:3000/images/profile.png",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  leaderId: {
  type: DataTypes.INTEGER,
  allowNull: true, // Leader can be temporarily null
  references: {
    model: 'Users',
    key: 'id',
  },
  onDelete: 'SET NULL', // Keeps the group, removes leader reference
}
});

Group.belongsTo(User, { foreignKey: 'leaderId', as: 'leader' });
User.hasMany(Group, { foreignKey: 'leaderId', as: 'ledGroups' });


module.exports = Group;
