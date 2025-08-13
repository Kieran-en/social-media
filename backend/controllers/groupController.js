const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const User = require('../models/User');

// Créer un groupe
async function createGroup(req, res) {
  const { name, description } = req.body;
  try {
    const profileImg = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : undefined;
    const group = await Group.create({ name, description, profileImg, leaderId: req.auth.userId });
    await GroupMember.create({ GroupId: group.id, UserId: req.auth.userId, role: 'admin' });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Modifier un groupe
async function updateGroup(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const profileImg = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : undefined;

    const group = await Group.findByPk(id);
    if (!group) return res.status(404).json({ message: "Groupe non trouvé" });

    group.name = name || group.name;
    group.description = description || group.description;
    if (profileImg) group.profileImg = profileImg;

    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Suspendre un groupe
async function suspendGroup(req, res) {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id);
    if (!group) return res.status(404).json({ message: "Groupe non trouvé" });

    group.isActive = false;
    await group.save();
    res.json({ message: "Groupe suspendu" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function reactivateGroup(req, res) {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id);
    if (!group) return res.status(404).json({ message: "Groupe non trouvé" });

    group.isActive = true;
    await group.save();
    res.json({ message: "Groupe réactivé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// Supprimer un groupe
async function deleteGroup(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Group.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Groupe non trouvé" });

    res.json({ message: "Groupe supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Récupérer les groupes de l’utilisateur connecté (ou tous si admin)
async function getUserGroups(req, res) {
  try {
    const groups = await Group.findAll(); // Admin: retourne tout
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Définir un nouveau leader
async function setGroupLeader(req, res) {
  try {
    const { id } = req.params; // id du groupe
    const { leaderId } = req.body; // id du nouveau leader

    const group = await Group.findByPk(id);
    if (!group) return res.status(404).json({ message: "Groupe non trouvé" });

    const user = await User.findByPk(leaderId);
    if (!user) return res.status(404).json({ message: "Nouvel utilisateur non trouvé" });

    group.leaderId = leaderId;
    await group.save();

    res.json({ message: "Nouveau leader défini", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



module.exports = {
  createGroup,
  updateGroup,
  suspendGroup,
  deleteGroup,
  getUserGroups,
  reactivateGroup,
  setGroupLeader,
};
