import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import styles from './adminPage.module.css';
import { getAllGroups } from '../../Services/groupService';
import { getAllUsers } from '../../Services/userAdminService';
import { getAllPosts } from '../../Services/postService';
// NEW: Import the service to get all events
import { getAllEvents } from '../../Services/eventService'; // Make sure this path is correct
import { Card, Form, Spinner, Alert } from 'react-bootstrap';

export default function Stats() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  // NEW: Add state for events
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [roleFilter, setRoleFilter] = useState('all');
  const [postFilter, setPostFilter] = useState('all');
  // NEW: Add state for event filters
  const [eventStatusFilter, setEventStatusFilter] = useState('all');
  const [eventPeriodFilter, setEventPeriodFilter] = useState('all');

  // petit helper robuste
  const dataOf = (res, fallback = []) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (res?.data != null) return res.data;
    return fallback;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // NEW: Add getAllEvents to the promise array
        const [gr, us, po, ev] = await Promise.allSettled([
          getAllGroups(),
          getAllUsers(),
          getAllPosts(),
          getAllEvents(),
        ]);

        const grVal = gr.status === 'fulfilled' ? gr.value : null;
        const usVal = us.status === 'fulfilled' ? us.value : null;
        const poVal = po.status === 'fulfilled' ? po.value : null;
        // NEW: Get event data from the promise result
        const evVal = ev.status === 'fulfilled' ? ev.value : null;

        setGroups(dataOf(grVal));
        setUsers(dataOf(usVal));
        setPosts(dataOf(poVal));
        // NEW: Set the events state
        setEvents(dataOf(evVal));
        setError('');
      } catch (e) {
        setError('Erreur lors du chargement des statistiques');
        // valeurs sûres pour éviter d’autres erreurs
        setGroups([]); setUsers([]); setPosts([]); setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- User Stats ---
  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);
  const activeUsers = filteredUsers.filter(u => u.isActive).length;
  const suspendedUsers = filteredUsers.filter(u => !u.isActive).length;
  const roles = Array.from(new Set(users.map(u => u.role))).filter(Boolean);

  const now = new Date();

  // --- Post Stats ---
  const filteredPosts = posts.filter(p => {
    // Assuming 'createdAt' is the property to filter on
    const age = now - new Date(p.createdAt);
    if (postFilter === 'weekly')  return age <= 7  * 24 * 60 * 60 * 1000;
    if (postFilter === 'monthly') return age <= 30 * 24 * 60 * 60 * 1000;
    if (postFilter === 'yearly')  return age <= 365* 24 * 60 * 60 * 1000;
    return true;
  });

  // --- Group Stats ---
  const activeGroups = groups.filter(g => g.isActive).length;
  const suspendedGroups = groups.filter(g => !g.isActive).length;

  // --- NEW: Event Stats ---
  // Dynamically get all unique event statuses (e.g., 'confirmed', 'cancelled')
  const eventStatuses = Array.from(new Set(events.map(e => e.status))).filter(Boolean);

  const filteredEvents = events
    .filter(e => {
      // First, filter by time period (assuming event has a 'startDate')
      const age = now - new Date(e.startDate);
      if (eventPeriodFilter === 'weekly')  return age <= 7  * 24 * 60 * 60 * 1000;
      if (eventPeriodFilter === 'monthly') return age <= 30 * 24 * 60 * 60 * 1000;
      if (eventPeriodFilter === 'yearly')  return age <= 365* 24 * 60 * 60 * 1000;
      return true;
    })
    .filter(e => {
      // Then, filter by status
      return eventStatusFilter === 'all' ? true : e.status === eventStatusFilter;
    });
  
  // Calculate counts for badges based on the total list
  const confirmedEvents = events.filter(e => e.status === 'confirmed').length;
  const cancelledEvents = events.filter(e => e.status === 'cancelled').length;


  return (
      <AdminLayout header={<h1 className={styles.title}>Statistiques</h1>}>
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

        {loading ? (
            <div className="d-flex align-items-center gap-2 p-3">
              <Spinner animation="border" size="sm" /><span>Chargement…</span>
            </div>
        ) : (
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <Card style={{ minWidth: 240, flex: 1 }} className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Groupes</h3>
                  <span className={styles.statValue}>{groups.length}</span>
                  <div><span className={styles.badgeOk}>Actifs : {activeGroups}</span></div>
                  <div><span className={styles.badgeCanceled}>Suspendus : {suspendedGroups}</span></div>
                </div>
              </Card>

              <Card style={{ minWidth: 280, flex: 1 }} className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Utilisateurs</h3>
                  <Form.Group controlId="roleFilter" className="mb-2">
                    <Form.Label className="mb-1">Filtrer par rôle</Form.Label>
                    <Form.Select size="sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                      <option value="all">Tous</option>
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </Form.Select>
                  </Form.Group>
                  <span className={styles.statValue}>{filteredUsers.length}</span>
                  <div><span className={styles.badgeOk}>Actifs : {activeUsers}</span></div>
                  <div><span className={styles.badgeCanceled}>Suspendus : {suspendedUsers}</span></div>
                </div>
              </Card>

              <Card style={{ minWidth: 280, flex: 1 }} className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Publications</h3>
                  <Form.Group controlId="postFilter" className="mb-2">
                    <Form.Label className="mb-1">Période</Form.Label>
                    <Form.Select size="sm" value={postFilter} onChange={(e) => setPostFilter(e.target.value)}>
                      <option value="all">Toutes</option>
                      <option value="weekly">Cette semaine</option>
                      <option value="monthly">Ce mois</option>
                      <option value="yearly">Cette année</option>
                    </Form.Select>
                  </Form.Group>
                  <span className={styles.statValue}>{filteredPosts.length}</span>
                </div>
              </Card>

              {/* NEW: Events Statistics Card */}
              <Card style={{ minWidth: 280, flex: 1 }} className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Événements</h3>
                  <div className="d-flex gap-2">
                    <Form.Group controlId="eventPeriodFilter" className="mb-2 flex-grow-1">
                      <Form.Label className="mb-1">Période</Form.Label>
                      <Form.Select size="sm" value={eventPeriodFilter} onChange={(e) => setEventPeriodFilter(e.target.value)}>
                        <option value="all">Toutes</option>
                        <option value="weekly">Cette semaine</option>
                        <option value="monthly">Ce mois</option>
                        <option value="yearly">Cette année</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="eventStatusFilter" className="mb-2 flex-grow-1">
                      <Form.Label className="mb-1">Statut</Form.Label>
                      <Form.Select size="sm" value={eventStatusFilter} onChange={(e) => setEventStatusFilter(e.target.value)}>
                        <option value="all">Tous</option>
                        {eventStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <span className={styles.statValue}>{filteredEvents.length}</span>
                  <div><span className={styles.badgeOk}>Confirmés : {confirmedEvents}</span></div>
                  <div><span className={styles.badgeCanceled}>Annulés : {cancelledEvents}</span></div>
                </div>
              </Card>
            </div>
        )}
      </AdminLayout>
  );
}