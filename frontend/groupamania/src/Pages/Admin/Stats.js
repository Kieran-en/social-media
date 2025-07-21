import React, { useEffect, useState } from 'react';
import NavBar from '../../Components/NavBar';
import AdminSideNav from './AdminSideNav';
import styles from './adminPage.module.css';
import { getAllGroups } from '../../Services/groupService';
import { getAllUsers } from '../../Services/userAdminService';
import { getAllPosts } from '../../Services/postService';
import { Card, Form, Button } from 'react-bootstrap';

function Stats() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');

  const [postFilter, setPostFilter] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    filterUsers();
  }, [users, roleFilter]);

  useEffect(() => {
    filterPosts();
  }, [posts, postFilter]);

  const fetchGroups = async () => {
    try {
      const res = await getAllGroups();
      setGroups(res.data);
    } catch (err) {
      console.error('Erreur chargement groupes:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
    }
  };

  const fetchPosts = async () => {
  try {
    const res = await getAllPosts(); // plus de page
    setPosts(res.data);
  } catch (err) {
    console.error('Erreur chargement publications:', err);
  }
};


  const filterUsers = () => {
    if (roleFilter === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === roleFilter));
    }
  };

  const filterPosts = () => {
    const now = new Date();
    let filtered = posts;

    if (postFilter === 'weekly') {
      filtered = posts.filter(p => (now - new Date(p.createdAt)) <= 7 * 24 * 60 * 60 * 1000);
    } else if (postFilter === 'monthly') {
      filtered = posts.filter(p => (now - new Date(p.createdAt)) <= 30 * 24 * 60 * 60 * 1000);
    } else if (postFilter === 'yearly') {
      filtered = posts.filter(p => (now - new Date(p.createdAt)) <= 365 * 24 * 60 * 60 * 1000);
    }

    setFilteredPosts(filtered);
  };

  // Statistiques dérivées
  const activeUsers = users.filter(u => u.isActive).length;
  const suspendedUsers = users.filter(u => !u.isActive).length;

  const activeGroups = groups.filter(g => g.isActive).length;
  const suspendedGroups = groups.filter(g => !g.isActive).length;

  const roles = Array.from(new Set(users.map(user => user.role)));

  

  return (
    <div className={styles.adminContainer}>
      <NavBar />
      <div className={styles.bodyContainer} style={{ padding: 20, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <AdminSideNav />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2>Statistiques</h2>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* Groupes */}
            <Card style={{ minWidth: '200px', flex: '1' }}>
              <Card.Body>
                <Card.Title>Groupes</Card.Title>
                <Card.Text>Total : {groups.length}</Card.Text>
                <Card.Text style={{ color: 'green' }}>Actifs : {activeGroups}</Card.Text>
                <Card.Text style={{ color: 'red' }}>Suspendus : {suspendedGroups}</Card.Text>
              </Card.Body>
            </Card>

            {/* Utilisateurs */}
            <Card style={{ minWidth: '300px', flex: '1' }}>
              <Card.Body>
                <Card.Title>Utilisateurs</Card.Title>
                <Form.Group controlId="roleFilter" style={{ marginBottom: '10px' }}>
                  <Form.Label>Filtrer par rôle</Form.Label>
                  <Form.Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">Tous</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Card.Text>Total : {filteredUsers.length}</Card.Text>
                <Card.Text style={{ color: 'green' }}>Actifs : {activeUsers}</Card.Text>
                <Card.Text style={{ color: 'red' }}>Suspendus : {suspendedUsers}</Card.Text>
              </Card.Body>
            </Card>

            {/* Publications avec filtre temporel */}
            <Card style={{ minWidth: '300px', flex: '1' }}>
              <Card.Body>
                <Card.Title>Publications</Card.Title>
                <Form.Group controlId="postFilter" style={{ marginBottom: '10px' }}>
                  <Form.Label>Filtrer par période</Form.Label>
                  <Form.Select
                    value={postFilter}
                    onChange={(e) => setPostFilter(e.target.value)}
                  >
                    <option value="all">Toutes</option>
                    <option value="weekly">Cette semaine</option>
                    <option value="monthly">Ce mois</option>
                    <option value="yearly">Cette année</option>
                  </Form.Select>
                </Form.Group>
                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {filteredPosts.length}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Stats;
