import React from "react";
import { NavLink } from "react-router-dom";
import styles from '../Styles/nav.module.css';
import navImg from '../Images/EEC.png';

const Nav = () => {
    return (
        <nav className={styles.navContainer}>
            <NavLink to="/" className={styles.logoWrapper}>
                <img src={navImg} className={styles.logoImg} alt="Logo Melen" />
                <span className={styles.brandName}>Melen</span>
            </NavLink>

            <div className={styles.navActions}>
                <NavLink
                    to="/"
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
