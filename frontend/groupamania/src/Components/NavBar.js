import React, { useEffect, useState } from 'react';
import { Navbar, Dropdown, Nav, Form, Offcanvas } from 'react-bootstrap';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

import { FaHome, FaUser, FaDoorOpen, FaSearch } from "react-icons/fa";
import { MdOutlineMessage, MdNotifications } from "react-icons/md";

import styles from '../Styles/navbar.module.css';
import navImg from '../Images/EEC.png';
import { getCurrentUser, logout } from "../Services/userService";
import { deleteToken } from '../features/tokens/tokenSlice';

export default function NavBar({ showAdminInDropdown = false }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const user = getCurrentUser();
        setUserData(user);
    }, []);

    const handleLogout = () => {
        logout();
        dispatch(deleteToken());
        navigate("/");
    };

    if (!userData || !userData.username) return null;

    return (
        <>
            <Navbar fixed="top" className={styles.navContainer}>
                {/* LEFT SIDE */}
                <div className={styles.navLeft}>
                    <NavLink to={`/timeline/${userData.username}`}>
                        <img src={navImg} className={styles.logo} alt='Logo Melen' />
                    </NavLink>
                </div>

                {/* DESKTOP SEARCH BAR */}
                <div className={`${styles.searchBar} d-none d-md-flex`}>
                    <FaSearch className={styles.searchIcon} />
                    <Form.Control 
                        type="text" 
                        placeholder="Rechercher sur Melen" 
                        className={styles.searchInput}
                    />
                </div>

                {/* RIGHT SIDE (desktop icons) */}
                <div className={`${styles.navRight} d-none d-md-flex`}>
                    <NavLink to={`/timeline/${userData.username}`} className={styles.iconWrapper} title="Accueil">
                        <FaHome className={styles.navIcon} />
                    </NavLink>
                    <NavLink to="/messages" className={styles.iconWrapper} title="Messages">
                        <MdOutlineMessage className={styles.navIcon} />
                    </NavLink>
                    <div className={styles.iconWrapper} title="Notifications">
                        <MdNotifications className={styles.navIcon} />
                    </div>

                    <Dropdown align="end">
                        <Dropdown.Toggle id="dropdown-profile" bsPrefix={styles.dropdownToggle}>
                            <img src={userData.profileImg} alt="Profil" className={styles.profileImg} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={styles.dropdownMenu}>
                            <Dropdown.Item onClick={() => navigate(`/profilepage/${userData.username}`)}>
                                <FaUser className={styles.dropdownIcon} />
                                <span>Voir le profil</span>
                            </Dropdown.Item>

                            {userData.role === 'admin' && showAdminInDropdown && (
                                <Dropdown.Item onClick={() => navigate('/admin')}>
                                    <i className="bi bi-gear"></i>
                                    <span>Gérer la plateforme</span>
                                </Dropdown.Item>
                            )}

                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout} className={styles.logoutItem}>
                                <FaDoorOpen className={styles.dropdownIcon} />
                                <span>Déconnexion</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/* MOBILE HAMBURGER */}
                <button className={styles.hamburgerButton} onClick={() => setShowMenu(true)}>
                    ☰
                </button>
            </Navbar>

            {/* OFFCANVAS MENU FOR MOBILE */}
            <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {/* Search bar in mobile menu */}
                    <div className={styles.mobileSearchBar}>
                        <FaSearch className={styles.searchIcon} />
                        <Form.Control 
                            type="text" 
                            placeholder="Rechercher sur Melen" 
                            className={styles.searchInput}
                        />
                    </div>
                    <Nav className="flex-column mt-3">
                        <Nav.Link onClick={() => navigate(`/timeline/${userData.username}`)}>Accueil</Nav.Link>
                        <Nav.Link onClick={() => navigate('/messages')}>Messages</Nav.Link>
                        <Nav.Link onClick={() => navigate('/notifications')}>Notifications</Nav.Link>

                        {userData.role === 'admin' && (
                            <Nav.Link onClick={() => navigate('/admin')}>Gérer la plateforme</Nav.Link>
                        )}

                        <Nav.Link onClick={() => navigate(`/profilepage/${userData.username}`)}>Voir le profil</Nav.Link>
                        <Nav.Link onClick={handleLogout}>Déconnexion</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
