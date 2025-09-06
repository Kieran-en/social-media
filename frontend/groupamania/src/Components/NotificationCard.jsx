import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { markAsRead } from '../Services/notificationService';

function NotificationCard({ notification, isEmpty = false, onMarkAsRead }) {
  if (isEmpty) {
    return (
      <div
        style={{
          border: "1px solid #e0e0e0",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "12px",
          color: "#6c757d",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        🔕 Aucune notification pour le moment.
      </div>
    );
  }

  if (!notification) return null;

  const { text, createdAt, isRead } = notification;

  const handleClick = async () => {
    if (!isRead && onMarkAsRead) {
      try {
        await markAsRead(notification.id);
        onMarkAsRead(notification.id);
      } catch (error) {
        console.error('Erreur lors du marquage de la notification comme lue:', error);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        border: "1px solid #e0e0e0",
        backgroundColor: isRead ? "#ffffff" : "#f8f9fa",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "12px",
        transition: "all 0.2s ease",
        cursor: isRead ? "default" : "pointer",
        opacity: isRead ? 0.7 : 1,
      }}
    >
      <p style={{ 
        marginBottom: 8, 
        fontWeight: isRead ? "400" : "600",
        color: isRead ? "#666" : "#1a1a1a",
        fontSize: "14px",
        lineHeight: "1.4"
      }}>
        {text}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <small style={{ color: "#999", fontSize: "12px" }}>
          {createdAt
            ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
            : "À l'instant"}
        </small>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!isRead && (
            <div style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#6c757d",
              borderRadius: "50%",
              flexShrink: 0
            }}></div>
          )}
          {notification.sender && (
            <small style={{ color: "#666", fontSize: "12px" }}>
              {notification.sender.name}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
