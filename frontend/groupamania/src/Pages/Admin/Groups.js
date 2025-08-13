import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar';
import AdminSideNav from './AdminSideNav';
import styles from './adminPage.module.css';
import { Button, Table, Modal, Form, Image, Dropdown, ButtonGroup } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { 
  getAllGroups, 
  createGroup, 
  updateGroup, 
  deleteGroup, 
  suspendGroup, 
  reactivateGroup 
} from '../../Services/groupService';
import { getAllUsers } from '../../Services/userAdminService';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [groupLeaders, setGroupLeaders] = useState([]);
  const [leaderId, setLeaderId] = useState('');

  useEffect(() => {
    fetchGroups();
    fetchGroupLeaders();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await getAllGroups();
      setGroups(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des groupes');
    }
  };

  const fetchGroupLeaders = async () => {
    try {
      const res = await getAllUsers();
       console.log("Tous les utilisateurs:", res.data);
      const leaders = res.data.filter(user => user.role === 'responsable_groupe');
       console.log("Leaders trouvés:", leaders);
      setGroupLeaders(leaders);
    } catch (err) {
      console.error('Erreur lors du chargement des responsables de groupe', err);
    }
  };

  const handleOpenModal = (group = null) => {
    setEditingGroup(group);
    setGroupName(group ? group.name : '');
    setGroupDescription(group ? group.description : '');
    setLeaderId(group?.leaderId || '');
    setProfileImg(null);
    setShowModal(true);
  };

  const handleSaveGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', groupName);
      formData.append('description', groupDescription);
      formData.append('leaderId', leaderId);
      if (profileImg) formData.append('profileImg', profileImg);

      if (editingGroup) {
        await updateGroup(editingGroup.id, formData);
      } else {
        await createGroup(formData);
      }

      setShowModal(false);
      setEditingGroup(null);
      setGroupName('');
      setGroupDescription('');
      setLeaderId('');
      setProfileImg(null);
      fetchGroups();
    } catch (err) {
      setError("Erreur lors de l'enregistrement du groupe");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendGroup = async (id) => {
    if (window.confirm("Voulez-vous suspendre ce groupe ?")) {
      await suspendGroup(id);
      fetchGroups();
    }
  };

  const handleReactivateGroup = async (id) => {
    if (window.confirm("Voulez-vous réactiver ce groupe ?")) {
      try {
        await reactivateGroup(id);
        fetchGroups();
      } catch (err) {
        setError("Erreur lors de la réactivation du groupe");
      }
    }
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce groupe ?")) {
      await deleteGroup(id);
      fetchGroups();
    }
  };

  return (
    <div className={styles.adminContainer}>
      <NavBar />
      <div className={styles.bodyContainer} style={{ flexDirection: 'row' }}>
        <AdminSideNav />
        <div style={{ flex: 1, padding: '20px' }}>
          <h2>Gestion des Groupes</h2>
          <Button onClick={() => handleOpenModal()} variant="primary" style={{ marginBottom: '15px' }}>
            Créer un groupe
          </Button>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Description</th>
                <th style={{ width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <tr key={group.id}>
                    <td>
                      <Image 
                        src={group.profileImg} 
                        rounded 
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{group.name}</td>
                    <td>{group.description}</td>
                    <td>
                      <Dropdown as={ButtonGroup} align="end">
                        <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${group.id}`}>
                          <ThreeDotsVertical />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleOpenModal(group)}>✏ Modifier</Dropdown.Item>
                          {group.isActive ? (
                            <Dropdown.Item onClick={() => handleSuspendGroup(group.id)}>⏸ Suspendre</Dropdown.Item>
                          ) : (
                            <Dropdown.Item onClick={() => handleReactivateGroup(group.id)} style={{ color: 'green' }}>
                              ▶ Réactiver
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item 
                            onClick={() => handleDeleteGroup(group.id)} 
                            style={{ color: 'red' }}
                          >
                            🗑 Supprimer
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Aucun groupe trouvé.</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Modal de création/modification */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Form onSubmit={handleSaveGroup}>
              <Modal.Header closeButton>
                <Modal.Title>{editingGroup ? 'Modifier le groupe' : 'Créer un groupe'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du groupe</Form.Label>
                  <Form.Control
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Responsable du groupe</Form.Label>
                  <Form.Select
                    value={leaderId}
                    onChange={(e) => setLeaderId(e.target.value)}
                    required
                  >
                    <option value="">-- Sélectionner un responsable --</option>
                    {groupLeaders.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Image de profil</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImg(e.target.files[0])}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Enregistrement...' : editingGroup ? 'Modifier' : 'Créer'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Groups;
