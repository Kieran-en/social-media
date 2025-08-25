import React from 'react';
import AdminLayout from './AdminLayout';
import styles from './adminPage.module.css';

export default function Admin() {
    return (
        <AdminLayout header={<h1 className={styles.title}>Bienvenue Administrateur</h1>}>
            <section className={styles.welcomeCard}>
                <h2>Tableau de bord</h2>
                <p>Utilisez le menu à gauche pour gérer les utilisateurs, groupes, événements et statistiques.</p>
            </section>
        </AdminLayout>
    );
}
