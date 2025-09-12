const Sequelize = require('sequelize');
const db = require('../config');
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
    UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        comment: 'Utilisateur qui a créé le post'
    },
    GroupId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Groups',
            key: 'id',
        },
        comment: 'Groupe au nom duquel le post est publié (optionnel)'
    },
    isGroupPost: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Indique si le post est publié au nom d\'un groupe'
    }

})

Post.hasMany(Like, {
    onDelete: 'CASCADE'
});

Like.belongsTo(Post);

// Les associations seront définies dans les modèles User et Group pour éviter les imports circulaires

module.exports = Post;