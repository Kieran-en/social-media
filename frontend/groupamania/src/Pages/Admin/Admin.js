import React from 'react';
import { NavLink } from 'react-router-dom';
import NavBar from '../../Components/NavBar';
import styles from './adminPage.module.css';
import AdminSideNav from './AdminSideNav';

function Admin() {
  return (
    <div className={styles.adminContainer}>
      <NavBar />

      <div className={styles.bodyContainer}>
        {/* Menu vertical gauche */}
        <AdminSideNav />

        {/* Contenu principal */}
        <main className={styles.mainContent}>
  <h1 className={styles.title}>Bienvenue Administrateur</h1>
</main>
      </div>
    </div>
  );
}

export default Admin;
