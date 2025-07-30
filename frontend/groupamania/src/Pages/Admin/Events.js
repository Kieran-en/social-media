import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar';
import AdminSideNav from './AdminSideNav';
import styles from './adminPage.module.css';
import { Button, Table, Modal, Form, Dropdown, ButtonGroup } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../../Services/eventService';

function Events() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('OK'); // Default state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des événements");
    }
  };

  const handleOpenModal = (event = null) => {
    setEditingEvent(event);
    setTitle(event ? event.title : '');
    setDescription(event ? event.description : '');
    setDate(event ? new Date(event.date).toISOString().substring(0, 16) : '');
    setLocation(event ? event.location : '');
    setState(event ? event.state : 'OK');
    setShowModal(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventData = { title, description, date, location, state };

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }

      setShowModal(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      setError("Erreur lors de l'enregistrement de l'événement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      try {
        await deleteEvent(id);
        fetchEvents();
      } catch (err) {
        setError("Erreur lors de la suppression de l'événement");
      }
    }
  };

  const handleToggleState = async (event) => {
    try {
      const updatedState = event.state === 'OK' ? 'CANCELED' : 'OK';
      await updateEvent(event.id, { ...event, state: updatedState });
      fetchEvents();
    } catch (err) {
      setError("Erreur lors du changement d'état");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <NavBar />
      <div className={styles.bodyContainer} style={{ flexDirection: 'row' }}>
        <AdminSideNav />
        <div style={{ flex: 1, padding: '20px' }}>
          <h2>Gestion des Événements</h2>
          <Button onClick={() => handleOpenModal()} variant="primary" style={{ marginBottom: '15px' }}>
            Créer un événement
          </Button>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Date</th>
                <th>Lieu</th>
                <th>Statut</th>
                <th style={{ width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{new Date(event.date).toLocaleString()}</td>
                    <td>{event.location}</td>
                    <td>
                      <span style={{ color: event.state === 'OK' ? 'green' : 'red' }}>
                        {event.state === 'OK' ? 'Confirmé' : 'Annulé'}
                      </span>
                    </td>
                    <td>
                      <Dropdown as={ButtonGroup} align="end">
                        <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${event.id}`}>
                          <ThreeDotsVertical />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleOpenModal(event)}>✏ Modifier</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleToggleState(event)}>
                            {event.state === 'OK' ? '❌ Annuler' : '✅ Confirmer'}
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDeleteEvent(event.id)} style={{ color: 'red' }}>
                            🗑 Supprimer
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Aucun événement trouvé.</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Modal pour création / modification */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Form onSubmit={handleSaveEvent}>
              <Modal.Header closeButton>
                <Modal.Title>{editingEvent ? 'Modifier' : 'Créer'} un événement</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Titre</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date et heure</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Lieu</Form.Label>
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Enregistrement...' : editingEvent ? 'Modifier' : 'Créer'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Events;
