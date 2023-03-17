const Sequelize = require('sequelize');
const db = require('../config');
const User = require('./User')

const Follow = db.define('Follow', {
    following_user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
          }
    },
    followed_user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
          }
    }
})

User.belongsToMany(User, { through: Follow });

module.exports = Follow;