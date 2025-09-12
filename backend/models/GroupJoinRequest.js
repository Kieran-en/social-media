const { DataTypes } = require('sequelize');
const db = require('../config');
const User = require('./User');
const Group = require('./Group');

const GroupJoinRequest = db.define('GroupJoinRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  GroupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Message de motivation de l\'utilisateur'
  },
  responseMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Message de réponse du responsable'
  },
  reviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
    comment: 'ID du responsable qui a traité la demande'
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['UserId', 'GroupId'],
      name: 'unique_user_group_request'
    }
  ]
});

// Associations
GroupJoinRequest.belongsTo(User, { foreignKey: 'UserId', as: 'user' });
GroupJoinRequest.belongsTo(Group, { foreignKey: 'GroupId', as: 'group' });
GroupJoinRequest.belongsTo(User, { foreignKey: 'reviewedBy', as: 'reviewer' });

User.hasMany(GroupJoinRequest, { foreignKey: 'UserId', as: 'joinRequests' });
Group.hasMany(GroupJoinRequest, { foreignKey: 'GroupId', as: 'joinRequests' });

module.exports = GroupJoinRequest;
