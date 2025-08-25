import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import styles from './adminPage.module.css';
import { Button, Table, Modal, Form, Dropdown, ButtonGroup, Spinner, Alert } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../../Services/eventService';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('OK');
  const [saving, setSaving] = useState(false);

  const formatDate = (value) =>
      new Date(value).toLocaleString('fr-FR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoadingList(true);
    try {
      const res = await getAllEvents();
      setEvents(res.data || []);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des événements');
    } finally {
      setLoadingList(false);
    }
  };

  const handleOpenModal = (event = null) => {
    setEditingEvent(event);
    setTitle(event?.title || '');
    setDescription(event?.description || '');
    setDate(event ? new Date(event.date).toISOString().substring(0, 16) : '');
    setLocation(event?.location || '');
    setState(event?.state || 'OK');
    setShowModal(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { title, description, date, location, state };
      if (editingEvent) {
        await updateEvent(editingEvent.id, data);
      } else {
        await createEvent(data);
      }
      setShowModal(false);
      setEditingEvent(null);
      await fetchEvents();
    } catch {
      setError("Erreur lors de l'enregistrement de l'événement");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet événement ?')) return;
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch {
      setError('Erreur lors de la suppression de l’événement');
    }
  };

  const handleToggleState = async (event) => {
    try {
      const updatedState = event.state === 'OK' ? 'CANCELED' : 'OK';
      await updateEvent(event.id, { ...event, state: updatedState });
      fetchEvents();
    } catch {
      setError("Erreur lors du changement d'état");
    }
  };

  return (
      <AdminLayout header={<h1 className={styles.title}>Gestion des Événements</h1>}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button onClick={() => handleOpenModal()} variant="success" size="sm">
            Créer un événement
          </Button>
        </div>

        <div className={styles.tableContainer}>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          {loadingList ? (
              <div className="d-flex align-items-center gap-2 p-3">
                <Spinner animation="border" size="sm" /><span>Chargement des événements…</span>
              </div>
          ) : events.length === 0 ? (
              <div className="p-4 text-center text-muted">
                Aucun événement trouvé.<br />
                <Button variant="success" size="sm" className="mt-3" onClick={() => handleOpenModal()}>
                  Créer un événement
                </Button>
              </div>
          ) : (
              <Table striped hover responsive>
                <thead>
                <tr>
                  <th>Titre</th>
                  <th>Date</th>
                  <th>Lieu</th>
                  <th>Statut</th>
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {events.map((ev) => (
                    <tr key={ev.id}>
                      <td>{ev.title}</td>
                      <td>{formatDate(ev.date)}</td>
                      <td>{ev.location}</td>
                      <td>
                        {ev.state === 'OK'
                            ? <span className={styles.badgeOk}>Confirmé</span>
                            : <span className={styles.badgeCanceled}>Annulé</span>}
                      </td>
                      <td>
                        <Dropdown as={ButtonGroup} align="end">
                          <Dropdown.Toggle variant="light" size="sm" aria-label={`Actions pour ${ev.title}`}>
                            <ThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleOpenModal(ev)}>✏ Modifier</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleToggleState(ev)}>
                              {ev.state === 'OK' ? '❌ Annuler' : '✅ Confirmer'}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDeleteEvent(ev.id)} className="text-danger">
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

        {/* Modale Création / Édition */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Form onSubmit={handleSaveEvent}>
            <Modal.Header closeButton><Modal.Title>{editingEvent ? 'Modifier' : 'Créer'} un événement</Modal.Title></Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Titre</Form.Label>
                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date et heure</Form.Label>
                <Form.Control type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Lieu</Form.Label>
                <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button type="submit" variant="success" disabled={saving}>
                {saving ? 'Enregistrement…' : editingEvent ? 'Modifier' : 'Créer'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </AdminLayout>
  );
}
