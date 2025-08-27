// src/Pages/ProfilePage.jsx

import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getUser, getCurrentUser } from "../Services/userService";
import { useSelector } from "react-redux";

import Profile from "../Components/Profile";
import ProfileModal from "../Components/ProfileModal";
import NavBar from "../Components/NavBar";
import { Loader } from "lucide-react"; // Pour un indicateur de chargement

const ProfilePage = () => {
    const [modalOpen, setModalOpen] = useState(false);    
    const { user: profileUsername } = useParams(); // Renommé pour plus de clarté
    const token = useSelector(state => state.token);
    
    // Récupérer les données de l'utilisateur de la page
    const { data: userPageData, isLoading, isError } = useQuery(
      ['user', profileUsername], 
      () => getUser(profileUsername)
    );
    
    // Récupérer les données de l'utilisateur connecté pour comparer
    const currentUser = getCurrentUser(token);
    const isOwnProfile = currentUser?.username === profileUsername;

    // Gestion des états de chargement et d'erreur
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <Loader className="animate-spin text-gray-500" size={48} />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <p className="text-red-500">Error loading user profile.</p>
        </div>
      );
    }

    return (
        // Layout de la page : fond gris, centré
        <div className="min-h-screen bg-gray-100">
          <NavBar />
          <main className="pt-10 pb-10 flex items-center justify-center">
            {userPageData && (
              <Profile  
                username={userPageData.username}
                email={userPageData.email} 
                followed_user_id={userPageData.id}
                followers={userPageData.followers} 
                following={userPageData.following}
                profileImg={userPageData.profileImg}
                isOwnProfile={isOwnProfile}
                changeModalState={() => setModalOpen(true)}
              />
            )}
          </main>

          {/* Le modal reçoit maintenant l'ID de l'utilisateur */}
          {modalOpen && (
            <ProfileModal 
              closeModal={() => setModalOpen(false)} 
              username={userPageData?.username} 
              email={userPageData?.email}
              profileImg={userPageData?.profileImg}
              userId={userPageData?.id} // <-- MODIFICATION APPLIQUÉE ICI
            />
          )}
        </div>
    );
}

export default ProfilePage;