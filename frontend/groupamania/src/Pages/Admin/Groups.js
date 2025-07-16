import React, { useState, useEffect } from 'react'
import NavBar from '../../Components/NavBar'
import AdminSideNav from './AdminSideNav'
import styles from './adminPage.module.css';
import { Button, Table, Modal, Form } from 'react-bootstrap'
import { getAllGroups, createGroup } from '../../Services/groupService' // Assure-toi que le chemin est bon

function Groups() {
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await getAllGroups();
      setGroups(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des groupes');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const ownerId = 1; // Remplacer par l'id de l'utilisateur admin connecté
      await createGroup({ name: groupName, description: groupDescription, ownerId });
      setShowModal(false);
      setGroupName('');
      setGroupDescription('');
      fetchGroups();
    } catch (err) {
      setError('Erreur lors de la création du groupe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <NavBar />
      <div className={styles.bodyContainer} style={{ flexDirection: 'row' }}>
        <AdminSideNav />
        <div style={{ flex: 1, padding: '20px' }}>
          <h2>Gestion des Groupes</h2>
          <Button onClick={() => setShowModal(true)} variant="primary" style={{ marginBottom: '15px' }}>
            Créer un groupe
          </Button>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Propriétaire</th>
              </tr>
            </thead>
            <tbody>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <tr key={group.id}>
                    <td>{group.name}</td>
                    <td>{group.description}</td>
                    <td>{group.ownerId}</td> {/* Ou afficher owner.username si join côté backend */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Aucun groupe trouvé.</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Modal création groupe */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Form onSubmit={handleCreateGroup}>
              <Modal.Header closeButton>
                <Modal.Title>Créer un groupe</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="formGroupName">
                  <Form.Label>Nom du groupe</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez le nom"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Entrez une description"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Création...' : 'Créer'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default Groups
