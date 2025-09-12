import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Overlay, Popover, Nav } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { searchUsers } from '../Services/userService';
import { searchGroups } from '../Services/groupService';
import UnifiedSearchResults from './UnifiedSearchResults';
import styles from '../Styles/searchBar.module.css';

export default function UnifiedSearchBar({ 
    placeholder = "Rechercher des utilisateurs ou groupes...",
    onUserClick,
    onGroupClick,
    currentUserId,
    className = ""
}) {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('users'); // 'users' ou 'groups'
    const [userResults, setUserResults] = useState([]);
    const [groupResults, setGroupResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);
    
    const searchRef = useRef(null);
    const target = useRef(null);
    const searchTimeoutRef = useRef(null);
    const containerRef = useRef(null);

    const performSearch = useCallback(async (searchQuery) => {
        setLoading(true);
        setError(null);
        
        try {
            // Rechercher en parallèle les utilisateurs et les groupes
            const [usersResponse, groupsResponse] = await Promise.allSettled([
                searchUsers(searchQuery, 1, 10),
                searchGroups(searchQuery, 1, 10)
            ]);

            // Traiter les résultats des utilisateurs
            if (usersResponse.status === 'fulfilled') {
                setUserResults(usersResponse.value.users || []);
            } else {
                console.error('Erreur recherche utilisateurs:', usersResponse.reason);
            }

            // Traiter les résultats des groupes
            if (groupsResponse.status === 'fulfilled') {
                setGroupResults(groupsResponse.value.data?.groups || []);
            } else {
                console.error('Erreur recherche groupes:', groupsResponse.reason);
                console.error('Détails de l\'erreur:', groupsResponse.reason?.response?.data);
            }

            setShowResults(true);
        } catch (err) {
            console.error('Erreur lors de la recherche:', err);
            setError('Erreur lors de la recherche');
            setUserResults([]);
            setGroupResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (query.trim().length >= 2) {
            searchTimeoutRef.current = setTimeout(() => {
                performSearch(query);
            }, 300);
        } else {
            setUserResults([]);
            setGroupResults([]);
            setShowResults(false);
            setError(null);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [query, performSearch]);

    // Gestionnaire pour fermer le menu quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                // Vérifier que ce n'est pas un clic sur un élément de Bootstrap (Overlay, etc.)
                const isBootstrapElement = event.target.closest('.popover') || 
                                         event.target.closest('.overlay') ||
                                         event.target.closest('[data-bs-toggle]');
                
                if (!isBootstrapElement) {
                    setShowResults(false);
                }
            }
        };

        if (showResults) {
            // Utiliser 'click' au lieu de 'mousedown' pour éviter les conflits
            document.addEventListener('click', handleClickOutside, true);
            return () => {
                document.removeEventListener('click', handleClickOutside, true);
            };
        }
    }, [showResults]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        
        if (value.trim().length >= 2) {
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    };

    const handleClearSearch = () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        setQuery('');
        setUserResults([]);
        setGroupResults([]);
        setShowResults(false);
        setError(null);
        searchRef.current?.focus();
    };

    const handleUserClick = (user) => {
        if (onUserClick) {
            onUserClick(user);
        }
        setShowResults(false);
        setQuery('');
    };

    const handleGroupClick = (group) => {
        if (onGroupClick) {
            onGroupClick(group);
        }
        setShowResults(false);
        setQuery('');
    };

    const handleFocus = () => {
        if (query.trim().length >= 2 && (userResults.length > 0 || groupResults.length > 0)) {
            setShowResults(true);
        }
    };


    return (
        <div className={`${styles.searchContainer} ${className}`} ref={containerRef}>
            <div className={styles.searchInputContainer}>
                <FaSearch className={styles.searchIcon} />
                <Form.Control
                    ref={searchRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    className={styles.searchInput}
                    autoComplete="off"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className={styles.clearButton}
                        aria-label="Effacer la recherche"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            <Overlay
                show={showResults}
                target={containerRef}
                placement="bottom"
                rootClose={false}
            >
                <Popover className={styles.searchPopover}>
                    <Popover.Body className="p-0">
                        {/* Header avec bouton de fermeture */}
                        <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-light">
                            <small className="text-muted">Résultats de recherche</small>
                            <button
                                type="button"
                                onClick={() => setShowResults(false)}
                                className="btn-close btn-close-sm"
                                aria-label="Fermer"
                                style={{ fontSize: '0.7rem' }}
                            ></button>
                        </div>
                        
                        {/* Onglets de navigation */}
                        <Nav variant="tabs" className="border-bottom">
                            <Nav.Item>
                                <Nav.Link 
                                    active={activeTab === 'users'}
                                    onClick={() => setActiveTab('users')}
                                    className="px-3 py-2"
                                    style={{ cursor: 'pointer' }}
                                >
                                    👤 Utilisateurs ({userResults.length})
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link 
                                    active={activeTab === 'groups'}
                                    onClick={() => setActiveTab('groups')}
                                    className="px-3 py-2"
                                    style={{ cursor: 'pointer' }}
                                >
                                    🏘️ Groupes ({groupResults.length})
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        {/* Résultats de recherche */}
                        <UnifiedSearchResults
                            activeTab={activeTab}
                            users={userResults}
                            groups={groupResults}
                            loading={loading}
                            error={error}
                            onUserClick={handleUserClick}
                            onGroupClick={handleGroupClick}
                            currentUserId={currentUserId}
                        />
                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}
