'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Ajouter les nouvelles colonnes à la table Notifications
    await queryInterface.addColumn('Notifications', 'postId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Posts',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Notifications', 'commentId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Notifications', 'messageId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Messages',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Notifications', 'eventId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Events',
        key: 'id'
      }
    });

    // Mettre à jour l'ENUM pour inclure les nouveaux types
    await queryInterface.changeColumn('Notifications', 'type', {
      type: Sequelize.ENUM('message', 'post', 'comment', 'like', 'follow', 'event'),
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    // Supprimer les colonnes ajoutées
    await queryInterface.removeColumn('Notifications', 'postId');
    await queryInterface.removeColumn('Notifications', 'commentId');
    await queryInterface.removeColumn('Notifications', 'messageId');
    await queryInterface.removeColumn('Notifications', 'eventId');

    // Restaurer l'ENUM original
    await queryInterface.changeColumn('Notifications', 'type', {
      type: Sequelize.ENUM('message', 'post', 'event', 'follow'),
      allowNull: false
    });
  }
};
