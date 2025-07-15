import React from 'react'
import NavBar from '../../Components/NavBar'
import AdminSideNav from './AdminSideNav'
import styles from './adminPage.module.css';

function Groups() {
  return (
    <div className={styles.adminContainer}>
      <NavBar />
      <div className={styles.bodyContainer}>
        <AdminSideNav />
      </div>
    </div>
  )
}

export default Groups