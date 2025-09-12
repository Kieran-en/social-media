// src/Components/GroupProfile.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../Services/userService";
import { joinGroup, leaveGroup, requestToJoinGroup, getUserJoinRequestStatus } from "../Services/groupService";
// Assurez-vous d'avoir installé lucide-react : npm install lucide-react
import { Pencil, MessageSquare, UserPlus, UserCheck, Users, Crown, Clock, CheckCircle, XCircle, PenTool } from 'lucide-react';
import { Modal, Button, Form } from 'react-bootstrap';
import GroupJoinRequestsModal from './GroupJoinRequestsModal';
import GroupPostModal from './GroupPostModal';

// Le composant GroupProfile est basé sur le composant Profile des utilisateurs
const GroupProfile = ({ 
  name, 
  description, 
  profileImg, 
  changeModalState, 
  memberCount, 
  postCount, 
  groupId, 
  isGroupMember,
  isGroupAdmin,
  leaderId,
  leader
}) => {
  const navigate = useNavigate();
  const [joinRequestStatus, setJoinRequestStatus] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const queryClient = useQueryClient();
  const token = useSelector(state => state.token);
  const userData = getCurrentUser(token);
  const currentUserId = userData?.userId;

  // Vérifier le statut de demande d'adhésion au chargement
  useEffect(() => {
    if (groupId && currentUserId && !isGroupMember) {
      getUserJoinRequestStatus(groupId)
        .then(response => {
          setJoinRequestStatus(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la vérification du statut:', error);
        });
    }
  }, [groupId, currentUserId, isGroupMember]);

  // Mutation pour demander à rejoindre le groupe
  const requestJoinMutation = useMutation(
    ({ groupId, message }) => requestToJoinGroup(groupId, message),
    {
      onSuccess: () => {
        // Rafraîchir le statut
        getUserJoinRequestStatus(groupId)
          .then(response => setJoinRequestStatus(response.data));
        setShowJoinModal(false);
        setJoinMessage('');
        // Optionnel: Afficher une notification de succès
      },
      onError: (error) => {
        console.error('Erreur lors de la demande:', error);
        // Optionnel: Afficher une notification d'erreur
      }
    }
  );

  // Mutations pour rejoindre/quitter un groupe
  const joinGroupMutation = useMutation(
    () => isGroupMember ? leaveGroup(groupId) : joinGroup(groupId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['group', groupId]);
        queryClient.invalidateQueries(['groupMembership', groupId, currentUserId]);
        queryClient.invalidateQueries(['groupMembers', groupId]);
      },
      onError: (error) => {
        console.error('Erreur lors de la modification du membership:', error);
        // TODO: Afficher un toast d'erreur
      }
    }
  );

  const handleJoinGroup = () => {
    joinGroupMutation.mutate();
  };

  const handleMessage = () => {
    // Logique pour naviguer vers les messages du groupe
    console.log("Navigating to group messages:", groupId);
    navigate(`/group/${groupId}/messages`);
  };

  const handleViewMembers = () => {
    // Naviguer vers la liste des membres du groupe
    navigate(`/group/${groupId}/members`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Bannière */}
        <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100"></div>

        {/* Section principale avec photo de profil et nom */}
        <div className="flex flex-col items-center -mt-16 px-6">
          <img 
            src={profileImg || `https://ui-avatars.com/api/?name=${name}&background=random&size=128`} 
            alt="group profile" 
            className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md"
          />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">{name}</h1>
          {description && (
            <p className="text-gray-500 text-center mt-2 max-w-md">{description}</p>
          )}
          
          {/* Informations du leader */}
          {leader && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Crown size={16} className="text-yellow-500" />
              <span>Dirigé par <strong>{leader.name}</strong></span>
            </div>
          )}
        </div>

        {/* Section des statistiques */}
        <div className="flex justify-center gap-12 mt-6 py-4 border-t border-b border-gray-100">
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-800">{memberCount || 0}</span>
            <span className="block text-sm text-gray-500">Membres</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-800">{postCount || 0}</span>
            <span className="block text-sm text-gray-500">Publications</span>
          </div>
        </div>

        {/* Section des boutons d'action */}
        <div className="p-6 flex justify-center gap-4 flex-wrap">
          {isGroupAdmin ? (
            <>
              <button 
                onClick={changeModalState}
                className="flex items-center gap-2 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow"
              >
                <Pencil size={18} />
                Modifier le groupe
              </button>
              {/* Bouton pour créer un post au nom du groupe */}
              <button 
                onClick={() => setShowPostModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow"
              >
                <PenTool size={18} />
                Publier
              </button>
              
              {/* Bouton pour voir les demandes d'adhésion (responsables seulement) */}
              <button 
                onClick={() => setShowRequestsModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow"
              >
                <Clock size={18} />
                Demandes
              </button>
            </>
          ) : (
            <>
              {/* Logique des boutons selon le statut de l'utilisateur */}
              {isGroupMember ? (
                <button 
                  onClick={handleJoinGroup}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow"
                >
                  <UserCheck size={18} />
                  Membre
                </button>
              ) : joinRequestStatus?.hasRequest ? (
                // L'utilisateur a déjà fait une demande
                <button 
                  disabled
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow cursor-not-allowed ${
                    joinRequestStatus.requestStatus === 'pending' 
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      : joinRequestStatus.requestStatus === 'rejected'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-green-100 text-green-700 border border-green-300'
                  }`}
                >
                  {joinRequestStatus.requestStatus === 'pending' && <Clock size={18} />}
                  {joinRequestStatus.requestStatus === 'rejected' && <XCircle size={18} />}
                  {joinRequestStatus.requestStatus === 'approved' && <CheckCircle size={18} />}
                  {joinRequestStatus.requestStatus === 'pending' && 'Demande en attente'}
                  {joinRequestStatus.requestStatus === 'rejected' && 'Demande refusée'}
                  {joinRequestStatus.requestStatus === 'approved' && 'Demande approuvée'}
                </button>
              ) : (
                // L'utilisateur peut faire une demande
                <button 
                  onClick={() => setShowJoinModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow"
                  disabled={requestJoinMutation.isLoading}
                >
                  <UserPlus size={18} />
                  {requestJoinMutation.isLoading ? 'Envoi...' : 'Demander à rejoindre'}
                </button>
              )}
              
              <button 
                onClick={handleMessage}
                className="flex items-center gap-2 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow"
              >
                <MessageSquare size={18} />
                Messages
              </button>
            </>
          )}
          
          {/* Bouton pour voir les membres (accessible à tous) */}
          <button 
            onClick={handleViewMembers}
            className="flex items-center gap-2 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow"
          >
            <Users size={18} />
            Membres
          </button>
        </div>
      </div>

      {/* Modal pour demander à rejoindre le groupe */}
      <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Demander à rejoindre {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            requestJoinMutation.mutate({ groupId, message: joinMessage });
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Message de motivation (optionnel)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                placeholder="Expliquez pourquoi vous souhaitez rejoindre ce groupe..."
              />
              <Form.Text className="text-muted">
                Ce message sera visible par les responsables du groupe.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowJoinModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={() => requestJoinMutation.mutate({ groupId, message: joinMessage })}
            disabled={requestJoinMutation.isLoading}
          >
            {requestJoinMutation.isLoading ? 'Envoi...' : 'Envoyer la demande'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal pour créer un post au nom du groupe (responsables seulement) */}
      {isGroupAdmin && (
        <GroupPostModal
          show={showPostModal}
          onHide={() => setShowPostModal(false)}
          groupId={groupId}
          groupName={name}
          groupImage={profileImg}
        />
      )}

      {/* Modal pour gérer les demandes d'adhésion (responsables seulement) */}
      {isGroupAdmin && (
        <GroupJoinRequestsModal
          show={showRequestsModal}
          onHide={() => setShowRequestsModal(false)}
          groupId={groupId}
          groupName={name}
        />
      )}
    </div>
  );
};

export default GroupProfile;
