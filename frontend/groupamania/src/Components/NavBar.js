import React, {useContext} from 'react'
import { Row, Col, NavbarBrand } from "react-bootstrap";
import { Navbar, Dropdown } from "react-bootstrap";
import navImg2 from '../Images/icon-left-font-monochrome-white.png';
import navStyle from '../Styles/navbar.module.css';
import { getCurrentUser, logout } from "../Services/userService";
import { deleteToken } from '../features/tokens/tokenSlice';
import {useNavigate, useParams} from "react-router-dom";
import {FaDoorOpen, FaImages, FaUser} from "react-icons/fa";
import { MdOutlineMessage, MdNotifications } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';

export default function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {userlogged} = useParams();
    const token = useSelector(state => state.token)
    const userData = getCurrentUser(token)
    const profileImg = userData.profileImg
    
  return (
    <div>
        <Navbar className="justify-content-between px-3" style={{backgroundColor: '#242526', borderRadius: '10px'}}>
                <NavbarBrand>
                    <img src={navImg2} className={navStyle.img} alt='companyIcon'/>
                </NavbarBrand>
                <Row>
                <Col className='d-flex align-items-center gap-3'>
                {userlogged ? <MdOutlineMessage className={navStyle.icons} onClick={() => navigate('/messages')} />
                : <FaHome onClick={() => navigate(`/timeline/${userData.username}`)} className={navStyle.icons}/> }
                <MdNotifications className={navStyle.icons}/>
        <Dropdown>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          <img src={profileImg} alt="profile-image" className={navStyle.profileImg}/>
         </Dropdown.Toggle>
        <Dropdown.Menu >
            <Dropdown.Item eventKey='logout' onClick={() => {
              logout()
              dispatch(deleteToken)
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
