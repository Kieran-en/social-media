import React from "react";
import { Container, Row, Col, NavbarBrand } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Post from "../Components/Post";
import Modal from "../Components/Modal";
import DeleteModal from '../Components/DeleteModal';
import InfiniteScroll from 'react-infinite-scroll-component';
import style from '../Styles/timeline.module.css';
import {FaImages} from "react-icons/fa";
import { useState, useRef, useContext, useEffect } from "react";
import {useNavigate, useParams } from "react-router-dom";
import config from '../config.json'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { getPosts, createPost } from "../Services/postService";
import { getComments } from "../Services/commentService";
import { getCurrentUser, getUser, logout } from "../Services/userService";
import { AuthContext } from "../Context/AuthContext";
import NavBar from "../Components/NavBar";
import { useSelector } from "react-redux";

const Timeline = () => {
    const navigate = useNavigate();
    const token = useSelector(state => state.token)
   // const userData = useContext(AuthContext) 
   const userData = getCurrentUser(token)
    const [text, setText] = useState('');
    const [file, setFile] = useState();
    const postsRef = useRef([])
    const {ref, inView} = useInView();
    const {userlogged} = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [page , setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const queryClient = useQueryClient()

    /** 
    Intermediate variable to store the postId send from post inorder to transfer it as a prop to Modal Component
    This will enable the modal to send to the server the modification of a specific post 
    */
   const [postToModify, setPostToModify] = useState();
   const [postToDelete, setPostToDelete] = useState();
   const {username} = userData &&  userData
   const {userId} = userData && userData

   //const { status, data : posts, error } = useQuery('posts', () => getPosts(page))
   const {
    status,
    data : posts,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: 'posts',
    queryFn: getPosts,
    getNextPageParam: (lastPage, allPages) => {
      let nextPage = lastPage.length === 2 ? allPages.length + 1 : undefined;
      return nextPage;
    }
  })

  console.log(posts)

   const { status: commentStatus, data : comments, error: commentError } = useQuery('comments', getComments)
   const { status: userStatus, data : user, error: userError} = useQuery(['user'], () => getUser(username))
    
    const handleChange = (event) => {
        setText(event.target.value);
    }

    const handlePost = (event) => {
        event.preventDefault();
        const post = new FormData();
        post.append('text', text);
        post.append('image', file);
        post.append('userId', userId);

        mutation.mutate(post)
        setText('')
    }

    const mutation = useMutation(createPost, {
      onSuccess: () => {
        queryClient.invalidateQueries("posts")
      }
    })

    /**   const fetchPosts = async () => {
        const res = await fetch(`${config.apiEndpoint}/post?page=${page}`);
        const data = await res.json();
        return data;
      } */

/** 
    const fetchData = async () => {
        //Fetching new posts
        const postsFromServer = await fetchPosts();
         setPosts([...posts, ...postsFromServer]);

         if (postsFromServer.length === 0 || postsFromServer.length < 2){
            setHasMore(false)
         }

         setPage(prev => prev + 1);
      }*/

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    useEffect(() => {
      if (inView && hasNextPage) {
        fetchNextPage();
      }
    }, [inView, fetchNextPage, hasNextPage]);

    if (status === 'loading') {
      return <span>Loading...</span>
    }
  
    if (status === 'error') {
      return <span>Error: {error.message}</span>
    }


    const content =
    status === "success" &&
    posts.pages.map((page) =>
      page.map((post, i) => {
        if (page.length === i + 1) {
          return <Post 
          ref={ref}
          changeModalState={(specificPost) => {modalOpen ? setModalOpen(false)  :  
              setModalOpen(true)
              setPostToModify(specificPost)
          }}
          changeDeleteModalState={(specificPost) => {
              deleteModalOpen ? setDeleteModalOpen(false) : setDeleteModalOpen(true)
              setPostToDelete(specificPost)
          }}
          profileImg={post.User && post.User.profileImg}
          picture={post.imageUrl} 
          content={post.text} 
          likes={post.likes} 
          dislikes={post.dislikes} 
          username={post.User.name}
          key={post.id}
          postId={post.id} 
          userId={post.UserId}
          date={post.createdAt}
          userLoggedIn = {userlogged} 
          comments = {comments}/>
        } else {
          return <Post 
        changeModalState={(specificPost) => {modalOpen ? setModalOpen(false)  :  
            setModalOpen(true)
            setPostToModify(specificPost)
        }}
        changeDeleteModalState={(specificPost) => {
            deleteModalOpen ? setDeleteModalOpen(false) : setDeleteModalOpen(true)
            setPostToDelete(specificPost)
        }}
        profileImg={post.User && post.User.profileImg}
        picture={post.imageUrl} 
        content={post.text} 
        likes={post.likes} 
        dislikes={post.dislikes} 
        username={post.User.name}
        key={post.id}
        postId={post.id} 
        userId={post.UserId}
        date={post.createdAt}
        userLoggedIn = {userlogged} 
        comments = {comments}/>
        }
      })
    );


    return ( 
            <div style={{backgroundColor: '#18191A', height: '100%', flex: '1'}}>
        <NavBar />
        <Container className='shadow' 
        style={{backgroundColor: '#242526', 
        color: 'white', 
        marginTop: '20px', 
        borderRadius: '10px',
       }}>
            <form action={`${config.apiEndpoint}/post/`} method="post" encType="multipart/form-data" onSubmit={handlePost}
        style={{display: 'flex',
        flexDirection: 'column',
       }}>
              <Row className="mb-1 d-flex flex-column align-items-start">
              <Col lg={1} className=''><img src={userData && userData.profileImg} alt='Profile Image' style={{width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer'}}/></Col>
                <Col lg={9} className=''><textarea type='text' name="text" value={text} onChange={handleChange} className={style.textarea} placeholder="What's New!"></textarea></Col>
                <Col lg={2} className='d-flex justify-content-start'>
                 {file &&<img alt='preview-img' src={URL.createObjectURL(file)} style={{width: '100px', height: '100px', objectFit: 'cover'}}/>}
                </Col>
              </Row>
              <hr/>
              <Row className="mb-1 d-flex align-items-center justify-content-between">
                <Col xs={2} className = 'p-2 d-flex justify-content-center'>
                  <label htmlFor='file-uplaod' className={style.multimediaLabel}>Media  <FaImages /></label>
                    <input id='file-uplaod' name='image' type='file' className={style.multimediaInput} onChange={handleFileChange}></input>
                </Col>
                <Col xs={2} className = 'p-2 d-flex align-items-start'><button type="submit" className="btn" style={{backgroundColor: '#0F6E5A', color: 'white'}} onClick={getPosts}>Submit</button></Col>
              </Row>
            </form>

        </Container>

       {content}

        {modalOpen && <Modal 
        closeModal={() => {setModalOpen(false)}}
        postToModify={postToModify}
        />}

        {deleteModalOpen && 
        <DeleteModal 
        closeModal={() => {setDeleteModalOpen(false)}}
        postToDelete={postToDelete}
        />}

        </div>
        
    )
}

export default Timeline;