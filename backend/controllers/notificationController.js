const Notification = require('../models/Notification');
const User = require('../models/User')

exports.getByUser = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { receiverId: req.params.userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'profileImg'],
          required: false, // Prevent Sequelize from crashing on missing user
        },
      ],
    });

    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { receiverId: req.params.userId, isRead: false } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 