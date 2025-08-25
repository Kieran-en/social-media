import React from 'react';
import NavBar from '../../Components/NavBar';
import AdminSideNav from './AdminSideNav';
import styles from './adminPage.module.css';

export default function AdminLayout({ header, children }) {
    return (
        <div className={styles.adminContainer}>
            <NavBar />
            <div className={styles.bodyContainer}>
                <AdminSideNav />
                <main className={styles.mainContent}>
                    {header && <div className={styles.contentHeader}>{header}</div>}
                    {children}
                </main>
            </div>
        </div>
    );
}
