const GroupMessage = require('../models/GroupMessage');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  const { groupId, content } = req.body;
  try {
    const message = await GroupMessage.create({
      senderId: req.auth.userId,
      groupId,
      content
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const messages = await GroupMessage.findAll({
      where: { groupId: req.params.groupId },
      include: { model: User, attributes: ['id', 'name', 'profileImg'] },
      order: [['createdAt', 'ASC']]
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error });
  }
};
