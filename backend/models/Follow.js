const Sequelize = require('sequelize');
const db = require('../config');
const User = require('./User')

const Follow = db.define('Follow', {
    following_user_id: {
        type: Sequelize.INTEGER,
    },
    followed_user_id: {
        type: Sequelize.INTEGER,
    }
})

User.belongsToMany(User, { through: Follow });

module.exports = Follow;