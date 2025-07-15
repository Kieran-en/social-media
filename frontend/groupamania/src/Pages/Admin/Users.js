import React, { useEffect, useState } from 'react';
import NavBar from '../../Components/NavBar';
import AdminSideNav from './AdminSideNav';
import styles from './adminPage.module.css';
import { getAllUsers, suspendUser, reactivateUser, deleteUser } from '../../Services/userAdminService';
import { Button, Table } from 'react-bootstrap';

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  try {
    const res = await getAllUsers();
    console.log("Réponse API :", res);
    setUsers(res.data);
  } catch (err) {
    // 🔍 Affiche le détail de l'erreur (axios error par ex.)
    if (err.response) {
      console.error("Erreur backend :", err.response.data);
      console.error("Code HTTP :", err.response.status);
    } else if (err.request) {
      console.error("Pas de réponse du serveur :", err.request);
    } else {
      console.error("Erreur autre :", err.message);
    }
  }
};

  const handleSuspend = async (id) => {
    await suspendUser(id);
    fetchUsers();
  };

  const handleReactivate = async (id) => {
    await reactivateUser(id);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  return (
    <div className={styles.adminContainer}>
      <NavBar />
      <div className={styles.bodyContainer}>
        <AdminSideNav />
        <div style={{ padding: '20px', flex: 1 }}>
          <h2>Liste des utilisateurs</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.isActive ? (
                      <span style={{ color: 'green' }}>Actif</span>
                    ) : (
                      <span style={{ color: 'red' }}>Suspendu</span>
                    )}
                  </td>
                  <td>
                    {user.isActive ? (
                      <Button variant="warning" size="sm" onClick={() => handleSuspend(user.id)}>
                        Suspendre
                      </Button>
                    ) : (
                      <Button variant="success" size="sm" onClick={() => handleReactivate(user.id)}>
                        Réactiver
                      </Button>
                    )}{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
