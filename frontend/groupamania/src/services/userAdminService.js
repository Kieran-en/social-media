// src/Services/userAdminService.js
import http from './httpService'
import config from '../config.json'

const apiEndpoint = `${config.apiEndpoint}/users`;

export function getAllUsers() {
  return http.get(apiEndpoint);
}

export function suspendUser(id) {
  return http.put(`${apiEndpoint}/${id}/suspend`);
}

export function reactivateUser(id) {
  return http.put(`${apiEndpoint}/${id}/reactivate`);
}

export function deleteUser(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}

export function renameUser(id, newRole) {
  return http.patch(`${apiEndpoint}/${id}/role`, { role: newRole });
}
