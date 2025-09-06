'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Supprimer les contraintes de clés étrangères existantes
    await queryInterface.removeConstraint('Posts', 'Posts_UserId_fkey');
    await queryInterface.removeConstraint('Comments', 'Comments_UserId_fkey');
    await queryInterface.removeConstraint('Likes', 'Likes_UserId_fkey');
    await queryInterface.removeConstraint('Messages', 'Messages_senderId_fkey');
    await queryInterface.removeConstraint('Conversations', 'Conversations_senderId_fkey');
    await queryInterface.removeConstraint('Conversations', 'Conversations_receiverId_fkey');
    await queryInterface.removeConstraint('Notifications', 'Notifications_senderId_fkey');
    await queryInterface.removeConstraint('Notifications', 'Notifications_receiverId_fkey');
    await queryInterface.removeConstraint('GroupMessages', 'GroupMessages_senderId_fkey');
    await queryInterface.removeConstraint('GroupMembers', 'GroupMembers_UserId_fkey');
    await queryInterface.removeConstraint('Follows', 'Follows_following_user_id_fkey');
    await queryInterface.removeConstraint('Follows', 'Follows_followed_user_id_fkey');

    // Recréer les contraintes avec CASCADE
    await queryInterface.addConstraint('Posts', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'Posts_UserId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Comments', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'Comments_UserId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Likes', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'Likes_UserId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Messages', {
      fields: ['senderId'],
      type: 'foreign key',
      name: 'Messages_senderId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Conversations', {
      fields: ['senderId'],
      type: 'foreign key',
      name: 'Conversations_senderId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Conversations', {
      fields: ['receiverId'],
      type: 'foreign key',
      name: 'Conversations_receiverId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Notifications', {
      fields: ['senderId'],
      type: 'foreign key',
      name: 'Notifications_senderId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Notifications', {
      fields: ['receiverId'],
      type: 'foreign key',
      name: 'Notifications_receiverId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('GroupMessages', {
      fields: ['senderId'],
      type: 'foreign key',
      name: 'GroupMessages_senderId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('GroupMembers', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'GroupMembers_UserId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Follows', {
      fields: ['following_user_id'],
      type: 'foreign key',
      name: 'Follows_following_user_id_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Follows', {
      fields: ['followed_user_id'],
      type: 'foreign key',
      name: 'Follows_followed_user_id_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    // Supprimer les contraintes CASCADE
    await queryInterface.removeConstraint('Posts', 'Posts_UserId_fkey');
    await queryInterface.removeConstraint('Comments', 'Comments_UserId_fkey');
    await queryInterface.removeConstraint('Likes', 'Likes_UserId_fkey');
    await queryInterface.removeConstraint('Messages', 'Messages_senderId_fkey');
    await queryInterface.removeConstraint('Conversations', 'Conversations_senderId_fkey');
    await queryInterface.removeConstraint('Conversations', 'Conversations_receiverId_fkey');
    await queryInterface.removeConstraint('Notifications', 'Notifications_senderId_fkey');
    await queryInterface.removeConstraint('Notifications', 'Notifications_receiverId_fkey');
    await queryInterface.removeConstraint('GroupMessages', 'GroupMessages_senderId_fkey');
    await queryInterface.removeConstraint('GroupMembers', 'GroupMembers_UserId_fkey');
    await queryInterface.removeConstraint('Follows', 'Follows_following_user_id_fkey');
    await queryInterface.removeConstraint('Follows', 'Follows_followed_user_id_fkey');

    // Recréer les contraintes sans CASCADE (comportement original)
    await queryInterface.addConstraint('Posts', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'Posts_UserId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Comments', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'Comments_UserId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Likes', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'Likes_UserId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Messages', {
      fields: ['senderId'],
      type: 'foreign key',
      name: 'Messages_senderId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Conversations', {
      fields: ['senderId'],
      type: 'foreign key',
      name: 'Conversations_senderId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Conversations', {
      fields: ['receiverId'],
      type: 'foreign key',
      name: 'Conversations_receiverId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Notifications', {
      fields: ['senderId'],
      type: 'foreign key',
      name: 'Notifications_senderId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Notifications', {
      fields: ['receiverId'],
      type: 'foreign key',
      name: 'Notifications_receiverId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('GroupMessages', {
      fields: ['senderId'],
      type: 'foreign key',
      name: 'GroupMessages_senderId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('GroupMembers', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'GroupMembers_UserId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Follows', {
      fields: ['following_user_id'],
      type: 'foreign key',
      name: 'Follows_following_user_id_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Follows', {
      fields: ['followed_user_id'],
      type: 'foreign key',
      name: 'Follows_followed_user_id_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });
  }
};
