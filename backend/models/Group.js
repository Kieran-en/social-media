const { DataTypes } = require('sequelize');
const db = require('../config');

const Group = db.define('Group', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  profileImg: {
    type: DataTypes.STRING,
    defaultValue: "http://localhost:3000/images/profile.png", // 🧼 petit nettoyage
  }
});

module.exports = Group;
