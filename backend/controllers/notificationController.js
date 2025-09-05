const NotificationService = require('../services/notificationService');
const auth = require('../middlewares/auth');

// Récupérer les notifications d'un utilisateur
exports.getByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await NotificationService.getUserNotifications(userId);
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: err.message });
  }
};

// Marquer toutes les notifications comme lues
exports.markAllRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    await NotificationService.markAllAsRead(userId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking notifications as read:', err);
    res.status(500).json({ error: err.message });
  }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.auth.userId;
    
    await NotificationService.markAsRead(notificationId, userId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: err.message });
  }
};

// Compter les notifications non lues
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const count = await NotificationService.getUnreadCount(userId);
    res.json({ unreadCount: count });
  } catch (err) {
    console.error('Error getting unread count:', err);
    res.status(500).json({ error: err.message });
  }
};

// Créer une notification (pour les tests)
exports.createNotification = async (req, res) => {
  try {
    const { senderId, receiverId, type, text, postId, commentId, messageId, eventId } = req.body;
    
    const notification = await NotificationService.createNotification({
      senderId,
      receiverId,
      type,
      text,
      postId,
      commentId,
      messageId,
      eventId
    });
    
    res.status(201).json(notification);
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ error: err.message });
  }
}; 