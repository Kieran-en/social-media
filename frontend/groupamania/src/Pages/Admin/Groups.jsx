import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import styles from './adminPage.module.css';
import { Button, Table, Modal, Form, Image, Dropdown, ButtonGroup, Alert, Spinner } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { getAllGroups, createGroup, updateGroup, deleteGroup, suspendGroup, reactivateGroup } from '../../Services/groupService';
import { getAllUsers } from '../../Services/userAdminService';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [groupLeaders, setGroupLeaders] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [profileImg, setProfileImg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchGroups(); fetchLeaders(); }, []);

  const fetchGroups = async () => {
    setLoadingList(true);
    try {
      const res = await getAllGroups();
      setGroups(res.data || []);
      setError('');
    } catch {
      setError('Erreur lors du chargement des groupes');
    } finally {
      setLoadingList(false);
    }
  };

  const fetchLeaders = async () => {
    try {
      const res = await getAllUsers();
      setGroupLeaders((res.data || []).filter(u => u.role === 'responsable_groupe'));
    } catch { /* silencieux */ }
  };

  const handleOpenModal = (group = null) => {
    setEditingGroup(group);
    setGroupName(group?.name || '');
    setGroupDescription(group?.description || '');
    setLeaderId(group?.leaderId || '');
    setProfileImg(null);
    setShowModal(true);
  };

  const handleSaveGroup = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', groupName);
      formData.append('description', groupDescription);
      formData.append('leaderId', leaderId);
      if (profileImg) formData.append('profileImg', profileImg);

      if (editingGroup) await updateGroup(editingGroup.id, formData);
      else await createGroup(formData);

      setShowModal(false);
      setEditingGroup(null);
      setGroupName(''); setGroupDescription(''); setLeaderId(''); setProfileImg(null);
      fetchGroups();
    } catch {
      setError("Erreur lors de l'enregistrement du groupe");
    } finally {
      setSaving(false);
    }
  };

  const handleSuspendGroup = async (id) => {
    if (!window.confirm('Voulez-vous suspendre ce groupe ?')) return;
    await suspendGroup(id);
    fetchGroups();
  };

  const handleReactivateGroup = async (id) => {
    if (!window.confirm('Voulez-vous réactiver ce groupe ?')) return;
    try { await reactivateGroup(id); fetchGroups(); }
    catch { setError('Erreur lors de la réactivation du groupe'); }
  };

  const handleDeleteGroup = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce groupe ?')) return;
    await deleteGroup(id);
    fetchGroups();
  };

  return (
      <AdminLayout header={<h1 className={styles.title}>Gestion des Groupes</h1>}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button onClick={() => handleOpenModal()} variant="success" size="sm">Créer un groupe</Button>
        </div>

        <div className={styles.tableContainer}>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          {loadingList ? (
              <div className="d-flex align-items-center gap-2 p-3">
                <Spinner animation="border" size="sm" /><span>Chargement des groupes…</span>
              </div>
          ) : groups.length === 0 ? (
              <div className="p-4 text-center text-muted">
                Aucun groupe trouvé.<br />
                <Button variant="success" size="sm" className="mt-3" onClick={() => handleOpenModal()}>
                  Créer un groupe
                </Button>
              </div>
          ) : (
              <Table striped hover responsive>
                <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Description</th>
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {groups.map((g) => (
                    <tr key={g.id}>
                      <td>
                        <Image
                            src={g.profileImg || '/placeholder-group.png'}
                            alt={`Image du groupe ${g.name}`}
                            rounded
                            style={{ width: 52, height: 52, objectFit: 'cover' }}
                        />
                      </td>
                      <td>{g.name}</td>
                      <td>{g.description}</td>
                      <td>
                        <Dropdown as={ButtonGroup} align="end">
                          <Dropdown.Toggle variant="light" size="sm" aria-label={`Actions pour ${g.name}`}>
                            <ThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleOpenModal(g)}>✏ Modifier</Dropdown.Item>
                            {g.isActive ? (
                                <Dropdown.Item onClick={() => handleSuspendGroup(g.id)}>⏸ Suspendre</Dropdown.Item>
                            ) : (
                                <Dropdown.Item onClick={() => handleReactivateGroup(g.id)} className="text-success">
                                  ▶ Réactiver
                                </Dropdown.Item>
                            )}
                            <Dropdown.Item onClick={() => handleDeleteGroup(g.id)} className="text-danger">
                              🗑 Supprimer
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                ))}
                </tbody>
              </Table>
          )}
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Form onSubmit={handleSaveGroup}>
            <Modal.Header closeButton>
              <Modal.Title>{editingGroup ? 'Modifier le groupe' : 'Créer un groupe'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nom du groupe</Form.Label>
                <Form.Control type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Responsable du groupe</Form.Label>
                <Form.Select value={leaderId} onChange={(e) => setLeaderId(e.target.value)} required>
                  <option value="">-- Sélectionner un responsable --</option>
                  {groupLeaders.map((u) => (
                      <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Image de profil</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={(e) => setProfileImg(e.target.files?.[0] || null)} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button type="submit" variant="success" disabled={saving}>
                {saving ? 'Enregistrement…' : editingGroup ? 'Modifier' : 'Créer'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </AdminLayout>
  );
}
