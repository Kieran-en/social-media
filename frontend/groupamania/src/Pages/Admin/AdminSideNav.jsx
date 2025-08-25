import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaLayerGroup, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import styles from './adminPage.module.css';

const navItems = [
    { path: '/admin/users',  icon: <FaUsers />,      label: 'Utilisateurs' },
    { path: '/admin/groups', icon: <FaLayerGroup />, label: 'Groupes' },
    { path: '/admin/events', icon: <FaCalendarAlt />,label: 'Événements' },
    { path: '/admin/stats',  icon: <FaChartBar />,   label: 'Statistiques' },
];

export default function AdminSideNav() {
    return (
        <aside className={styles.sidebar} aria-label="Menu d'administration">
            <div className={styles.logoContainer}>
                <div className={styles.logo}>AD</div>
            </div>

            <div className={styles.menuSection}>
                <div className={styles.menuHeading}>Navigation</div>
                <nav className={styles.navMenu}>
                    {navItems.map(({ path, icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end
                            className={({ isActive }) => [styles.link, isActive ? styles.linkActive : ''].join(' ')}
                        >
              <span className={styles.icon} aria-hidden>
                {icon}
              </span>
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
