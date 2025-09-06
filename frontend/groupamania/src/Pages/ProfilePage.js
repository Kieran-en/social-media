// src/Pages/ProfilePage.jsx

import React, { useState } from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getUser, getCurrentUser } from "../Services/userService";
import { getUserPosts } from "../Services/postService";
import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";

import Profile from "../Components/Profile";
import ProfileModal from "../Components/ProfileModal";
import Post from "../Components/Post";
import NavBar from "../Components/NavBar";
import { Loader, Loader2 } from "lucide-react"; // Pour un indicateur de chargement

const ProfilePage = () => {
    const [modalOpen, setModalOpen] = useState(false);    
    const { user: profileUsername } = useParams(); // Renommé pour plus de clarté
    const token = useSelector(state => state.token);
    const { ref, inView } = useInView();
    
    // Récupérer les données de l'utilisateur de la page
    const { data: userPageData, isLoading, isError } = useQuery(
      ['user', profileUsername], 
      () => getUser(profileUsername)
    );
    
    // Récupérer les données de l'utilisateur connecté pour comparer
    const currentUser = getCurrentUser(token);
    const isOwnProfile = currentUser?.username === profileUsername;

    // Récupérer les posts de l'utilisateur avec pagination infinie
    const {
      data: postsData,
      status: postsStatus,
      error: postsError,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage
    } = useInfiniteQuery({
      queryKey: ['userPosts', userPageData?.id],
      queryFn: ({ pageParam = 1 }) => getUserPosts(userPageData?.id, pageParam),
      getNextPageParam: (lastPage) => {
        if (!lastPage) return undefined;
        const { currentPage, totalPages } = lastPage;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      enabled: !!userPageData?.id, // Ne s'exécute que si on a l'ID de l'utilisateur
    });

    // Effet pour charger plus de posts quand on arrive en bas
    React.useEffect(() => {
      if (inView && hasNextPage) fetchNextPage();
    }, [inView, fetchNextPage, hasNextPage]);

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

    // Préparer les posts pour l'affichage
    const allPosts = postsData?.pages?.flatMap(page => page.posts) || [];
    const allPostsCount = postsData?.pages?.reduce((sum, p) => sum + p.posts.length, 0) || 0;
    const allLoaded = !hasNextPage && allPostsCount > 0;

    return (
        // Layout de la page : fond gris, centré
        <div className="min-h-screen bg-gray-100">
          <NavBar />
          <main className="pt-10 pb-10">
            <div className="max-w-4xl mx-auto px-4">
              {/* Section profil */}
              <div className="flex justify-center mb-8">
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
              </div>

              {/* Section des posts */}
              <div className="max-w-2xl mx-auto">
                
                {postsStatus === 'loading' && (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-600">Chargement des publications...</p>
                  </div>
                )}

                {postsStatus === 'error' && (
                  <div className="text-center py-8">
                    <p className="text-red-600">Erreur lors du chargement des publications</p>
                  </div>
                )}

                {postsStatus === 'success' && allPosts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">
                      {isOwnProfile ? 'Vous n\'avez pas encore publié de contenu.' : 'Cet utilisateur n\'a pas encore publié de contenu.'}
                    </p>
                  </div>
                )}

                {postsStatus === 'success' && allPosts.length > 0 && (
                  <div className="space-y-6">
                    {allPosts.map((post, index) => (
                      <Post
                        key={post.id}
                        ref={index === allPosts.length - 1 ? ref : null}
                        profileImg={post.User?.profileImg}
                        picture={post.imageUrl}
                        content={post.text}
                        likes={post.likes}
                        dislikes={post.dislikes}
                        username={post.User?.name}
                        postId={post.id}
                        userId={post.UserId}
                        date={post.createdAt}
                        userLoggedIn={currentUser?.username}
                        comments={[]} // On peut ajouter les commentaires plus tard si nécessaire
                      />
                    ))}
                  </div>
                )}

                {/* Indicateur de chargement pour plus de posts */}
                {isFetchingNextPage && (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-600">Chargement de plus de publications...</p>
                  </div>
                )}

                {/* Indicateur de fin */}
                {allLoaded && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-gray-500 font-medium">Toutes les publications ont été chargées</p>
                  </div>
                )}
              </div>
            </div>
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