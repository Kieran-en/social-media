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