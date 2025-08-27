// src/Components/Profile.jsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { follow, getCurrentUser, getFollowingCount } from "../Services/userService";
// Assurez-vous d'avoir installé lucide-react : npm install lucide-react
import { Pencil, MessageSquare, UserPlus, UserCheck } from 'lucide-react';

// Le composant Profile est maintenant plus "pur", il reçoit une prop pour savoir si c'est notre propre profil.
const Profile = ({ email, profileImg, changeModalState, username, followers, following, followed_user_id, isOwnProfile }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useSelector(state => state.token);
  const userData = getCurrentUser(token);
  const following_user_id = userData?.userId;

  // React Query pour vérifier si l'utilisateur actuel suit ce profil
  const { data: isFollowing } = useQuery(
    ['isFollowing', followed_user_id, following_user_id], 
    () => getFollowingCount(followed_user_id, following_user_id), 
    {
      enabled: !isOwnProfile && !!followed_user_id && !!following_user_id,
      select: (data) => data > 0 // Transforme le compte (0 ou 1) en booléen (false ou true)
    }
  );

  const followMutation = useMutation(follow, {
    onSuccess: () => {
      // Invalider les requêtes pour rafraîchir les données
      queryClient.invalidateQueries(['isFollowing', followed_user_id, following_user_id]);
      queryClient.invalidateQueries(['user', username]); // 'username' ici est la clé de la query pour ce profil
    }
  });

  const handleFollow = () => {
    followMutation.mutate({ 
      follow: isFollowing ? 0 : 1, // 0 pour unfollow, 1 pour follow
      following_user_id, 
      followed_user_id 
    });
  };

  const handleMessage = () => {
    // Logique pour naviguer vers la page de messages (à implémenter)
    console.log("Navigating to messages with user:", followed_user_id);
    navigate('/messages');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Bannière */}
        <div className="h-40 bg-gradient-to-br from-green-100 to-blue-100"></div>

        {/* Section principale avec photo de profil et nom */}
        <div className="flex flex-col items-center -mt-16 px-6">
          <img 
            src={profileImg || `https://ui-avatars.com/api/?name=${username}&background=random&size=128`} 
            alt="profile" 
            className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md"
          />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">{username}</h1>
          <p className="text-gray-500">{email}</p>
        </div>

        {/* Section des statistiques */}
        <div className="flex justify-center gap-12 mt-6 py-4 border-t border-b border-gray-100">
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-800">{followers}</span>
            <span className="block text-sm text-gray-500">Followers</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-800">{following}</span>
            <span className="block text-sm text-gray-500">Following</span>
          </div>
        </div>

        {/* Section des boutons d'action */}
        <div className="p-6 flex justify-center gap-4">
          {isOwnProfile ? (
            <button 
              onClick={changeModalState}
              className="flex items-center gap-2 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow"
            >
              <Pencil size={18} />
              Edit Profile
            </button>
          ) : (
            <>
              <button 
                onClick={handleFollow}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors shadow ${
                  isFollowing 
                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button 
                onClick={handleMessage}
                className="flex items-center gap-2 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow"
              >
                <MessageSquare size={18} />
                Message
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;