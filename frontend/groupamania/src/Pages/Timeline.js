import React from "react";
import { Container, Row, Col, NavbarBrand } from "react-bootstrap";
import { Navbar, Dropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import navImg2 from '../Images/icon-left-font-monochrome-white.png';
import Post from "../Components/Post";
import Modal from "../Components/Modal";
import DeleteModal from '../Components/DeleteModal';
import InfiniteScroll from 'react-infinite-scroll-component';
import style from '../Styles/timeline.module.css';
import navStyle from '../Styles/navbar.module.css';
import {FaDoorOpen, FaImages, FaUser} from "react-icons/fa";
import { useState, useRef } from "react";
import {useNavigate, useParams } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { CommentContext } from "../Context/CommentContext";
import config from '../config.json'
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getPosts, createPost, modifyPost, deletePost } from "../Services/postService";
import { getComments, createComment, modifyComment, deleteComment } from "../Services/commentService";
import { getUser, signup, modifyUser, login } from "../Services/userService";

const Timeline = () => {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [file, setFile] = useState();
   // const [comments, setComments] = useState([]);
    const postsRef = useRef([])
    const {userlogged} = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [page , setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const queryClient = useQueryClient()
    /** 
    Intermediate varile to store the postId send from post inorder to transfer it as a prop to Modal Component
    This will enable the modal to send to the server the modification of a specific post 
    */
   const [postToModify, setPostToModify] = useState();
   const [postToDelete, setPostToDelete] = useState();
   const userId = JSON.parse(localStorage.getItem('userData')).userId

   const { status, data : posts, error } = useQuery('posts', getPosts)
   const { status: commentStatus, data : comments, error: commentError } = useQuery('comments', getComments)
   const { status: userStatus, data : user, error: userError} = useQuery(['user', userId], () => getUser(userId))

    
    const handleChange = (event) => {
        setText(event.target.value);
    }

    const handlePost = (event) => {
        event.preventDefault();
        const post = new FormData();
        post.append('text', text)
        post.append('image', file);

        mutation.mutate(post)
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

   /**  const getComments = useCallback(() => {
        fetch(`${config.apiEndpoint}/comment`)
        .then(response =>response.json())
        .then(data => {
            setComments([...data])
        })
        .catch(err => {
            console.log(err);
        });
      }, [])

    useEffect(() => {
        getComments();
      }, [])  */

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    if (status === 'loading') {
      return <span>Loading...</span>
    }
  
    if (status === 'error') {
      return <span>Error: {error.message}</span>
    }

    return ( 
            <div style={{backgroundColor: '#18191A', height: '100%'}}>
        <Navbar className="justify-content-between" style={{backgroundColor: '#242526', borderRadius: '10px'}}>
                <NavbarBrand>
                    <img src={navImg2} className={navStyle.img} alt='companyIcon'/>
                </NavbarBrand>
                <Col xs={2}>
        <Dropdown>
        <Dropdown.Toggle variant="danger" id="dropdown-basic">
          Account
         </Dropdown.Toggle>
        <Dropdown.Menu >
            <Dropdown.Item eventKey='logout' onClick={() => navigate("/Login")}>LogOut <FaDoorOpen className="ml-5"/></Dropdown.Item>
            <Dropdown.Item eventKey='profile' onClick={() => navigate(`/profilepage/${userlogged}`)  }>Visit Profile <FaUser className="ml-5" /></Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
         </Col>
        </Navbar>
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
              <Col lg={1} className=''><img src={user && user.profileImg} alt='Profile Image' style={{width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer'}}/></Col>
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
                <Col xs={2} className = 'p-2 d-flex align-items-start'><button type="submit" className="btn btn-danger " onClick={getPosts}>Submit</button></Col>
              </Row>
            </form>

        </Container>
        {/**<CommentContext.Provider value={comments}> */}

         {/** <InfiniteScroll
        dataLength={2}
        next={fetchData}
        hasMore={hasMore}
        loader={<h4 style={{color: 'white', textAlign: 'center'}}>Loading...</h4>}
        endMessage={
                     <p style={{ textAlign: 'center', color: 'white', fontSize: '16px'}}>
                      <b>Yay! You have seen it all</b>
                     </p>
                   }
        >
       </InfiniteScroll> */}

       {posts && posts.map((post) => (
            <Post 
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
        ))} 
        {/**</CommentContext.Provider> */}

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