import http from './httpService';
import config from '../config.json';

const apiEndpoint = `${config.apiEndpoint}/groups`;

// Récupérer tous les groupes
export function getAllGroups() {
  return http.get(apiEndpoint);
}

// Créer un groupe (avec image)
export function createGroup(groupData) {
  return http.post(apiEndpoint, groupData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// Modifier un groupe
export function updateGroup(id, groupData) {
  return http.put(`${apiEndpoint}/${id}`, groupData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// Suspendre un groupe
export function suspendGroup(id) {
  return http.put(`${apiEndpoint}/${id}/suspend`);
}

export function reactivateGroup(id) {
  return http.put(`${apiEndpoint}/${id}/reactivate`);
}


// Supprimer un groupe
export function deleteGroup(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}

// Ajouter un membre au groupe
export function addMemberToGroup(data) {
  return http.post(`${apiEndpoint}/addMember`, data);
}

// Définir ou changer le leader d'un groupe
export function setGroupLeader(groupId, leaderId) {
  return http.put(`${apiEndpoint}/${groupId}/leader`, { leaderId });
}

// Récupérer un groupe par son ID avec toutes les informations détaillées
export function getGroup(groupId) {
  return http.get(`${apiEndpoint}/${groupId}`);
}

// Récupérer les posts d'un groupe spécifique
export function getGroupPosts(groupId, page = 1) {
  return http.get(`${apiEndpoint}/${groupId}/posts?page=${page}`);
}

// Récupérer les membres d'un groupe
export function getGroupMembers(groupId) {
  return http.get(`${apiEndpoint}/${groupId}/members`);
}

// Vérifier le statut de membership d'un utilisateur dans un groupe
export function getUserGroupMembership(groupId, userId) {
  return http.get(`${apiEndpoint}/${groupId}/membership/${userId}`);
}

// Rejoindre un groupe
export function joinGroup(groupId) {
  return http.post(`${apiEndpoint}/${groupId}/join`);
}

// Quitter un groupe
export function leaveGroup(groupId) {
  return http.post(`${apiEndpoint}/${groupId}/leave`);
}

// Suivre un groupe (pour recevoir les notifications)
export function followGroup(groupId) {
  return http.post(`${apiEndpoint}/${groupId}/follow`);
}

// Ne plus suivre un groupe
export function unfollowGroup(groupId) {
  return http.post(`${apiEndpoint}/${groupId}/unfollow`);
}

// Rechercher des groupes
export function searchGroups(query, page = 1, limit = 10) {
  return http.get(`${apiEndpoint}/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
}

// ========================= SERVICES POUR LES DEMANDES D'ADHÉSION =========================

// Demander à rejoindre un groupe
export function requestToJoinGroup(groupId, message = '') {
  return http.post(`${apiEndpoint}/${groupId}/request-join`, { message });
}

// Vérifier le statut de demande d'un utilisateur pour un groupe
export function getUserJoinRequestStatus(groupId) {
  return http.get(`${apiEndpoint}/${groupId}/join-request-status`);
}

// Récupérer les demandes d'adhésion pour un groupe (responsables seulement)
export function getGroupJoinRequests(groupId) {
  return http.get(`${apiEndpoint}/${groupId}/join-requests`);
}

// Traiter une demande d'adhésion (approuver/rejeter)
export function processJoinRequest(requestId, action, responseMessage = '') {
  return http.post(`${apiEndpoint}/join-requests/${requestId}/process`, {
    action,
    responseMessage
  });
}

// ========================= SERVICES POUR LES POSTS DE GROUPES =========================

// Créer un post au nom d'un groupe
export function createGroupPost(groupId, postData) {
  return http.post(`${apiEndpoint}/${groupId}/posts`, postData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
