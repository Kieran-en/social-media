const Sequelize = require('sequelize');
const db = require('../config');
const Comment = require('./Comment');
const Post = require('./Post');
const Like = require('./Like');
const Message = require('./Message')
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

User.hasMany(Message, {onDelete: 'CASCADE'})

Message.belongsTo(User);

User.hasMany(Conversation, {onDelete: 'CASCADE',
foreignKey: 'senderId',
as: 'sender'
})

Conversation.belongsTo(User)



module.exports = User;



