import React, { useState, useEffect } from "react";
import CalendarWidget from "../Components/CalendarWidget";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Post from "../Components/Post";
import Modal from "../Components/Modal";
import DeleteModal from "../Components/DeleteModal";
import RandomQuote from '../Components/Quotes';
import { FaImages } from "react-icons/fa";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { getPosts, createPost } from "../Services/postService";
import { getComments } from "../Services/commentService";
import { getCurrentUser, getUser } from "../Services/userService";
import NavBar from "../Components/NavBar";
import { useSelector } from "react-redux";
import style from "../Styles/timeline.module.css";

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

  if (status === 'loading') return <span>Loading...</span>;
  if (status === 'error') return <span>Error: {error.message}</span>;

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
    <div className={style.timelineContainer}>
      <NavBar showAdminInDropdown={windowWidth < 992} />
      <div className={style.contentWrapper}>
        {windowWidth >= 992 && (
          <div className={style.leftCol}>
            <CalendarWidget />
          </div>
        )}

        <div className={style.centerCol}>
          <Container className={style.postBox}>
            <form onSubmit={handlePost} className={style.postForm}>
              <Row className="align-items-start">
                <Col lg={1}>
                  <img src={userData?.profileImg} alt='Profile' className={style.avatar} />
                </Col>
                <Col lg={9}>
                  <textarea
                    name="text"
                    value={text}
                    onChange={handleChange}
                    className={style.textarea}
                    placeholder="What's happening?"
                  />
                </Col>
                <Col lg={2}>
                  {previewUrl && (
                    <img src={previewUrl} alt="preview" className={style.previewImage} />
                  )}
                </Col>
              </Row>
              <Row className="align-items-center justify-content-between">
                <Col xs={4}>
                  <label htmlFor='file-upload' className={style.mediaLabel}>
                    <FaImages /> Media
                  </label>
                  <input
                    id='file-upload'
                    name='image'
                    type='file'
                    className={style.mediaInput}
                    onChange={handleFileChange}
                  />
                </Col>
                <Col xs={3}>
                  <button type="submit" className={style.postButton}>Post</button>
                </Col>
              </Row>
            </form>
          </Container>

          {content}

          {isFetchingNextPage && (
            <div className="text-center my-3">
              <Spinner animation="border" variant="primary" />
              <p>Loading more posts...</p>
            </div>
          )}

          {allLoaded && (
            <div className="text-center my-3">
              <p className="text-muted">No more posts to load.</p>
            </div>
          )}
        </div>

        {windowWidth >= 992 && (
          <div className={style.rightCol}>
            <RandomQuote />
            {userData?.role === 'admin' && (
              <div className={style.adminLinkBox}>
                <Link to="/admin" className={style.adminButton}>
                  ⚙️ Gérer la plateforme
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {modalOpen && <Modal closeModal={() => setModalOpen(false)} postToModify={postToModify} />}
      {deleteModalOpen && <DeleteModal closeModal={() => setDeleteModalOpen(false)} postToDelete={postToDelete} />}
    </div>
  );
};

export default Timeline;
