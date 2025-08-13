import React from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-scroll"; // for smooth scrolling
import styles from '../Styles/nav.module.css';
import navImg from '../Images/EEC.png';

const Nav = () => {
    return (
        <nav className={styles.navContainer}>
            {/* Logo */}
            <NavLink to="/" className={styles.logoWrapper}>
                <img src={navImg} className={styles.logoImg} alt="Logo Melen" />
                <span className={styles.brandName}>Melen</span>
            </NavLink>

            {/* Navigation links */}
            <div className={styles.navLinks}>
                <Link
                    to="home"
                    smooth={true}
                    duration={500}
                    offset={-70} // adjust for navbar height
                    className={styles.navLink}
                >
                    Accueil
                </Link>
                <Link
                    to="about"
                    smooth={true}
                    duration={500}
                    offset={-70}
                    className={styles.navLink}
                >
                    À propos
                </Link>
                <Link
                    to="contacts"
                    smooth={true}
                    duration={500}
                    offset={-70}
                    className={styles.navLink}
                >
                    Contacts
                </Link>
            </div>

            {/* Auth actions */}
            <div className={styles.navActions}>
                <NavLink
                    to="/login"
                    end
                    className={({ isActive }) =>
                        `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                >
                    Se connecter
                </NavLink>

                <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                        `${styles.navButton} ${isActive ? styles.active : ''}`
                    }
                >
                    S'inscrire
                </NavLink>
            </div>
        </nav>
    );
};

export default Nav;
