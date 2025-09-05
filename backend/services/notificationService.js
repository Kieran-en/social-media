const Notification = require('../models/Notification');
const User = require('../models/User');
const { getIo } = require('../socket');

class NotificationService {
  // Créer une notification
  static async createNotification({ senderId, receiverId, type, text, postId = null, commentId = null, messageId = null, eventId = null }) {
    try {
      // Ne pas créer de notification si l'utilisateur s'envoie une notification à lui-même
      if (senderId === receiverId) {
        return null;
      }

      const notification = await Notification.create({
        senderId,
        receiverId,
        type,
        text,
        postId,
        commentId,
        messageId,
        eventId,
        isRead: false
      });

      // Récupérer la notification avec les informations de l'expéditeur
      const notificationWithSender = await Notification.findByPk(notification.id, {
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name', 'profileImg']
          }
        ]
      });

      // Envoyer la notification en temps réel via Socket.io
      const io = getIo();
      if (io) {
        io.to(receiverId.toString()).emit('newNotification', notificationWithSender);
      }

      console.log(`📢 Notification créée: ${type} - ${text}`);
      return notificationWithSender;

    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      throw error;
    }
  }

  // Notifications pour les nouvelles publications
  static async notifyNewPost(postId, authorId) {
    try {
      // Récupérer tous les utilisateurs qui suivent l'auteur
      const followers = await User.findAll({
        include: [{
          model: User,
          as: 'following_user_id',
          where: { id: authorId },
          through: { attributes: [] }
        }]
      });

      // Créer une notification pour chaque follower
      const notifications = [];
      for (const follower of followers) {
        const notification = await this.createNotification({
          senderId: authorId,
          receiverId: follower.id,
          type: 'post',
          text: `${follower.name} a publié un nouveau post`,
          postId: postId
        });
        if (notification) notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      console.error('Erreur lors de la notification de nouveau post:', error);
    }
  }

  // Notifications pour les commentaires
  static async notifyComment(commentId, postId, commenterId, postAuthorId) {
    try {
      // Notifier l'auteur du post (sauf si c'est le même que le commentateur)
      if (commenterId !== postAuthorId) {
        await this.createNotification({
          senderId: commenterId,
          receiverId: postAuthorId,
          type: 'comment',
          text: `${commenterId} a commenté votre post`,
          postId: postId,
          commentId: commentId
        });
      }

      // Notifier les autres utilisateurs qui ont commenté le même post
      const otherCommenters = await User.findAll({
        include: [{
          model: Comment,
          where: { postId: postId, userId: { [Op.ne]: commenterId } },
          through: { attributes: [] }
        }]
      });

      for (const commenter of otherCommenters) {
        if (commenter.id !== postAuthorId && commenter.id !== commenterId) {
          await this.createNotification({
            senderId: commenterId,
            receiverId: commenter.id,
            type: 'comment',
            text: `${commenterId} a aussi commenté ce post`,
            postId: postId,
            commentId: commentId
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la notification de commentaire:', error);
    }
  }

  // Notifications pour les likes
  static async notifyLike(postId, likerId, postAuthorId) {
    try {
      // Notifier l'auteur du post (sauf si c'est le même que celui qui like)
      if (likerId !== postAuthorId) {
        await this.createNotification({
          senderId: likerId,
          receiverId: postAuthorId,
          type: 'like',
          text: `${likerId} a aimé votre post`,
          postId: postId
        });
      }
    } catch (error) {
      console.error('Erreur lors de la notification de like:', error);
    }
  }

  // Notifications pour les follows
  static async notifyFollow(followerId, followedId) {
    try {
      await this.createNotification({
        senderId: followerId,
        receiverId: followedId,
        type: 'follow',
        text: `${followerId} vous suit maintenant`
      });
    } catch (error) {
      console.error('Erreur lors de la notification de follow:', error);
    }
  }

  // Notifications pour les messages
  static async notifyMessage(messageId, senderId, receiverId) {
    try {
      await this.createNotification({
        senderId: senderId,
        receiverId: receiverId,
        type: 'message',
        text: `${senderId} vous a envoyé un message`,
        messageId: messageId
      });
    } catch (error) {
      console.error('Erreur lors de la notification de message:', error);
    }
  }

  // Récupérer les notifications d'un utilisateur
  static async getUserNotifications(userId, limit = 50) {
    try {
      return await Notification.findAll({
        where: { receiverId: userId },
        order: [['createdAt', 'DESC']],
        limit: limit,
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name', 'profileImg']
          }
        ]
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  // Marquer une notification comme lue
  static async markAsRead(notificationId, userId) {
    try {
      return await Notification.update(
        { isRead: true },
        { where: { id: notificationId, receiverId: userId } }
      );
    } catch (error) {
      console.error('Erreur lors du marquage de notification comme lue:', error);
      throw error;
    }
  }

  // Marquer toutes les notifications comme lues
  static async markAllAsRead(userId) {
    try {
      return await Notification.update(
        { isRead: true },
        { where: { receiverId: userId, isRead: false } }
      );
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      throw error;
    }
  }

  // Compter les notifications non lues
  static async getUnreadCount(userId) {
    try {
      return await Notification.count({
        where: { receiverId: userId, isRead: false }
      });
    } catch (error) {
      console.error('Erreur lors du comptage des notifications non lues:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;
