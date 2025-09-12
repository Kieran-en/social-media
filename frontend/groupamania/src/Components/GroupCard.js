// src/Components/GroupCard.jsx

import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaUsers, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/searchResults.module.css';

export default function GroupCard({ group, onGroupClick }) {
    const navigate = useNavigate();

    const handleGroupClick = () => {
        if (onGroupClick) {
            onGroupClick(group);
        } else {
            // Navigation par défaut vers le profil du groupe
            navigate(`/group/${group.id}`);
        }
    };

    const getStatusBadge = (isActive) => {
        return (
            <Badge bg={isActive ? 'success' : 'secondary'} className="d-flex align-items-center gap-1">
                <span>{isActive ? '✅' : '⏸️'}</span>
                {isActive ? 'Actif' : 'Suspendu'}
            </Badge>
        );
    };

    return (
        <Card className={`${styles.resultCard} h-100`}>
            <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                    <img 
                        src={group.profileImg || `https://ui-avatars.com/api/?name=${group.name}&background=random&size=60`}
                        alt={`${group.name} profile`}
                        className="rounded-circle me-3"
                        style={{ width: 60, height: 60, objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                        <h5 className="mb-1">{group.name}</h5>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            {getStatusBadge(group.isActive)}
                        </div>
                    </div>
                </div>

                {group.description && (
                    <p className="text-muted small mb-3" style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {group.description}
                    </p>
                )}

                <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                    <div className="d-flex align-items-center gap-1">
                        <FaUsers />
                        <span>{group.memberCount || 0} membre{(group.memberCount || 0) !== 1 ? 's' : ''}</span>
                    </div>
                    {group.leader && (
                        <div className="text-end">
                            <small>Dirigé par <strong>{group.leader.name}</strong></small>
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={handleGroupClick}
                        className="w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                        <FaEye />
                        Voir le profil
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}
