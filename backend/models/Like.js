const Sequelize = require('sequelize');
const db = require('../config');

const Like = db.define('Like', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    like: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})



module.exports = Like;