const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const GroupMessage = require('../models/GroupMessage');
const User = require('../models/User');

// Fetch group profile (details)
router.get('/:groupId', auth, async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// Check if user is a member
router.get('/:groupId/isMember', auth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const isMember = await GroupMember.findOne({
      where: { GroupId: req.params.groupId, UserId: userId }
    });
    res.json({ isMember: !!isMember });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check membership' });
  }
});

// Join group
router.post('/:groupId/join', auth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const groupId = req.params.groupId;

    const [membership, created] = await GroupMember.findOrCreate({
      where: { GroupId: groupId, UserId: userId },
      defaults: { role: 'member' }
    });
    if (!created) return res.status(400).json({ message: 'Already a member' });
    res.json({ message: 'Joined group successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// Leave group
router.delete('/:groupId/leave', auth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const groupId = req.params.groupId;

    const rows = await GroupMember.destroy({
      where: { GroupId: groupId, UserId: userId }
    });
    if (!rows) return res.status(400).json({ message: 'Not a member' });
    res.json({ message: 'Left group successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to leave group' });
  }
});

// Fetch last 50 messages for group
router.get('/:groupId/messages', auth, async (req, res) => {
  try {
    const messages = await GroupMessage.findAll({
      where: { GroupId: req.params.groupId },
      order: [['createdAt', 'ASC']],
      limit: 50,
      include: [{ model: User, attributes: ['id', 'name', 'profileImg'] }]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// --- NEW: Promote or change role (only admin) ---
router.put('/:groupId/members/:userId/role', auth, async (req, res) => {
  try {
    if (req.auth.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const { groupId, userId } = req.params;
    const { role } = req.body;

    const membership = await GroupMember.findOne({ where: { GroupId: groupId, UserId: userId } });
    if (!membership) {
      return res.status(404).json({ error: 'User not a member of this group' });
    }

    membership.role = role;
    await membership.save();

    res.json({ message: `User role updated to ${role}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

module.exports = router;
