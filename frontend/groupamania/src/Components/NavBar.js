import React from 'react'
import { Row, Col, NavbarBrand } from "react-bootstrap";
import { Navbar, Dropdown } from "react-bootstrap";
import navImg2 from '../Images/icon-left-font-monochrome-white.png';
import navStyle from '../Styles/navbar.module.css';
import { getCurrentUser, logout } from "../Services/userService";
import {useNavigate, useParams} from "react-router-dom";
import {FaDoorOpen, FaImages, FaUser} from "react-icons/fa";
import { MdOutlineMessage, MdNotifications } from "react-icons/md";

export default function NavBar() {
    const navigate = useNavigate();
    const {userlogged} = useParams();
    const user = getCurrentUser();
    const profileImg = user.profileImg
    console.log(user)

  return (
    <div>
        <Navbar className="justify-content-between p-3" style={{backgroundColor: '#242526', borderRadius: '10px'}}>
                <NavbarBrand>
                    <img src={navImg2} className={navStyle.img} alt='companyIcon'/>
                </NavbarBrand>
                <Row>
                <Col className='d-flex align-items-center gap-3'>
                <MdOutlineMessage className={navStyle.icons} />
                <MdNotifications className={navStyle.icons}/>
        <Dropdown>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          <img src={profileImg} alt="profile-image" className={navStyle.profileImg}/>
         </Dropdown.Toggle>
        <Dropdown.Menu >
            <Dropdown.Item eventKey='logout' onClick={() => {
              logout()
              navigate("/Login")
              }}>LogOut <FaDoorOpen className="ml-5"/></Dropdown.Item>
            <Dropdown.Item eventKey='profile' onClick={() => navigate(`/profilepage/${userlogged}`)  }>Visit Profile <FaUser className="ml-5" /></Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
         </Col>
                </Row>       
        </Navbar>
    </div>
  )
}
