import React, { useEffect, useState } from 'react';
import { Navbar, Dropdown, Nav, Form, Offcanvas } from 'react-bootstrap';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import { FaHome, FaUser, FaDoorOpen, FaSearch } from "react-icons/fa";
import { MdOutlineMessage, MdNotifications } from "react-icons/md";

import styles from '../Styles/navbar.module.css';
import navImg from '../Images/EEC.png';
import { getCurrentUser, logout } from "../Services/userService";
import { deleteToken } from '../features/tokens/tokenSlice';
import { clearConversation } from '../features/conversations/conversationSlice';

export default function NavBar({ showAdminInDropdown = false }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const conversation = useSelector(state => state.conversation);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const user = getCurrentUser();
        setUserData(user);
    }, []);

    useEffect(() => {
        if (!userData) return;

        const socket = io("http://localhost:5500");

        socket.emit("addUser", {
            userId: userData.id,
            username: userData.username,
            profileImg: userData.profileImg
        });

        socket.on("newNotification", notif => {
            setNotifications(prev => [notif, ...prev]);
        });

        return () => socket.disconnect();
    }, [userData]);

    const handleLogout = () => {
        logout();
        dispatch(deleteToken());
        navigate("/login");
    };

    const isMobile = window.innerWidth <= 768;
    const showBackButton = isMobile && conversation?.id;

    if (!userData || !userData.username) return null;

    return (
        <>
            <Navbar fixed="top" className={styles.navContainer}>
                {/* LEFT SIDE */}
                <div className={styles.navLeft}>
                    {showBackButton && (
                        <button onClick={() => dispatch(clearConversation())} className={styles.backButton}>
                            &lt;
                        </button>
                    )}
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

                    <NavLink to="/notifications" className={styles.iconWrapper} title="Notifications">
                        <MdNotifications className={styles.navIcon} />
                        {unreadCount > 0 && (
                            <span className={styles.badge}>{unreadCount}</span>
                        )}
                    </NavLink>

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
                        <Nav.Link onClick={() => navigate('/notifications')}>
                            Notifications
                            {unreadCount > 0 && (
                                <span className={styles.badge} style={{ marginLeft: "5px" }}>{unreadCount}</span>
                            )}
                        </Nav.Link>
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
