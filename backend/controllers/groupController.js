const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const GroupJoinRequest = require('../models/GroupJoinRequest');
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
  console.log('📝 MODIFICATION DE GROUPE - Données reçues:', {
    groupId: req.params.id,
    body: req.body,
    leaderId: req.body.leaderId
  });
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

// Route de diagnostic pour voir tous les groupes et leurs leaders
async function debugAllGroups(req, res) {
  try {
    console.log('🔍 DIAGNOSTIC COMPLET DE TOUS LES GROUPES...');
    
    // Récupérer tous les groupes sans association
    const allGroups = await Group.findAll({
      attributes: ['id', 'name', 'leaderId'],
      order: [['name', 'ASC']]
    });
    
    console.log('📊 Groupes trouvés:', allGroups.length);
    
    // Pour chaque groupe, récupérer le leader manuellement
    const groupsWithLeaderInfo = await Promise.all(
      allGroups.map(async (group) => {
        let leaderInfo = null;
        if (group.leaderId) {
          leaderInfo = await User.findByPk(group.leaderId, {
            attributes: ['id', 'name', 'role']
          });
        }
        
        const result = {
          groupId: group.id,
          groupName: group.name,
          leaderId: group.leaderId,
          leaderFound: leaderInfo ? 'OUI' : 'NON',
          leaderName: leaderInfo ? leaderInfo.name : 'AUCUN',
          leaderRole: leaderInfo ? leaderInfo.role : 'N/A'
        };
        
        console.log(`  - ${group.name}: leaderId=${group.leaderId}, leader=${leaderInfo ? leaderInfo.name : 'AUCUN'}`);
        return result;
      })
    );
    
    res.json({
      message: 'Diagnostic complet des groupes',
      groups: groupsWithLeaderInfo
    });
  } catch (error) {
    console.error('❌ Erreur diagnostic:', error);
    res.status(500).json({ error: error.message });
  }
}

