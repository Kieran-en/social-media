import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { PersonPlus } from 'react-bootstrap-icons';
import CreateUserModal from './CreateUserModal';

export default function QuickCreateUser({ currentUserRole, onUserCreated }) {
  const [showModal, setShowModal] = useState(false);

  // Ne pas afficher si l'utilisateur n'est pas diacre
  if (currentUserRole !== 'diacre') {
    return null;
  }

  const handleUserCreated = () => {
    onUserCreated && onUserCreated();
    setShowModal(false);
  };

  return (
    <>
      <OverlayTrigger
        placement="left"
        overlay={
          <Tooltip id="quick-create-tooltip">
            Ajouter un nouvel utilisateur à la paroisse
          </Tooltip>
        }
      >
        <Button
          variant="success"
          size="lg"
          className="position-fixed"
          style={{
            bottom: '20px',
            right: '20px',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: 'none'
          }}
          onClick={() => setShowModal(true)}
        >
          <PersonPlus size={24} />
        </Button>
      </OverlayTrigger>

      <CreateUserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onUserCreated={handleUserCreated}
        currentUserRole={currentUserRole}
      />
    </>
  );
}
