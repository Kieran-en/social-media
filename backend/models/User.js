const { DataTypes } = require('sequelize');
const db = require('../config');
const Comment = require('./Comment');
const Post = require('./Post');
const Like = require('./Like');
const Message = require('./Message');
const Follow = require('./Follow');
const Conversation = require('./Conversation');

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER, // ✅ remplacé Sequelize -> DataTypes
    primaryKey: true,
    autoIncrement: true,
  },
  profileImg: {
    type: DataTypes.STRING,
    defaultValue: "http://localhost:3000/images/profile.png", // 🧼 petit nettoyage
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  },
  password: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  following: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
});

// Relations
User.hasMany(Post, { onDelete: 'CASCADE' });
Post.belongsTo(User);

User.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(User);

User.hasMany(Like, { onDelete: 'CASCADE' });
Like.belongsTo(User);

User.hasMany(Message, { foreignKey: 'senderId', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'senderId' });

User.hasMany(Conversation, {
  foreignKey: 'senderId',
  as: 'sender',
  onDelete: 'CASCADE'
});
Conversation.belongsTo(User, { foreignKey: 'senderId' });

// Follow: User <-> User (many-to-many self association)
User.belongsToMany(User, {
  as: 'following_user_id',
  through: Follow,
  foreignKey: 'following_user_id'
});
User.belongsToMany(User, {
  as: 'followed_user_id',
  through: Follow,
  foreignKey: 'followed_user_id'
});

module.exports = User;
