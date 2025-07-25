import React, { useEffect, useState } from 'react';
import { Navbar, Dropdown, Form } from 'react-bootstrap';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

// Icons
import { FaHome, FaUser, FaDoorOpen, FaSearch } from "react-icons/fa";
import { MdOutlineMessage, MdNotifications } from "react-icons/md";
import { FiSettings } from "react-icons/fi"; // Admin icon

import styles from '../Styles/navbar.module.css';
import navImg from '../Images/EEC.png';
import { getCurrentUser, logout } from "../Services/userService";
import { deleteToken } from '../features/tokens/tokenSlice';

export default function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const user = getCurrentUser(); // Fetch user from token
        setUserData(user);
    }, []);

    const handleLogout = () => {
        logout();
        dispatch(deleteToken());
        navigate("/");
    };

    if (!userData || !userData.username) {
        return null; // Could add a loader or minimal navbar for guests
    }

    return (
        <Navbar fixed="top" className={styles.navContainer}>
            {/* LEFT SECTION */}
            <div className={styles.navLeft}>
                <NavLink to={`/timeline/${userData.username}`}>
                    <img src={navImg} className={styles.logo} alt='Logo Melen' />
                </NavLink>
                <div className={styles.searchBar}>
                    <FaSearch className={styles.searchIcon} />
                    <Form.Control 
                        type="text" 
                        placeholder="Rechercher sur Melen" 
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className={styles.navRight}>
                <NavLink to={`/timeline/${userData.username}`} className={styles.iconWrapper} title="Accueil">
                    <FaHome className={styles.navIcon} />
                </NavLink>
                <NavLink to="/messages" className={styles.iconWrapper} title="Messages">
                    <MdOutlineMessage className={styles.navIcon} />
                </NavLink>
                <NavLink to="/notifications" className={styles.iconWrapper} title="Notifications">
                    <MdNotifications className={styles.navIcon} />
                </NavLink>
                {/* Dropdown Menu */}
                <Dropdown align="end">
                    <Dropdown.Toggle id="dropdown-profile" bsPrefix={styles.dropdownToggle}>
                        <img src={userData.profileImg} alt="Profil" className={styles.profileImg} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className={styles.dropdownMenu}>
                        {/* Profile page */}
                        <Dropdown.Item onClick={() => navigate(`/profilepage/${userData.username}`)}>
                            <FaUser className={styles.dropdownIcon} />
                            <span>Voir le profil</span>
                        </Dropdown.Item>

                        {/* Admin link (only on small screens) */}
                        {userData.role === 'admin' && (
                            <Dropdown.Item 
                                onClick={() => navigate("/admin")} 
                                className="d-lg-none"
                            >
                                <FiSettings className={styles.dropdownIcon} />
                                <span>Gérer la plateforme</span>
                            </Dropdown.Item>
                        )}

                        <Dropdown.Divider />

                        {/* Logout */}
                        <Dropdown.Item onClick={handleLogout} className={styles.logoutItem}>
                            <FaDoorOpen className={styles.dropdownIcon} />
                            <span>Déconnexion</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Navbar>
    );
}
