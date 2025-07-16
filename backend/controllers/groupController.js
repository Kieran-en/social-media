const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
  const { name, description } = req.body;
  try {
    const group = await Group.create({ name, description });
    await GroupMember.create({ GroupId: group.id, UserId: req.auth.userId, role: 'admin' });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const user = await User.findByPk(req.auth.userId, {
      include: {
        model: Group,
      }
    });
    res.status(200).json(user.Groups);
  } catch (error) {
    res.status(500).json({ error });
  }
};
