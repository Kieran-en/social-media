import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/searchResults.module.css';

export default function SearchResults({ 
    users, 
    loading, 
    error, 
    onUserClick,
    currentUserId 
}) {
    const navigate = useNavigate();

    const handleUserClick = (user) => {
        if (onUserClick) {
            onUserClick(user);
        } else {
            // Navigation par défaut vers le profil
            navigate(`/profilepage/${user.name}`);
        }
    };

    const getRoleBadge = (role) => {
        const roleConfig = {
            'admin': { variant: 'danger', icon: '👑', text: 'Admin' },
            'diacre': { variant: 'primary', icon: '⛪', text: 'Diacre' },
            'responsable_groupe': { variant: 'success', icon: '👥', text: 'Responsable' },
            'user': { variant: 'secondary', icon: '👤', text: 'Fidèle' }
        };
        
        const config = roleConfig[role] || roleConfig['user'];
        return (
            <Badge bg={config.variant} className="d-flex align-items-center gap-1">
                <span>{config.icon}</span>
                {config.text}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Recherche en cours...</span>
                </div>
                <p className="mt-2 text-muted">Recherche en cours...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className="alert alert-danger" role="alert">
                    <strong>Erreur :</strong> {error}
                </div>
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className={styles.noResultsContainer}>
                <div className="text-center">
                    <FaUser className={styles.noResultsIcon} />
                    <h5 className="mt-3 text-muted">Aucun utilisateur trouvé</h5>
                    <p className="text-muted">Essayez avec d'autres mots-clés</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.resultsContainer}>
            <div className={styles.resultsHeader}>
                <h6 className="mb-0">
                    <FaUsers className="me-2" />
                    {users.length} utilisateur{users.length > 1 ? 's' : ''} trouvé{users.length > 1 ? 's' : ''}
                </h6>
            </div>
            
            <div className={styles.usersList}>
                {users.map((user) => (
                    <Card 
                        key={user.id} 
                        className={`${styles.userCard} ${user.id === currentUserId ? styles.currentUser : ''}`}
                        onClick={() => handleUserClick(user)}
                    >
                        <Card.Body className="p-3">
                            <div className="d-flex align-items-center">
                                <div className={styles.avatarContainer}>
                                    <img 
                                        src={user.profileImg || '/images/profile.png'} 
                                        alt={user.name}
                                        className={styles.avatar}
                                        onError={(e) => {
                                            e.target.src = '/images/profile.png';
                                        }}
                                    />
                                </div>
                                
                                <div className={styles.userInfo}>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h6 className={`mb-1 ${styles.userName}`}>
                                            {user.name}
                                        </h6>
                                        {getRoleBadge(user.role)}
                                    </div>
                                    
                                    <div className="d-flex align-items-center text-muted small mb-2">
                                        <FaEnvelope className="me-1" />
                                        <span className={styles.userEmail}>{user.email}</span>
                                    </div>
                                    
                                    <div className="d-flex gap-3 small text-muted">
                                        <span>
                                            <strong>{user.followers || 0}</strong> abonné{user.followers > 1 ? 's' : ''}
                                        </span>
                                        <span>
                                            <strong>{user.following || 0}</strong> abonnement{user.following > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
}