// Récupérer les groupes de l'utilisateur connecté (ou tous si admin)
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

    console.log('🔍 Groupe trouvé:', {
      id: group.id,
      name: group.name,
      leaderId: group.leaderId,
      leader: group.leader ? group.leader.name : 'Aucun leader',
      leaderData: group.leader ? {
        id: group.leader.id,
        name: group.leader.name,
        role: group.leader.role
      } : null
    });

    // Debug spécial pour le groupe GAL
    if (group.name === 'GAL') {
      console.log('🚨 DEBUG SPÉCIAL GAL:', {
        leaderId: group.leaderId,
        leaderTrouve: group.leader ? 'OUI' : 'NON',
        nomLeader: group.leader ? group.leader.name : 'AUCUN'
      });
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

// Fonction pour corriger le leader du groupe GAL
async function fixGroupLeader(req, res) {
  try {
    console.log('🔧 CORRECTION DU LEADER DU GROUPE GAL...');
    
    // Trouver le groupe GAL
    const group = await Group.findOne({ where: { name: 'GAL' } });
    if (!group) {
      return res.status(404).json({ message: 'Groupe GAL non trouvé' });
    }
    
    // Trouver un utilisateur avec le rôle responsable_groupe (qui n'est pas "EEC Melen")
    const newLeader = await User.findOne({
      where: { 
        role: 'responsable_groupe',
        name: { [Op.ne]: 'EEC Melen' }
      }
    });
    
    if (!newLeader) {
      return res.status(400).json({ message: 'Aucun responsable de groupe disponible' });
    }
    
    // Mettre à jour le leader
    await group.update({ leaderId: newLeader.id });
    
    console.log(`✅ Leader du groupe GAL mis à jour: ${newLeader.name} (ID: ${newLeader.id})`);
    
    res.json({
      message: `Leader du groupe GAL mis à jour avec succès`,
      oldLeaderId: group.leaderId,
      newLeader: {
        id: newLeader.id,
        name: newLeader.name,
        role: newLeader.role
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    res.status(500).json({ error: error.message });
  }
}

// Fonction utilitaire pour assigner des leaders manquants
async function assignMissingLeaders(req, res) {
  try {
    // Trouver tous les groupes sans leader
    const groupsWithoutLeader = await Group.findAll({
      where: { leaderId: null }
    });

    console.log(`🔧 Groupes sans leader trouvés: ${groupsWithoutLeader.length}`);

    // Trouver un responsable de groupe par défaut
    const defaultLeader = await User.findOne({
      where: { role: 'responsable_groupe' }
    });

    if (!defaultLeader) {
      return res.status(400).json({ 
        message: "Aucun utilisateur avec le rôle 'responsable_groupe' trouvé" 
      });
    }

    // Assigner le leader par défaut à tous les groupes sans leader
    const updatePromises = groupsWithoutLeader.map(group => {
      return group.update({ leaderId: defaultLeader.id });
    });

    await Promise.all(updatePromises);

    res.json({ 
      message: `${groupsWithoutLeader.length} groupes ont été assignés au leader ${defaultLeader.name}`,
      updatedGroups: groupsWithoutLeader.length,
      leader: defaultLeader.name
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'assignation des leaders:', error);
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

    // Ajouter les informations du leader et le nombre de membres
    const groupsWithDetails = await Promise.all(
      filteredGroups.map(async (group) => {
        try {
          // Récupérer le leader
          let leader = null;
          if (group.leaderId) {
            leader = await User.findByPk(group.leaderId, {
              attributes: ['id', 'name', 'profileImg']
            });
          }

          // Récupérer le nombre de membres
          const memberCount = await GroupMember.count({ where: { GroupId: group.id } });
          
          return {
            ...group.toJSON(),
            leader: leader ? leader.toJSON() : null,
            memberCount
          };
        } catch (detailError) {
          console.error('Erreur lors de la récupération des détails du groupe:', detailError);
          return {
            ...group.toJSON(),
            leader: null,
            memberCount: 0
          };
        }
      })
    );

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

// ========================= SYSTÈME DE DEMANDES D'ADHÉSION =========================

// Demander à rejoindre un groupe
async function requestToJoinGroup(req, res) {
  try {
    const { id: groupId } = req.params;
    const userId = req.auth.userId;
    const { message } = req.body;

    // Vérifier si le groupe existe et est actif
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé" });
    }
    if (!group.isActive) {
      return res.status(400).json({ message: "Ce groupe n'accepte plus de nouvelles demandes" });
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMember = await GroupMember.findOne({
      where: { UserId: userId, GroupId: groupId }
    });
    if (existingMember) {
      return res.status(400).json({ message: "Vous êtes déjà membre de ce groupe" });
    }

    // Vérifier si une demande existe déjà
    const existingRequest = await GroupJoinRequest.findOne({
      where: { UserId: userId, GroupId: groupId }
    });
    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return res.status(400).json({ message: "Vous avez déjà une demande en attente pour ce groupe" });
      }
      if (existingRequest.status === 'rejected') {
        return res.status(400).json({ message: "Votre demande précédente a été refusée. Contactez le responsable du groupe." });
      }
    }

    // Créer la demande
    const joinRequest = await GroupJoinRequest.create({
      UserId: userId,
      GroupId: groupId,
      message: message || null,
      status: 'pending'
    });

    console.log(`📨 Nouvelle demande d'adhésion: User ${userId} → Group ${groupId}`);

    res.status(201).json({
      message: "Votre demande d'adhésion a été envoyée avec succès",
      requestId: joinRequest.id
    });
  } catch (error) {
    console.error('❌ Erreur lors de la demande d\'adhésion:', error);
    res.status(500).json({ error: error.message });
  }
}

// Récupérer les demandes d'adhésion pour un groupe (responsables seulement)
async function getGroupJoinRequests(req, res) {
  try {
    const { id: groupId } = req.params;
    const userId = req.auth.userId;

    // Vérifier si l'utilisateur est responsable du groupe
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé" });
    }

    const userMember = await GroupMember.findOne({
      where: { UserId: userId, GroupId: groupId }
    });

    const isLeader = group.leaderId === userId;
    const isAdmin = userMember && userMember.role === 'admin';

    if (!isLeader && !isAdmin) {
      return res.status(403).json({ message: "Accès refusé. Seuls les responsables et administrateurs du groupe peuvent voir les demandes." });
    }

    // Récupérer les demandes
    const joinRequests = await GroupJoinRequest.findAll({
      where: { GroupId: groupId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'profileImg', 'email']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      groupName: group.name,
      totalRequests: joinRequests.length,
      pendingRequests: joinRequests.filter(r => r.status === 'pending').length,
      requests: joinRequests
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des demandes:', error);
    res.status(500).json({ error: error.message });
  }
}

// Traiter une demande d'adhésion (approuver/rejeter)
async function processJoinRequest(req, res) {
  try {
    const { requestId } = req.params;
    const { action, responseMessage } = req.body; // action: 'approve' ou 'reject'
    const reviewerId = req.auth.userId;

    // Récupérer la demande
    const joinRequest = await GroupJoinRequest.findByPk(requestId, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Group, as: 'group', attributes: ['id', 'name', 'leaderId'] }
      ]
    });

    if (!joinRequest) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    if (joinRequest.status !== 'pending') {
      return res.status(400).json({ message: "Cette demande a déjà été traitée" });
    }

    // Vérifier les permissions
    const userMember = await GroupMember.findOne({
      where: { UserId: reviewerId, GroupId: joinRequest.GroupId }
    });

    const isLeader = joinRequest.group.leaderId === reviewerId;
    const isAdmin = userMember && userMember.role === 'admin';

    if (!isLeader && !isAdmin) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Traiter la demande
    if (action === 'approve') {
      // Ajouter l'utilisateur au groupe
      await GroupMember.create({
        UserId: joinRequest.UserId,
        GroupId: joinRequest.GroupId,
        role: 'member'
      });

      // Mettre à jour la demande
      await joinRequest.update({
        status: 'approved',
        responseMessage: responseMessage || 'Demande approuvée',
        reviewedBy: reviewerId,
        reviewedAt: new Date()
      });

      console.log(`✅ Demande approuvée: ${joinRequest.user.name} rejoint ${joinRequest.group.name}`);

      res.json({
        message: `${joinRequest.user.name} a été ajouté(e) au groupe avec succès`,
        action: 'approved'
      });

    } else if (action === 'reject') {
      await joinRequest.update({
        status: 'rejected',
        responseMessage: responseMessage || 'Demande refusée',
        reviewedBy: reviewerId,
        reviewedAt: new Date()
      });

      console.log(`❌ Demande refusée: ${joinRequest.user.name} pour ${joinRequest.group.name}`);

      res.json({
        message: "Demande refusée",
        action: 'rejected'
      });

    } else {
      return res.status(400).json({ message: "Action invalide. Utilisez 'approve' ou 'reject'" });
    }

  } catch (error) {
    console.error('❌ Erreur lors du traitement de la demande:', error);
    res.status(500).json({ error: error.message });
  }
}

// Vérifier le statut de demande d'un utilisateur pour un groupe
async function getUserJoinRequestStatus(req, res) {
  try {
    const { id: groupId } = req.params;
    const userId = req.auth.userId;

    // Vérifier si déjà membre
    const existingMember = await GroupMember.findOne({
      where: { UserId: userId, GroupId: groupId }
    });

    if (existingMember) {
      return res.json({
        isMember: true,
        hasRequest: false,
        requestStatus: null
      });
    }

    // Vérifier s'il y a une demande
    const joinRequest = await GroupJoinRequest.findOne({
      where: { UserId: userId, GroupId: groupId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      isMember: false,
      hasRequest: !!joinRequest,
      requestStatus: joinRequest ? joinRequest.status : null,
      requestId: joinRequest ? joinRequest.id : null
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification du statut:', error);
    res.status(500).json({ error: error.message });
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
  assignMissingLeaders,
  fixGroupLeader,
  debugAllGroups,
  requestToJoinGroup,
  getGroupJoinRequests,
  processJoinRequest,
  getUserJoinRequestStatus,
};
