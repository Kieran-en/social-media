import React from 'react'
import { FaUsers, FaLayerGroup, FaChartBar } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import styles from './adminPage.module.css';

function AdminSideNav() {
  return (
    <div>
         <aside className={styles.sidebar}>
                  {/* <h2 className={styles.menuTitle}>Admin</h2> */}
                  <NavLink to="/admin/users" className={styles.link}>
                    <FaUsers className={styles.icon} />
                    <span>Utilisateurs</span>
                  </NavLink>
                  <NavLink to="/admin/groups" className={styles.link}>
                    <FaLayerGroup className={styles.icon} />
                    <span>Groupes</span>
                  </NavLink>
                  <NavLink to="/admin/stats" className={styles.link}>
                    <FaChartBar className={styles.icon} />
                    <span>Statistiques</span>
                  </NavLink>
                </aside>
        
    </div>
  )
}

export default AdminSideNav