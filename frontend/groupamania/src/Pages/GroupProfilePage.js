// src/Pages/GroupProfilePage.jsx

import React, { useState } from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getCurrentUser } from "../Services/userService";
import { 
  getGroup, 
  getGroupPosts, 
  getUserGroupMembership 
} from "../Services/groupService";
import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";

import GroupProfile from "../Components/GroupProfile";
import GroupProfileModal from "../Components/GroupProfileModal";
import Post from "../Components/Post";
import NavBar from "../Components/NavBar";
import { Loader, Loader2 } from "lucide-react";

const GroupProfilePage = () => {
    const [modalOpen, setModalOpen] = useState(false);    
    const { groupId } = useParams();
    const token = useSelector(state => state.token);
    const { ref, inView } = useInView();
    
    // Récupérer les données de l'utilisateur connecté
    const currentUser = getCurrentUser(token);
    const currentUserId = currentUser?.userId;
    
    // Récupérer les données du groupe
    const { data: groupData, isLoading, isError } = useQuery(
      ['group', groupId], 
      () => getGroup(groupId).then(res => res.data),
      {
        enabled: !!groupId
      }
    );
    
    // Récupérer les informations de membership
    const { data: membershipData } = useQuery(
      ['groupMembership', groupId, currentUserId], 
      () => getUserGroupMembership(groupId, currentUserId).then(res => res.data),
      {
        enabled: !!groupId && !!currentUserId
      }
    );

    // Récupérer les posts du groupe avec pagination infinie
    const {
      data: postsData,
      status: postsStatus,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage
    } = useInfiniteQuery({
      queryKey: ['groupPosts', groupId],
      queryFn: ({ pageParam = 1 }) => getGroupPosts(groupId, pageParam).then(res => res.data),
      getNextPageParam: (lastPage) => {
        if (!lastPage) return undefined;
        const { currentPage, totalPages } = lastPage;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      enabled: !!groupId,
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
          <div className="text-center">
            <p className="text-red-500 text-lg mb-2">Erreur lors du chargement du groupe</p>
            <p className="text-gray-500">Le groupe demandé est introuvable ou inaccessible.</p>
          </div>
        </div>
      );
    }

    // Préparer les posts pour l'affichage
    const allPosts = postsData?.pages?.flatMap(page => page.posts) || [];
    const allPostsCount = postsData?.pages?.reduce((sum, p) => sum + p.posts.length, 0) || 0;
    const allLoaded = !hasNextPage && allPostsCount > 0;

    // Déterminer les permissions de l'utilisateur
    const isGroupMember = membershipData?.isGroupMember || false;
    const isGroupAdmin = membershipData?.isGroupAdmin || (currentUserId === groupData?.leaderId);

    return (
        <div className="min-h-screen bg-gray-100">
          <NavBar />
          <main className="pt-10 pb-10">
            <div className="max-w-4xl mx-auto px-4">
              {/* Section profil du groupe */}
              <div className="flex justify-center mb-8">
                {groupData && (
                  <GroupProfile  
                    name={groupData.name}
                    description={groupData.description}
                    groupId={groupData.id}
                    memberCount={groupData.memberCount}
                    postCount={groupData.postCount}
                    profileImg={groupData.profileImg}
                    leaderId={groupData.leaderId}
                    leader={groupData.leader}
                    isGroupMember={isGroupMember}
                    isGroupAdmin={isGroupAdmin}
                    changeModalState={() => setModalOpen(true)}
                  />
                )}
              </div>

              {/* Section des posts du groupe */}
              <div className="max-w-2xl mx-auto">
                
                {postsStatus === 'loading' && (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-600">Chargement des publications du groupe...</p>
                  </div>
                )}

                {postsStatus === 'error' && (
                  <div className="text-center py-8">
                    <p className="text-red-600">Erreur lors du chargement des publications</p>
                  </div>
                )}

                {postsStatus === 'success' && allPosts.length === 0 && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-gray-500 text-lg">
                      {isGroupMember ? 'Soyez le premier à publier dans ce groupe !' : 'Ce groupe n\'a pas encore de publications.'}
                    </p>
                    {!isGroupMember && (
                      <p className="text-gray-400 text-sm mt-2">
                        Rejoignez le groupe pour voir et partager du contenu.
                      </p>
                    )}
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
                        comments={[]}
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
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <p className="text-gray-500 font-medium">Toutes les publications ont été chargées</p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Modal de modification du groupe (seulement pour les admins) */}
          {modalOpen && isGroupAdmin && (
            <GroupProfileModal 
              closeModal={() => setModalOpen(false)} 
              groupName={groupData?.name} 
              groupDescription={groupData?.description}
              profileImg={groupData?.profileImg}
              groupId={groupData?.id}
            />
          )}
        </div>
    );
}

export default GroupProfilePage;
