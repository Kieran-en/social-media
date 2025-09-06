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
        border: isRead ? "1px solid #e0e0e0" : "3px solid #3b82f6",
        backgroundColor: isRead ? "#ffffff" : "#1f2937",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "12px",
        transition: "all 0.2s ease",
        cursor: "pointer",
        opacity: isRead ? 0.8 : 1,
        position: "relative",
        boxShadow: isRead ? "none" : "0 8px 25px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1)",
        borderLeft: isRead ? "1px solid #e0e0e0" : "6px solid #3b82f6",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isRead ? "#f8f9fa" : "#374151";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = isRead ? "0 2px 4px rgba(0,0,0,0.05)" : "0 4px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isRead ? "#ffffff" : "#1f2937";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isRead ? "none" : "0 1px 3px rgba(0,0,0,0.1)";
      }}
    >
      <p style={{ 
        marginBottom: 8, 
        fontWeight: isRead ? "400" : "700",
        color: isRead ? "#374151" : "#ffffff",
        fontSize: isRead ? "14px" : "15px",
        lineHeight: "1.4"
      }}>
        {text}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <small style={{ 
          color: isRead ? "#6b7280" : "#e5e7eb", 
          fontSize: "12px",
          fontWeight: isRead ? "400" : "500"
        }}>
          {createdAt
            ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
            : "À l'instant"}
        </small>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!isRead && (
            <div style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#3b82f6",
              borderRadius: "50%",
              flexShrink: 0,
              boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)"
            }}></div>
          )}
          {notification.sender && (
            <small style={{ 
              color: isRead ? "#6b7280" : "#e5e7eb", 
              fontSize: "12px",
              fontWeight: isRead ? "400" : "500"
            }}>
              {notification.sender.name}
            </small>
          )}
          <small style={{ 
            color: isRead ? "#9ca3af" : "#ffffff", 
            fontSize: "10px", 
            marginLeft: "auto",
            opacity: isRead ? 0.5 : 1
          }}>
            👆 Cliquer pour voir
          </small>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
