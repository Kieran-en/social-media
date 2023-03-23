import React, { useContext } from "react";
import { ProfileStyle, Button } from "./styles/Profile.styled";
import {MdBorderColor} from "react-icons/md";
import { FaHome } from "react-icons/fa";
import style from '../Styles/profile.module.css';
import { Navbar, Dropdown } from "react-bootstrap";
import navStyle from '../Styles/navbar.module.css';
import { Col, NavbarBrand } from "react-bootstrap";
import {FaDoorOpen, FaUser} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import navImg2 from '../Images/icon-left-font-monochrome-white.png';
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';
import { follow, getFollowingCount, logout } from "../Services/userService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthContext } from "../Context/AuthContext";

const Profile = ({email, profileImg, changeModalState, username, followers, following}) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {user} = useParams()
    const userData = useContext(AuthContext)
    const userProfileName = userData.username
    //const {data: followCount} = useQuery('followCount', () => getFollowingCount())

    const followMutation = useMutation(follow, {
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries('followCount'),
            queryClient.invalidateQueries('isPostLiked')
        ]) 
    })

    console.log(username, userProfileName)

    /** const handleFollow = () => {
        if (!(followCount > 0)){

            followMutation.mutate({
                follow: 1,
                following_user_id: 'postId',
                followed_user_id: 'userData.userId'
            })

        } else {
            followMutation.mutate({
                follow: 0,
                postId: 'postId',
                userId: 'serData.userId'
            })
        }
    } */
 
    
    return (
    <div style={{backgroundColor: '#18191A'}}>
    <Navbar className="justify-content-between p-3" style={{backgroundColor: '#242526'}}>
                <NavbarBrand>
                    <img src={navImg2} className={navStyle.img} alt='companyIcon'/>
                </NavbarBrand>
                <div style={{display: 'flex',justifyContent: 'space-between' , 
                alignItems: 'center',  gap: '10px'}}>
                <Col
                style={{color: 'white', fontSize: '1.2rem', 
                cursor: 'pointer', display: 'flex', 
                gap: '0.3rem', alignItems: 'center'
            }} 
                onClick={() =>  navigate(`/timeline/${userProfileName}`) }>
                    Timeline<FaHome />
         </Col>
         <Col> 
         <Dropdown>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          <img src={profileImg} alt="profile-image" className={navStyle.profileImg}/>
         </Dropdown.Toggle>
        <Dropdown.Menu >
            <Dropdown.Item eventKey='logout' onClick={() => {
              logout()
              navigate("/Login")
              }}>LogOut <FaDoorOpen className="ml-5"/></Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
         </Col>
         </div>
        </Navbar>
    <ProfileStyle>
        <h1>User Profile</h1>
        <div className={style.imageDiv}>
        {username == userProfileName ?
        <Tooltip trigger="mouseenter" title="Change Profile Image" arrow="true" position="top"><img src={profileImg}
         alt="profile-image" className={style.profileImg}
         onClick={changeModalState}>
        </img>
        </Tooltip> :
        <img src={profileImg}
        alt="profile-image" className={style.profileImg}>
       </img>
        }
        </div>
        <hr className={style.hr}/>
        <div className={style.follow_section}>
            <div className={style.follow_box}>
                <span className={style.follow_text}>Followers</span>
                <span className={style.follow_count}>{followers}</span>
            </div>
            <div className={style.follow_box}>
            <span className={style.follow_text}>Following</span>
            <span className={style.follow_count}>{following}</span>
            </div>
        </div>
        <button className={`${style.follow_button}`}>Follow</button>
        <div className={style.info}>
            <div>
                <span style={{fontSize: '18px'}}>Username: {username} </span> 
                {username == userProfileName && <Tooltip trigger="mouseenter" arrow="true" title="Change Username" position="top">
                    <MdBorderColor onClick={changeModalState} /></Tooltip>}
                    </div>
            <div>
                <span style={{fontSize: '18px'}}>Email: {email} </span>
                {username == userProfileName && <Tooltip trigger="mouseenter" arrow="true" title="Change Email" position="top">
                    <MdBorderColor onClick={changeModalState}/></Tooltip>}
                    </div>
        </div>
        <div>
        </div>
    </ProfileStyle>
    </div>
    )
}

export default Profile;