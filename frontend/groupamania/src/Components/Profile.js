import React from "react";
import { ProfileStyle, Button } from "./styles/Profile.styled";
import {MdBorderColor} from "react-icons/md";
import style from '../Styles/profile.module.css';
import { RiPagesLine } from "react-icons/ri";
import { Navbar, Dropdown } from "react-bootstrap";
import navStyle from '../Styles/navbar.module.css';
import { Col, NavbarBrand } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import navImg2 from '../Images/icon-left-font-monochrome-white.png';
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';
import { useParams } from "react-router-dom";

const Profile = ({email, profileImg, changeModalState, userlogged}) => {
    const navigate = useNavigate();
  
    return (
    <div style={{backgroundColor: '#18191A'}}>
    <Navbar className="justify-content-between" style={{backgroundColor: '#242526'}}>
                <NavbarBrand>
                    <img src={navImg2} className={navStyle.img} alt='companyIcon'/>
                </NavbarBrand>
                <Col xs={2}>
        <Dropdown>
        <Dropdown.Toggle variant="danger" id="dropdown-basic">
          Account
         </Dropdown.Toggle>
        <Dropdown.Menu >
            <Dropdown.Item eventKey='profile' onClick={() => navigate(`/timeline/${userlogged}`) }>Timeline <RiPagesLine className="ml-5" /></Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
         </Col>
        </Navbar>
    <ProfileStyle>
        <h1>User Profile</h1>
        <div className={style.imageDiv}>
        <Tooltip trigger="mouseenter" title="Change Profile Image" arrow="true" position="top"><img src={profileImg} alt="profile-image" className={style.profileImg}></img></Tooltip>
        </div>
        <hr className={style.hr}/>
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
        <Button>Delete Account</Button>
        <Button onClick={() => navigate("/login") }>LogOut</Button>
        </div>
    </ProfileStyle>
    </div>
    )
}

export default Profile;