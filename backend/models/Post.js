const Sequelize = require('sequelize');
const db = require('../config');
//const User = require('./User')
const Like = require('./Like');

const Post = db.define('Post', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    imageUrl: {
        type: Sequelize.STRING,
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    likes: {
        type: Sequelize.INTEGER,
    },
    dislikes: {
        type: Sequelize.INTEGER,
    },

})

Post.hasMany(Like, {
    onDelete: 'CASCADE'
});

Like.belongsTo(Post, {
    onDelete: 'CASCADE'
});

module.exports = Post;