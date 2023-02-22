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
import http from '../services/httpService';
import { useEffect, useCallback } from "react";
import { getAccessToken } from "../accessToken";
import { CommentContext } from "../Context/CommentContext";
import config from '../config.json'

const Timeline = () => {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [file, setFile] = useState();
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const postsRef = useRef([])
    const {userlogged} = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [page , setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    /** 
    Intermediate varile to store the postId send from post inorder to transfer it as a prop to Modal Component
    This will enable the modal to send to the server the modification of a specific post 
    */
   const [postToModify, setPostToModify] = useState();
   const [postToDelete, setPostToDelete] = useState();
   const [userProfile, setUserProfile] = useState();

    const getUser = () => {
        http.get(`${config.apiEndpoint}/auth/${JSON.parse(localStorage.getItem('userData')).userId}`)
        .then(response => response.data)
        .then(user => setUserProfile(user.profileImg))
        .catch(err => console.log(err)) 
    }

    useEffect(() => {
        getUser()
    }, [])
    
    const handleChange = (event) => {
        setText(event.target.value);
    }


    const handlePost = (event) => {
        event.preventDefault();
        const post = new FormData();
        post.append('text', text)
        post.append('image', file);

           http.post(`${config.apiEndpoint}/post`, post)
            .then(res => {
                console.log(res)
                getPosts()
            })
            .catch(error => console.log(error)) 
    }

    const getPosts = async () => {
        const res = await fetch(`${config.apiEndpoint}/post?page=1`);
        const data = await res.json();
        setPosts([...data]);
        return data;
      }

      const fetchPosts = async () => {
        const res = await fetch(`${config.apiEndpoint}/post?page=${page}`);
        const data = await res.json();
        return data;
      } 
     
    useEffect(() => {
        getPosts();
      }, [])

      console.log(posts)

    const fetchData = async () => {
        //Fetching new posts
        const postsFromServer = await fetchPosts();
         setPosts([...posts, ...postsFromServer]);

         if (postsFromServer.length === 0 || postsFromServer.length < 2){
            setHasMore(false)
         }

         setPage(page + 1);
      }

    const getComments = useCallback(() => {
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
      }, [])  

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
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
        <Container className='shadow' style={{backgroundColor: '#242526', color: 'white', marginTop: '20px', borderRadius: '10px'}}>
            <form action={`${config.apiEndpoint}/post/`} method="post" encType="multipart/form-data" onSubmit={handlePost}>
            <Row className="p-2 mb-1 d-flex align-items-center">
                <Col xs={1} className = 'p-2'><img src={userProfile} alt='Profile Image' style={{width: '50px', height: '50px', borderRadius: '50%'}}/></Col>
                <Col xs={7} className = 'p-2'><input type='text' name="text" value={text} onChange={handleChange} className={style.textInput} placeholder="What's New!"></input></Col>
                <Col xs={2} className = 'p-2 d-flex justify-content-center'><label htmlFor='file-uplaod' className={style.multimediaLabel}>Media  <FaImages /></label>
                <input id='file-uplaod' name='image' type='file' className={style.multimediaInput} onChange={handleFileChange}></input></Col>
                <Col xs={2} className = 'p-2 d-flex align-items-start'><button type="submit" className="btn btn-danger " onClick={getPosts}>Submit</button></Col>
                </Row>
                </form>
        </Container>
        <CommentContext.Provider value={{comments, setComments}}>

         <InfiniteScroll
        dataLength={posts.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<h4 style={{color: 'white', textAlign: 'center'}}>Loading...</h4>}
        endMessage={
                     <p style={{ textAlign: 'center', color: 'white', fontSize: '16px'}}>
                      <b>Yay! You have seen it all</b>
                     </p>
                   }
        >
        {posts.map((post, id) => (
            <Post 
            changeModalState={(specificPost) => {modalOpen ? setModalOpen(false)  :  
                setModalOpen(true)
                setPostToModify(specificPost)
            }}
            changeDeleteModalState={(specificPost) => {
                deleteModalOpen ? setDeleteModalOpen(false) : setDeleteModalOpen(true)
                setPostToDelete(specificPost)
            }}
            profileImg={post.User.profileImg}
            picture={post.imageUrl} 
            content={post.text} 
            likes={post.likes} 
            dislikes={post.dislikes} 
            username={post.User.name}
            key={post.id}
            postId={post.id} 
            userId={post.UserId}
            date={post.createdAt}
            allComments = {getComments}
            userLoggedIn = {userlogged} />
        ))}
       </InfiniteScroll> 
        </CommentContext.Provider>

        {modalOpen && <Modal 
        closeModal={() => {setModalOpen(false)}}
        postToModify={postToModify}
        allPosts={getPosts}
        />}

        {deleteModalOpen && 
        <DeleteModal 
        closeModal={() => {setDeleteModalOpen(false)}}
        postToDelete={postToDelete}
        allPosts={getPosts}
        />}

        </div>
        
    )
}

export default Timeline;