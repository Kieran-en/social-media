import React, { useState, useEffect } from "react";
import CalendarWidget from "../Components/CalendarWidget";
import Post from "../Components/Post";
import Modal from "../Components/Modal";
import DeleteModal from "../Components/DeleteModal";
import RandomQuote from '../Components/Quotes';
import { ImageIcon, Send, Loader2, Calendar, Settings, Home, Users, Bell, MessageCircle } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { getPosts, createPost } from "../Services/postService";
import { getComments } from "../Services/commentService";
import { getCurrentUser, getUser } from "../Services/userService";
import NavBar from "../Components/NavBar";
import { useSelector } from "react-redux";

const Timeline = () => {
  const token = useSelector(state => state.token);
  const userData = getCurrentUser(token);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { ref, inView } = useInView();
  const { userlogged } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [postToModify, setPostToModify] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const { username, userId } = userData || {};

  // Track window size for responsive rendering
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: 'posts',
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { currentPage, totalPages } = lastPage;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    }
  });

  const { data: comments } = useQuery('comments', getComments);
  useQuery(['user'], () => getUser(username));

  const mutation = useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      setText('');
      setFile(null);
      setPreviewUrl(null);
    }
  });

  const handleChange = (event) => setText(event.target.value);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handlePost = (event) => {
    event.preventDefault();
    const post = new FormData();
    post.append('text', text);
    post.append('image', file);
    post.append('userId', userId);
    mutation.mutate(post);
  };

  useEffect(() => {
    return () => previewUrl && URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, fetchNextPage, hasNextPage]);

  if (status === 'loading') {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des posts...</p>
          </div>
        </div>
    );
  }

  if (status === 'error') {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
          <div className="text-center bg-red-50 p-8 rounded-2xl">
            <p className="text-red-600">Erreur: {error.message}</p>
          </div>
        </div>
    );
  }

  const content = data.pages.flatMap((page, pageIndex) =>
      page.posts.map((post, i) => (
          <Post
              key={post.id}
              ref={pageIndex === data.pages.length - 1 && i === page.posts.length - 1 ? ref : null}
              changeModalState={(p) => {
                setModalOpen(true);
                setPostToModify(p);
              }}
              changeDeleteModalState={(p) => {
                setDeleteModalOpen(true);
                setPostToDelete(p);
              }}
              profileImg={post.User?.profileImg}
              picture={post.imageUrl}
              content={post.text}
              likes={post.likes}
              dislikes={post.dislikes}
              username={post.User?.name}
              postId={post.id}
              userId={post.UserId}
              date={post.createdAt}
              userLoggedIn={userlogged}
              comments={comments}
          />
      ))
  );

  const allPostsCount = data.pages.reduce((sum, p) => sum + p.posts.length, 0);
  const allLoaded = !hasNextPage && allPostsCount > 0;

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <NavBar showAdminInDropdown={windowWidth < 992} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Sidebar - Calendar */}
            {windowWidth >= 992 && (
                <div className="lg:col-span-3">
                  <div className="sticky top-24">
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6 hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <Calendar className="h-6 w-6 text-blue-500 mr-2" />
                        <h3 className="font-bold text-gray-800">Calendrier</h3>
                      </div>
                      <CalendarWidget />
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                      <h3 className="font-bold text-gray-800 mb-4">Liens rapides</h3>
                      <div className="space-y-3">
                        <Link to="/" className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 group">
                          <Home className="h-5 w-5 text-gray-500 group-hover:text-blue-500 mr-3" />
                          <span className="text-gray-700 group-hover:text-blue-600">Accueil</span>
                        </Link>
                        <Link to="/groups" className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 group">
                          <Users className="h-5 w-5 text-gray-500 group-hover:text-blue-500 mr-3" />
                          <span className="text-gray-700 group-hover:text-blue-600">Groupes</span>
                        </Link>
                        <Link to="/notifications" className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 group">
                          <Bell className="h-5 w-5 text-gray-500 group-hover:text-blue-500 mr-3" />
                          <span className="text-gray-700 group-hover:text-blue-600">Notifications</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* Center - Main Feed */}
            <div className="lg:col-span-6">
              {/* Create Post Box */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6 hover:shadow-2xl transition-all duration-300">
                <form onSubmit={handlePost}>
                  <div className="flex space-x-4 mb-4">
                    <img
                        src={userData?.profileImg || 'https://via.placeholder.com/50'}
                        alt='Profile'
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 hover:ring-blue-300 transition-all duration-300"
                    />
                    <div className="flex-1">
                    <textarea
                        name="text"
                        value={text}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Qu'est-ce qui se passe?"
                        rows="3"
                    />
                    </div>
                  </div>

                  {previewUrl && (
                      <div className="mb-4 relative">
                        <img
                            src={previewUrl}
                            alt="preview"
                            className="w-full h-64 object-cover rounded-xl"
                        />
                        <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                              setPreviewUrl(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                        >
                          ✕
                        </button>
                      </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label htmlFor='file-upload' className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 hover:from-blue-100 hover:to-green-100 cursor-pointer transition-all duration-200 group">
                        <ImageIcon className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm font-medium text-gray-700">Media</span>
                      </label>
                      <input
                          id='file-upload'
                          name='image'
                          type='file'
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                      />
                    </div>

                    <button
                        type="submit"
                        disabled={!text && !file}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                            text || file
                                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-blue-600'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <Send className="h-4 w-4" />
                      <span>Publier</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Posts Feed */}
              <div className="space-y-6">
                {content}
              </div>

              {/* Loading More Indicator */}
              {isFetchingNextPage && (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-600">Chargement de plus de posts...</p>
                  </div>
              )}

              {/* All Posts Loaded */}
              {allLoaded && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-4">
                      <MessageCircle className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-gray-500 font-medium">Vous êtes à jour!</p>
                    <p className="text-gray-400 text-sm">Plus de posts à charger</p>
                  </div>
              )}
            </div>

            {/* Right Sidebar */}
            {windowWidth >= 992 && (
                <div className="lg:col-span-3">
                  <div className="sticky top-24">
                    {/* Random Quote */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6 hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-2">💭</span>
                        <h3 className="font-bold text-gray-800">Citation du jour</h3>
                      </div>
                      <RandomQuote />
                    </div>

                    {/* Admin Panel Link */}
                    {userData?.role === 'admin' && (
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                          <Link
                              to="/admin"
                              className="flex items-center justify-center space-x-3 text-white font-bold"
                          >
                            <Settings className="h-6 w-6 animate-spin-slow" />
                            <span>Gérer la plateforme</span>
                          </Link>
                        </div>
                    )}

                    {/* Online Users */}
                    {/* <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mt-6 hover:shadow-2xl transition-all duration-300">
                      <h3 className="font-bold text-gray-800 mb-4">Membres actifs</h3>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-3">
                              <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full"></div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Membre {i}</p>
                                <p className="text-xs text-gray-500">En ligne</p>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {modalOpen && <Modal closeModal={() => setModalOpen(false)} postToModify={postToModify} />}
        {deleteModalOpen && <DeleteModal closeModal={() => setDeleteModalOpen(false)} postToDelete={postToDelete} />}

      </div>
  );
};

export default Timeline;