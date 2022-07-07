const db = require('../config')
const Sequelize = require('sequelize');
const Post = require('./Post');


const Comment = db.define('Comment', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },

    
})

Post.hasMany(Comment, {
    onDelete: 'CASCADE'
});

Comment.belongsTo(Post);

module.exports = Comment;