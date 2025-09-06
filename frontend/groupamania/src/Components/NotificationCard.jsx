import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../Services/userService';
import { markAsRead } from '../Services/notificationService';

function NotificationCard({ notification, isEmpty = false, onMarkAsRead }) {
  const navigate = useNavigate();
  const token = useSelector(state => state.token);
  const userData = getCurrentUser(token);
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

  const { text, createdAt, isRead, type, postId, commentId, messageId, eventId } = notification;

  const handleClick = async () => {
    // Marquer comme lu si ce n'est pas déjà fait
    if (!isRead && onMarkAsRead) {
      try {
        await markAsRead(notification.id);
        onMarkAsRead(notification.id);
      } catch (error) {
        console.error('Erreur lors du marquage de la notification comme lue:', error);
      }
    }

    // Naviguer vers l'élément correspondant
    navigateToContent();
  };

  const navigateToContent = () => {
    // Récupérer le nom d'utilisateur de l'utilisateur connecté
    const username = userData?.username || userData?.name;
    
    switch (type) {
      case 'post':
        // Rediriger vers la timeline avec le nom d'utilisateur
        if (username) {
          navigate(`/timeline/${username}`);
        } else {
          navigate('/timeline');
        }
        break;
      
      case 'comment':
        // Rediriger vers la timeline (le post sera visible)
        if (username) {
          navigate(`/timeline/${username}`);
        } else {
          navigate('/timeline');
        }
        break;
      
      case 'like':
        // Rediriger vers la timeline (le post sera visible)
        if (username) {
          navigate(`/timeline/${username}`);
        } else {
          navigate('/timeline');
        }
        break;
      
      case 'message':
        // Rediriger vers les messages
        navigate('/messages');
        break;
      
      case 'follow':
        // Rediriger vers le profil de l'utilisateur qui a suivi
        if (notification.sender && notification.sender.name) {
          // Utiliser le nom d'utilisateur directement (l'API utilise le champ 'name')
          navigate(`/profilepage/${notification.sender.name}`);
        } else if (notification.senderId) {
          // Fallback: si pas de nom, rediriger vers la timeline
          console.warn('Nom d\'utilisateur non disponible pour la notification de follow');
          navigate('/timeline');
        } else {
          navigate('/timeline');
        }
        break;
      
      case 'event':
        // Rediriger vers les événements (ou timeline si pas de page événements)
        if (username) {
          navigate(`/timeline/${username}`);
        } else {
          navigate('/timeline');
        }
        break;
      
      default:
        // Par défaut, rediriger vers la timeline
        if (username) {
          navigate(`/timeline/${username}`);
        } else {
          navigate('/timeline');
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
        cursor: "pointer",
        opacity: isRead ? 0.7 : 1,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isRead ? "#f8f9fa" : "#e9ecef";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isRead ? "#ffffff" : "#f8f9fa";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
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
          <small style={{ color: "#999", fontSize: "10px", marginLeft: "auto" }}>
            👆 Cliquer pour voir
          </small>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
