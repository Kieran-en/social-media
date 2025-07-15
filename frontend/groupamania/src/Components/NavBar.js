import React, { useEffect, useState } from 'react';
import { Navbar, Dropdown, Form } from 'react-bootstrap';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

// Icônes
import { FaHome, FaUser, FaDoorOpen, FaSearch } from "react-icons/fa";
import { MdOutlineMessage, MdNotifications } from "react-icons/md";

import styles from '../Styles/navbar.module.css';
import navImg from '../Images/EEC.png';
import { getCurrentUser, logout } from "../Services/userService";
import { deleteToken } from '../features/tokens/tokenSlice';

export default function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const user = getCurrentUser(); // va chercher token dans localStorage et décode
        setUserData(user);
    }, []);

    const handleLogout = () => {
      logout();
      dispatch(deleteToken());
      navigate("/");
    };

    if (!userData || !userData.username) {
        return null; // Ou un loader, ou navbar pour non connecté
    }

    return (
        <Navbar fixed="top" className={styles.navContainer}>
            {/* PARTIE GAUCHE */}
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

            {/* PARTIE DROITE */}
            <div className={styles.navRight}>
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
                        <Dropdown.Divider />
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
