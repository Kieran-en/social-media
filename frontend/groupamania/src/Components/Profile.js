import React from "react";
import { ProfileStyle, Button } from "./styles/Profile.styled";
import {MdBorderColor} from "react-icons/md";
import { FaHome } from "react-icons/fa";
import style from '../Styles/profile.module.css';
import { Navbar, Dropdown } from "react-bootstrap";
import navStyle from '../Styles/navbar.module.css';
import { Col, NavbarBrand } from "react-bootstrap";
import {FaDoorOpen, FaUser} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import navImg2 from '../Images/icon-left-font-monochrome-white.png';
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';
import { getCurrentUser, logout } from "../Services/userService";

const Profile = ({email, profileImg, changeModalState, userlogged}) => {
    const navigate = useNavigate();
    const user = getCurrentUser()

    console.log(user)
  
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
                onClick={() => navigate(`/timeline/${userlogged}`) }>
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
        <Tooltip trigger="mouseenter" title="Change Profile Image" arrow="true" position="top"><img src={profileImg}
         alt="profile-image" className={style.profileImg}
         onClick={changeModalState}>
        </img>
        </Tooltip>
        </div>
        <hr className={style.hr}/>
        <div className={style.follow_section}>
            <div className={style.follow_box}>
                <span className={style.follow_text}>Followers</span>
                <span className={style.follow_count}>100</span>
            </div>
            <div className={style.follow_box}>
            <span className={style.follow_text}>Following</span>
            <span className={style.follow_count}>1</span>
            </div>
        </div>
        <button className={`${style.follow_button}`}>Follow</button>
        <div className={style.info}>
            <div>
                <span style={{fontSize: '18px'}}>Username: {userlogged} </span> 
                <Tooltip trigger="mouseenter" arrow="true" title="Change Username" position="top">
                    <MdBorderColor onClick={changeModalState} /></Tooltip></div>
            <div>
                <span style={{fontSize: '18px'}}>Email: {email} </span>
                <Tooltip trigger="mouseenter" arrow="true" title="Change Email" position="top">
                    <MdBorderColor onClick={changeModalState}/></Tooltip></div>
        </div>
        <div>
        </div>
    </ProfileStyle>
    </div>
    )
}

export default Profile;