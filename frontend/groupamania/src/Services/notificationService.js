// frontend/src/Services/notificationService.js

import http from './httpService';
import config from '../config.json';

const apiEndpoint = `${config.apiEndpoint}/notifications`;

// Get notifications for a specific user
export function getNotifications(userId) {
  return http.get(`${apiEndpoint}/${userId}`);
}

// Get all notifications (admin-level)
export function getAllNotifications() {
  return http.get(apiEndpoint);
}

// Mark one notification as read
export function markAsRead(notificationId) {
  return http.put(`${apiEndpoint}/${notificationId}/read`);
}

// Mark all notifications as read for a user
export function markAllAsRead(userId) {
  return http.put(`${apiEndpoint}/markRead/${userId}`);
}

// Get unread count for a user
export function getUnreadCount(userId) {
  return http.get(`${apiEndpoint}/${userId}/unread-count`);
}