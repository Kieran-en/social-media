import http from './httpService';
import config from '../config.json';

const apiEndpoint = `${config.apiEndpoint}/groups`;

// Créer un groupe
export function createGroup(groupData) {
  return http.post(apiEndpoint, groupData);
}

export function getAllGroups() {
  return http.get(apiEndpoint);
}

// Ajouter un membre au groupe
export function addMemberToGroup(data) {
  return http.post(`${apiEndpoint}/addMember`, data);
}
