// src/Pages/GroupsPage.jsx

import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { getAllGroups } from "../Services/groupService";
import GroupCard from "../Components/GroupCard";
import NavBar from "../Components/NavBar";
import { Loader2 } from "lucide-react";

const GroupsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredGroups, setFilteredGroups] = useState([]);

    // Récupérer tous les groupes
    const { data: groupsData, isLoading, isError, error } = useQuery(
        'allGroups', 
        () => getAllGroups().then(res => res.data)
    );

    // Filtrer les groupes en fonction du terme de recherche
    useEffect(() => {
        if (groupsData) {
            const filtered = groupsData.filter(group => 
                group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredGroups(filtered);
        }
    }, [groupsData, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <NavBar />
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-600 ml-3">Chargement des groupes...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-100">
                <NavBar />
                <Container className="pt-5">
                    <Alert variant="danger">
                        <Alert.Heading>Erreur</Alert.Heading>
                        <p>Impossible de charger les groupes. {error?.message}</p>
                    </Alert>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <Container className="pt-4 pb-5">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">
                        🏘️ Découvrir les Groupes
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Explorez et rejoignez les différents groupes de notre communauté
                    </p>
                    
                    {/* Barre de recherche */}
                    <Form.Group className="mb-4">
                        <Form.Control
                            type="text"
                            placeholder="Rechercher un groupe par nom ou description..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </Form.Group>
                </div>

                {/* Statistiques */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span className="text-sm text-gray-500">Total des groupes : </span>
                            <span className="font-semibold text-blue-600">{groupsData?.length || 0}</span>
                        </div>
                        {searchTerm && (
                            <div>
                                <span className="text-sm text-gray-500">Résultats : </span>
                                <span className="font-semibold text-green-600">{filteredGroups.length}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Liste des groupes */}
                {filteredGroups.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {searchTerm ? 'Aucun groupe trouvé' : 'Aucun groupe disponible'}
                        </h3>
                        <p className="text-gray-500">
                            {searchTerm 
                                ? 'Essayez de modifier votre recherche ou explorez d\'autres groupes.'
                                : 'Il n\'y a pas encore de groupes créés dans cette communauté.'
                            }
                        </p>
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Effacer la recherche
                            </button>
                        )}
                    </div>
                ) : (
                    <Row>
                        {filteredGroups.map((group) => (
                            <Col key={group.id} xs={12} md={6} lg={4} className="mb-4">
                                <GroupCard group={group} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default GroupsPage;
