const Sequelize = require('sequelize');
const db = require('../config');
const Comment = require('./Comment');
const Post = require('./Post');
const Like = require('./Like');
const Message = require('./Message')
const Follow = require('./Follow')
const Conversation = require('./Conversation')

const User = db.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    profileImg: { 
        type: Sequelize.STRING,
        defaultValue: " http://localhost:3000/images/profile.png",
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
    },
    followers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,

    },
    following: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    }

})

User.hasMany(Post, {
    onDelete: 'CASCADE'
});

Post.belongsTo(User);

User.hasMany(Comment, {
    onDelete: 'CASCADE'
});

Comment.belongsTo(User);

User.hasMany(Like, { onDelete: 'CASCADE'});

Like.belongsTo(User);

User.hasMany(Message, {foreignKey: 'senderId', onDelete: 'CASCADE'})

Message.belongsTo(User);

User.hasMany(Conversation, {onDelete: 'CASCADE',
foreignKey: 'senderId',
as: 'sender'
})

Conversation.belongsTo(User, {
    foreignKey: 'senderId'
})

User.belongsToMany(User, { as: 'following_user_id', through: Follow, foreignKey: 'following_user_id' });
User.belongsToMany(User, { as: 'followed_user_id', through: Follow, foreignKey: 'followed_user_id' });



module.exports = User;



