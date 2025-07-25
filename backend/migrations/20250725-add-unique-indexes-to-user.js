'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('User', ['name'], {
      unique: true,
      name: 'unique_name_index'
    });
    await queryInterface.addIndex('User', ['email'], {
      unique: true,
      name: 'unique_email_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('User', 'unique_name_index');
    await queryInterface.removeIndex('User', 'unique_email_index');
  }
};
