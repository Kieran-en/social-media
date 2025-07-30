import React from 'react';
import { FaUsers, FaLayerGroup, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import styles from './adminPage.module.css';

const navItems = [
  { path: "/admin/users", icon: <FaUsers />, label: "Utilisateurs" },
  { path: "/admin/groups", icon: <FaLayerGroup />, label: "Groupes" },
  { path: "/admin/events", icon: <FaCalendarAlt />, label: "Événements" },
  { path: "/admin/stats", icon: <FaChartBar />, label: "Statistiques" },
];

function AdminSideNav() {
  return (
    <aside className={styles.sidebar}>
     
      <nav className={styles.navMenu}>
        {navItems.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSideNav;
