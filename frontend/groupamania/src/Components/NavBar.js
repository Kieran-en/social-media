import React, { useEffect, useState } from 'react';
import { Navbar, Dropdown, Nav, Offcanvas } from 'react-bootstrap';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import { FaHome, FaUser, FaDoorOpen, FaCog, FaUsers } from "react-icons/fa";
import { MdOutlineMessage, MdNotifications } from "react-icons/md";

import styles from '../Styles/navbar.module.css';
import navImg from '../Images/EEC.png';
import { getCurrentUser, logout } from "../Services/userService";
import { deleteToken } from '../features/tokens/tokenSlice';
import { clearConversation } from '../features/conversations/conversationSlice';
import UnifiedSearchBar from './UnifiedSearchBar';

export default function NavBar({ showAdminInDropdown = false }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const conversation = useSelector(state => state.conversation);
    const token = useSelector(state => state.token);

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const unreadMessagesCount = messages.filter(m => !m.isRead).length;
    
    // Extraire l'ID utilisateur correctement
    const userId = userData?.userId || userData?.id;

    useEffect(() => {
        const user = getCurrentUser(token);
        setUserData(user);
    }, [token]);

    useEffect(() => {
        if (!userData) return;

        const socket = io("http://localhost:3000");

        socket.emit("addUser", {
            userId: userId,
            username: userData.username,
            profileImg: userData.profileImg
        });

        socket.on("newNotification", notif => {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔔 Nouvelle notification reçue:', notif.type);
            }
            if (notif.type === 'message') {
                setMessages(prev => [notif, ...prev]);
            } else {
                setNotifications(prev => [notif, ...prev]);
            }
        });

        return () => socket.disconnect();
    }, [userData]);

    // Charger les notifications existantes au montage du composant
    useEffect(() => {
        if (!userData) return;
        
        const currentUserId = userData.userId || userData.id;
        if (!currentUserId) return;

        const loadNotifications = async () => {
            try {
                const { getNotifications } = await import('../Services/notificationService');
                const { data } = await getNotifications(currentUserId);
                
                // Séparer les messages des autres notifications
                const messageNotifications = data?.filter(n => n.type === 'message') || [];
                const otherNotifications = data?.filter(n => n.type !== 'message') || [];
                
                setMessages(messageNotifications);
                setNotifications(otherNotifications);
            } catch (error) {
                console.error('❌ Erreur lors du chargement des notifications:', error);
            }
        };

        loadNotifications();
    }, [userData]);

    // Debug: Afficher le nombre de notifications non lues (en mode développement uniquement)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔔 Notifications non lues:', unreadCount, '| Messages non lus:', unreadMessagesCount);
        }
    }, [unreadCount, unreadMessagesCount]);

    const handleLogout = () => {
        logout();
        dispatch(deleteToken());
        navigate("/login");
    };

    const handleNotificationClick = async () => {
        // Marquer toutes les notifications comme lues quand on clique sur l'icône
        if (unreadCount > 0) {
            try {
                const { markAllAsRead } = await import('../Services/notificationService');
                await markAllAsRead(userId);
                setNotifications(prev => 
                    prev.map(notif => ({ ...notif, isRead: true }))
                );
            } catch (error) {
                console.error('Erreur lors du marquage des notifications comme lues:', error);
            }
        }
        navigate('/notifications');
    };

    const handleMessageClick = async () => {
        // Marquer tous les messages comme lus quand on clique sur l'icône
        if (unreadMessagesCount > 0) {
            try {
                const { markAllAsRead } = await import('../Services/notificationService');
                await markAllAsRead(userId);
                setMessages(prev => 
                    prev.map(msg => ({ ...msg, isRead: true }))
                );
            } catch (error) {
                console.error('Erreur lors du marquage des messages comme lus:', error);
            }
        }
        navigate('/messages');
    };


    const isMobile = window.innerWidth <= 768;
    const showBackButton = isMobile && conversation?.id;

    if (!userData || !userData.username) return null;

    return (
        <>
            <Navbar fixed="top" className={styles.navContainer}>
                {/* LEFT SIDE */}
                <div className={styles.navLeft}>
                    {showBackButton && (
                        <button onClick={() => dispatch(clearConversation())} className={styles.backButton}>
                            &lt;
                        </button>
                    )}
                    <NavLink to={`/timeline/${userData.username}`}>
                        <img src={navImg} className={styles.logo} alt='Logo Melen' />
                    </NavLink>
                </div>

                {/* DESKTOP SEARCH BAR */}
                <div className={`${styles.searchBar} d-none d-md-flex`}>
                    <UnifiedSearchBar
                        placeholder="Rechercher des utilisateurs ou groupes..."
                        onUserClick={(user) => navigate(`/profilepage/${user.name}`)}
                        onGroupClick={(group) => navigate(`/group/${group.id}`)}
                        currentUserId={userId}
                    />
                </div>

                {/* RIGHT SIDE (desktop icons) */}
                <div className={`${styles.navRight} d-none d-md-flex`}>
                    <NavLink to={`/timeline/${userData.username}`} className={styles.iconWrapper} title="Accueil">
                        <FaHome className={styles.navIcon} />
                    </NavLink>

                    <div className={styles.notificationWrapper} onClick={handleMessageClick} title="Messages">
                        <MdOutlineMessage className={styles.navIcon} />
                        {unreadMessagesCount > 0 && (
                            <div className={styles.notificationDot}></div>
                        )}
                    </div>

                    <div className={styles.notificationWrapper} onClick={handleNotificationClick} title="Notifications">
                        <MdNotifications className={styles.notificationIcon} />
                        {unreadCount > 0 && (
                            <div className={styles.notificationDot}></div>
                        )}
                    </div>
                    

                    <Dropdown align="end">
                        <Dropdown.Toggle id="dropdown-profile" bsPrefix={styles.dropdownToggle}>
                            <img src={userData.profileImg} alt="Profil" className={styles.profileImg} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={styles.dropdownMenu}>
                            <Dropdown.Item onClick={() => navigate(`/profilepage/${userData.username}`)}>
                                <FaUser className={styles.dropdownIcon} />
                                <span>Voir le profil</span>
                            </Dropdown.Item>

                            {userData.role === 'admin' && showAdminInDropdown && (
                                <Dropdown.Item onClick={() => navigate('/admin')}>
                                    <FaCog className={styles.dropdownIcon} />
                                    <span>Gérer la plateforme</span>
                                </Dropdown.Item>
                            )}

                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout} className={styles.logoutItem}>
                                <FaDoorOpen className={styles.dropdownIcon} />
                                <span>Déconnexion</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/* MOBILE HAMBURGER */}
                <button className={styles.hamburgerButton} onClick={() => setShowMenu(true)}>
                    ☰
                </button>
            </Navbar>

            {/* OFFCANVAS MENU FOR MOBILE */}
            <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className={styles.mobileSearchBar}>
                        <UnifiedSearchBar
                            placeholder="Rechercher des utilisateurs ou groupes..."
                            onUserClick={(user) => {
                                navigate(`/profilepage/${user.name}`);
                                setShowMenu(false);
                            }}
                            onGroupClick={(group) => {
                                navigate(`/group/${group.id}`);
                                setShowMenu(false);
                            }}
                            currentUserId={userId}
                        />
                    </div>
                    <Nav className="flex-column mt-3" style={{ gap: '8px' }}>
                        <Nav.Link onClick={() => navigate(`/timeline/${userData.username}`)} style={{ display: 'flex', alignItems: 'center' }}>
                            <FaHome className={styles.navIcon} style={{ marginRight: '8px' }} />
                            Accueil
                        </Nav.Link>
                        <Nav.Link onClick={handleMessageClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                <MdOutlineMessage 
                                    className={styles.navIcon}
                                    style={{ marginRight: '8px' }}
                                />
                                {unreadMessagesCount > 0 && (
                                    <div className={styles.notificationDot} style={{ position: 'absolute', top: '0', right: '0' }}></div>
                                )}
                                Messages
                            </span>
                        </Nav.Link>
                        <Nav.Link onClick={handleNotificationClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                <MdNotifications 
                                    className={styles.notificationIcon}
                                    style={{ marginRight: '8px' }}
                                />
                                {unreadCount > 0 && (
                                    <div className={styles.notificationDot} style={{ position: 'absolute', top: '0', right: '0' }}></div>
                                )}
                                Notifications
                            </span>
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate('/groups')} style={{ display: 'flex', alignItems: 'center' }}>
                            <FaUsers className={styles.navIcon} style={{ marginRight: '8px' }} />
                            Découvrir les groupes
                        </Nav.Link>
                        {userData.role === 'admin' && (
                            <Nav.Link onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center' }}>
                                <FaCog className={styles.navIcon} style={{ marginRight: '8px' }} />
                                Gérer la plateforme
                            </Nav.Link>
                        )}
                        <Nav.Link onClick={() => navigate(`/profilepage/${userData.username}`)} style={{ display: 'flex', alignItems: 'center' }}>
                            <FaUser className={styles.navIcon} style={{ marginRight: '8px' }} />
                            Voir le profil
                        </Nav.Link>
                        <Nav.Link onClick={handleLogout} style={{ display: 'flex', alignItems: 'center' }}>
                            <FaDoorOpen className={styles.navIcon} style={{ marginRight: '8px' }} />
                            Déconnexion
                        </Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
