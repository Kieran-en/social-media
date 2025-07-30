module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Events', 'state', {
      type: Sequelize.STRING,
      defaultValue: 'OK',
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Events', 'state');
  }
};
