import React, { useState, useEffect, useRef } from 'react';
import { Form, Overlay, Popover } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { searchUsers } from '../Services/userService';
import SearchResults from './SearchResults';
import styles from '../Styles/searchBar.module.css';

export default function SearchBar({ 
    placeholder = "Rechercher des utilisateurs...",
    onUserClick,
    currentUserId,
    className = ""
}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
    
    const searchRef = useRef(null);
    const target = useRef(null);

    // Debounced search
    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        if (query.trim().length >= 2) {
            setSearchTimeout(
                setTimeout(() => {
                    performSearch(query);
                }, 300)
            );
        } else {
            setResults([]);
            setShowResults(false);
            setError(null);
        }

        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [query]);

    const performSearch = async (searchQuery) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await searchUsers(searchQuery, 1, 10);
            setResults(response.users || []);
            setShowResults(true);
        } catch (err) {
            console.error('Erreur lors de la recherche:', err);
            setError(err.response?.data?.message || 'Erreur lors de la recherche');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

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
        setQuery('');
        setResults([]);
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

    const handleFocus = () => {
        if (query.trim().length >= 2 && results.length > 0) {
            setShowResults(true);
        }
    };

    const handleBlur = (e) => {
        // Délai pour permettre le clic sur les résultats
        setTimeout(() => {
            setShowResults(false);
        }, 200);
    };

    return (
        <div className={`${styles.searchContainer} ${className}`} ref={target}>
            <div className={styles.searchInputContainer}>
                <FaSearch className={styles.searchIcon} />
                <Form.Control
                    ref={searchRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
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
                target={target}
                placement="bottom"
                rootClose
                onHide={() => setShowResults(false)}
            >
                <Popover className={styles.searchPopover}>
                    <Popover.Body className="p-0">
                        <SearchResults
                            users={results}
                            loading={loading}
                            error={error}
                            onUserClick={handleUserClick}
                            currentUserId={currentUserId}
                        />
                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}
