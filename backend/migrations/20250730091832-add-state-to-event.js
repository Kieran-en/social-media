module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Vérifier si la colonne existe déjà
    const tableDescription = await queryInterface.describeTable('Events');
    if (!tableDescription.state) {
      return queryInterface.addColumn('Events', 'state', {
        type: Sequelize.STRING,
        defaultValue: 'OK',
        allowNull: false,
      });
    }
    // Si la colonne existe déjà, ne rien faire
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Events', 'state');
  }
};
