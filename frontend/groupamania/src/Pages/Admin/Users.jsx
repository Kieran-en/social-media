import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import styles from './adminPage.module.css';
import { getAllUsers, suspendUser, reactivateUser, deleteUser, renameUser } from '../../Services/userAdminService';
import { Button, Table, Dropdown, ButtonGroup, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState('');

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('user');
  const [savingRole, setSavingRole] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoadingList(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoadingList(false);
    }
  };

  const handleSuspend = async (id) => { await suspendUser(id); fetchUsers(); };
  const handleReactivate = async (id) => { await reactivateUser(id); fetchUsers(); };
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    await deleteUser(id); fetchUsers();
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || 'user');
    setShowRoleModal(true);
  };

  const handleRoleSubmit = async () => {
    setSavingRole(true);
    try {
      await renameUser(selectedUser.id, newRole);
      setShowRoleModal(false);
      fetchUsers();
    } catch {
      setError('Erreur lors de la mise à jour du rôle');
    } finally {
      setSavingRole(false);
    }
  };

  return (
      <AdminLayout header={<h1 className={styles.title}>Liste des utilisateurs</h1>}>
        <div className={styles.tableContainer}>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          {loadingList ? (
              <div className="d-flex align-items-center gap-2 p-3">
                <Spinner animation="border" size="sm" /><span>Chargement des utilisateurs…</span>
              </div>
          ) : users.length === 0 ? (
              <div className="p-4 text-center text-muted">Aucun utilisateur.</div>
          ) : (
              <Table striped hover responsive>
                <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th style={{ width: 130 }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.isActive ? <span className={styles.badgeOk}>Actif</span> : <span className={styles.badgeCanceled}>Suspendu</span>}</td>
                      <td>
                        <Dropdown as={ButtonGroup} align="end">
                          <Dropdown.Toggle variant="light" size="sm" aria-label={`Actions pour ${u.name}`}>
                            <ThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => openRoleModal(u)}>🏷 Nommer</Dropdown.Item>
                            <Dropdown.Divider />
                            {u.isActive ? (
                                <Dropdown.Item onClick={() => handleSuspend(u.id)}>⏸ Suspendre</Dropdown.Item>
                            ) : (
                                <Dropdown.Item onClick={() => handleReactivate(u.id)}>▶ Réactiver</Dropdown.Item>
                            )}
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => handleDelete(u.id)} className="text-danger">🗑 Supprimer</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                ))}
                </tbody>
              </Table>
          )}
        </div>

        <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
          <Modal.Header closeButton><Modal.Title>Nommer un utilisateur</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formRoleSelect">
              <Form.Label>Choisissez un nouveau rôle pour {selectedUser?.name} :</Form.Label>
              <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="user">Utilisateur</option>
                <option value="diacre">Diacre</option>
                <option value="responsable_groupe">Responsable de groupe</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowRoleModal(false)}>Annuler</Button>
            <Button variant="success" onClick={handleRoleSubmit} disabled={savingRole}>
              {savingRole ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </Modal.Footer>
        </Modal>
      </AdminLayout>
  );
}
