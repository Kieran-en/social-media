import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import styles from './adminPage.module.css';
import { getAllUsers, suspendUser, reactivateUser, deleteUser, renameUser } from '../../Services/userAdminService';
import { Button, Table, Dropdown, ButtonGroup, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { ThreeDotsVertical, PersonPlus } from 'react-bootstrap-icons';
import CreateUserModal from '../../Components/CreateUserModal';
import { useSelector } from 'react-redux';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState('');

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('user');
  const [savingRole, setSavingRole] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Récupérer le rôle de l'utilisateur connecté
  const token = useSelector(state => state.token);
  const currentUserRole = token ? JSON.parse(atob(token.split('.')[1])).role : 'user';

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoadingList(true);
    try {
      const res = await getAllUsers();
      console.log('📥 Réponse API Users:', res);
      setUsers(res.data || []);
      setError('');
    } catch (err) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoadingList(false);
    }
  };

  const handleSuspend = async (id) => { await suspendUser(id); fetchUsers(); };
  const handleReactivate = async (id) => { await reactivateUser(id); fetchUsers(); };
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de l\'utilisateur. Veuillez réessayer.');
    }
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

  const handleUserCreated = () => {
    fetchUsers(); // Rafraîchir la liste des utilisateurs
  };

  return (
      <AdminLayout header={
        <div className="d-flex justify-content-between align-items-center">
          <h1 className={styles.title}>Liste des utilisateurs</h1>
          {currentUserRole === 'diacre' && (
            <Button 
              variant="success" 
              onClick={() => setShowCreateModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <PersonPlus size={20} />
              Ajouter un utilisateur
            </Button>
          )}
        </div>
      }>
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
                <option value="user">👤 Fidèle</option>
                <option value="diacre">⛪ Diacre</option>
                <option value="responsable_groupe">👥 Responsable de groupe</option>
                {/* Option "admin" supprimée pour éviter la prolifération des comptes administrateurs */}
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

        {/* Modal de création d'utilisateur */}
        <CreateUserModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onUserCreated={handleUserCreated}
          currentUserRole={currentUserRole}
        />
      </AdminLayout>
  );
}
