const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const User = require('../models/User');
const Post = require('../models/Post');
const { Op } = require('sequelize');

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



// Récupérer un groupe par son ID avec toutes les informations
async function getGroupById(req, res) {
  try {
    const { id } = req.params;
    
    const group = await Group.findByPk(id, {
      include: [
        {
          model: User,
          as: 'leader',
          attributes: ['id', 'name', 'profileImg']
        }
      ]
    });
    
    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé" });
    }

    // Compter les membres
    const memberCount = await GroupMember.count({ where: { GroupId: id } });
    
    // Compter les posts (si vous avez un modèle Post lié aux groupes)
    // const postCount = await Post.count({ where: { GroupId: id } });
    const postCount = 0; // Temporaire
    
    const groupData = {
      ...group.toJSON(),
      memberCount,
      postCount
    };

    res.json(groupData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Récupérer les posts d'un groupe
async function getGroupPosts(req, res) {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Vérifier si le groupe existe
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé" });
    }

    // TODO: Récupérer les posts du groupe
    // Pour l'instant, retourner une liste vide
    const posts = [];
    const totalPosts = 0;
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Récupérer les membres d'un groupe
async function getGroupMembers(req, res) {
  try {
    const { id } = req.params;
    
    const members = await GroupMember.findAll({
      where: { GroupId: id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'profileImg', 'email']
        }
      ]
    });

    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Vérifier le membership d'un utilisateur dans un groupe
async function getUserGroupMembership(req, res) {
  try {
    const { id: groupId, userId } = req.params;
    
    const membership = await GroupMember.findOne({
      where: { 
        GroupId: groupId, 
        UserId: userId 
      }
    });

    const group = await Group.findByPk(groupId);
    
    res.json({
      isGroupMember: !!membership,
      isGroupAdmin: membership?.role === 'admin' || group?.leaderId === parseInt(userId),
      role: membership?.role || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Rejoindre un groupe
async function joinGroup(req, res) {
  try {
    const { id: groupId } = req.params;
    const userId = req.auth.userId;

    // Vérifier si l'utilisateur est déjà membre
    const existingMembership = await GroupMember.findOne({
      where: { GroupId: groupId, UserId: userId }
    });

    if (existingMembership) {
      return res.status(400).json({ message: "Vous êtes déjà membre de ce groupe" });
    }

    // Ajouter l'utilisateur au groupe
    await GroupMember.create({
      GroupId: groupId,
      UserId: userId,
      role: 'member'
    });

    res.json({ message: "Vous avez rejoint le groupe avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Quitter un groupe
async function leaveGroup(req, res) {
  try {
    const { id: groupId } = req.params;
    const userId = req.auth.userId;

    // Vérifier si l'utilisateur est membre
    const membership = await GroupMember.findOne({
      where: { GroupId: groupId, UserId: userId }
    });

    if (!membership) {
      return res.status(400).json({ message: "Vous n'êtes pas membre de ce groupe" });
    }

    // Vérifier si l'utilisateur est le leader
    const group = await Group.findByPk(groupId);
    if (group.leaderId === userId) {
      return res.status(400).json({ 
        message: "Le leader ne peut pas quitter le groupe. Transférez d'abord le leadership." 
      });
    }

    // Supprimer le membership
    await membership.destroy();

    res.json({ message: "Vous avez quitté le groupe" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Suivre un groupe (pour les notifications)
async function followGroup(req, res) {
  try {
    const { id: groupId } = req.params;
    const userId = req.auth.userId;

    // TODO: Implémenter le système de suivi des groupes
    // Pour l'instant, retourner un succès
    res.json({ message: "Vous suivez maintenant ce groupe" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Ne plus suivre un groupe
async function unfollowGroup(req, res) {
  try {
    const { id: groupId } = req.params;
    const userId = req.auth.userId;

    // TODO: Implémenter le système de suivi des groupes
    // Pour l'instant, retourner un succès
    res.json({ message: "Vous ne suivez plus ce groupe" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Rechercher des groupes
async function searchGroups(req, res) {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    console.log('🔍 Recherche de groupes avec query:', query);

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: "La requête de recherche doit contenir au moins 2 caractères" });
    }

    // Version simplifiée pour diagnostiquer le problème
    const whereClause = {
      name: {
        [Op.like]: `%${query.trim()}%`
      },
      isActive: true
    };

    console.log('🔍 WhereClause simplifié:', JSON.stringify(whereClause, null, 2));

    // Test simple : récupérer tous les groupes actifs d'abord
    const { count, rows: groups } = await Group.findAndCountAll({
      where: { isActive: true },
      limit: parseInt(limit),
      offset: offset,
      order: [['name', 'ASC']]
    });

    console.log('📊 Groupes actifs trouvés:', count);

    // Filtrer côté JavaScript pour l'instant
    const filteredGroups = groups.filter(group => 
      group.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(query.trim().toLowerCase()))
    );

    console.log('📊 Groupes filtrés:', filteredGroups.length);

    // Version simplifiée des détails
    const groupsWithDetails = filteredGroups.map(group => ({
      ...group.toJSON(),
      leader: null, // Temporairement désactivé pour tester
      memberCount: 0 // Temporairement désactivé pour tester
    }));

    const totalPages = Math.ceil(filteredGroups.length / parseInt(limit));

    res.json({
      groups: groupsWithDetails,
      totalGroups: filteredGroups.length,
      currentPage: parseInt(page),
      totalPages,
      hasMore: parseInt(page) < totalPages
    });
  } catch (error) {
    console.error('❌ Erreur lors de la recherche de groupes:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      error: 'Erreur lors de la recherche de groupes',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
  getGroupById,
  getGroupPosts,
  getGroupMembers,
  getUserGroupMembership,
  joinGroup,
  leaveGroup,
  followGroup,
  unfollowGroup,
  searchGroups,
};
