import React from 'react';
import { formatDistanceToNow } from 'date-fns';

function NotificationCard({ notification, isEmpty = false }) {
  if (isEmpty) {
    return (
      <div
        style={{
          border: "1px solid #ccc",
          backgroundColor: "#f8f9fa",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "12px",
          color: "#6c757d",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        🔕 You have no notifications for now.
      </div>
    );
  }

  if (!notification) return null;

  const { text, createdAt, read } = notification;

  return (
    <div
      style={{
        border: read ? "1px solid #ccc" : "2px solid #007bff",
        backgroundColor: read ? "#f9f9f9" : "#e6f0ff",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "12px",
        boxShadow: read ? "none" : "0 0 5px rgba(0,123,255,0.3)",
      }}
    >
      <p style={{ marginBottom: 8, fontWeight: read ? "normal" : "bold" }}>
        {text}
      </p>
      <small style={{ color: "#666" }}>
        {createdAt
          ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
          : "Just now"}
      </small>
      {notification.sender && (
  <p style={{ margin: 0, fontSize: '0.85em', color: '#555' }}>
    From: {notification.sender.name}
  </p>
)}

    </div>
  );
}

export default NotificationCard;
