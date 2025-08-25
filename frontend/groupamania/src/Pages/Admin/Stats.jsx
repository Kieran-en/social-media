import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import styles from './adminPage.module.css';
import { getAllGroups } from '../../Services/groupService';
import { getAllUsers } from '../../Services/userAdminService';
import { getAllPosts } from '../../Services/postService';
import { Card, Form, Spinner, Alert } from 'react-bootstrap';

export default function Stats() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [roleFilter, setRoleFilter] = useState('all');
  const [postFilter, setPostFilter] = useState('all');

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
        const [gr, us, po] = await Promise.allSettled([
          getAllGroups(),
          getAllUsers(),
          getAllPosts(),
        ]);

        const grVal = gr.status === 'fulfilled' ? gr.value : null;
        const usVal = us.status === 'fulfilled' ? us.value : null;
        const poVal = po.status === 'fulfilled' ? po.value : null;

        setGroups(dataOf(grVal));
        setUsers(dataOf(usVal));
        setPosts(dataOf(poVal));
        setError('');
      } catch (e) {
        setError('Erreur lors du chargement des statistiques');
        // valeurs sûres pour éviter d’autres erreurs
        setGroups([]); setUsers([]); setPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);
  const activeUsers = filteredUsers.filter(u => u.isActive).length;
  const suspendedUsers = filteredUsers.filter(u => !u.isActive).length;
  const roles = Array.from(new Set(users.map(u => u.role))).filter(Boolean);

  const now = new Date();
  const filteredPosts = posts.filter(p => {
    const age = now - new Date(p.createdAt);
    if (postFilter === 'weekly')  return age <= 7  * 24 * 60 * 60 * 1000;
    if (postFilter === 'monthly') return age <= 30 * 24 * 60 * 60 * 1000;
    if (postFilter === 'yearly')  return age <= 365* 24 * 60 * 60 * 1000;
    return true;
  });

  const activeGroups = groups.filter(g => g.isActive).length;
  const suspendedGroups = groups.filter(g => !g.isActive).length;

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
            </div>
        )}
      </AdminLayout>
  );
}
