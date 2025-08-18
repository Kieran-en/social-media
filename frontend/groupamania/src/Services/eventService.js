// src/Services/eventService.js

import http from './httpService';
import config from '../config.json';

const apiEndpoint = `${config.apiEndpoint}/events`;

// Récupérer tous les événements
export function getAllEvents() {
  return http.get(apiEndpoint);
}

// Créer un événement
export function createEvent(eventData) {
  return http.post(apiEndpoint, eventData);
}

// Modifier un événement
export function updateEvent(id, eventData) {
  return http.put(`${apiEndpoint}/${id}`, eventData);
}

// Supprimer un événement
export function deleteEvent(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}

// Bascule entre OK / CANCELED
export function toggleEventState(id) {
  return http.put(`${apiEndpoint}/${id}/toggle`);
}
