// src/Components/GroupProfile.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../Services/userService";
import { joinGroup, leaveGroup } from "../Services/groupService";
// Assurez-vous d'avoir installé lucide-react : npm install lucide-react
import { Pencil, MessageSquare, UserPlus, UserCheck, Users, Crown } from 'lucide-react';

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
  const queryClient = useQueryClient();
  const token = useSelector(state => state.token);
  const userData = getCurrentUser(token);
  const currentUserId = userData?.userId;

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
            <button 
              onClick={changeModalState}
              className="flex items-center gap-2 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow"
            >
              <Pencil size={18} />
              Modifier le groupe
            </button>
          ) : (
            <>
              <button 
                onClick={handleJoinGroup}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors shadow ${
                  isGroupMember 
                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isGroupMember ? <UserCheck size={18} /> : <UserPlus size={18} />}
                {isGroupMember ? 'Membre' : 'Rejoindre'}
              </button>
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
    </div>
  );
};

export default GroupProfile;
