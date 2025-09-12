import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Badge, Form, Alert, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';
import { getGroupJoinRequests, processJoinRequest } from '../Services/groupService';
import { CheckCircle, XCircle, Clock, User, MessageSquare } from 'lucide-react';

const GroupJoinRequestsModal = ({ show, onHide, groupId, groupName }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingRequest, setProcessingRequest] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [showResponseForm, setShowResponseForm] = useState(null);
  
  const queryClient = useQueryClient();

  // Charger les demandes quand le modal s'ouvre
  useEffect(() => {
    if (show && groupId) {
      fetchRequests();
    }
  }, [show, groupId]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getGroupJoinRequests(groupId);
      setRequests(response.data.requests || []);
    } catch (err) {
      setError('Erreur lors du chargement des demandes');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mutation pour traiter les demandes
  const processRequestMutation = useMutation(
    ({ requestId, action, responseMessage }) => processJoinRequest(requestId, action, responseMessage),
    {
      onSuccess: () => {
        // Recharger les demandes
        fetchRequests();
        setProcessingRequest(null);
        setResponseMessage('');
        setShowResponseForm(null);
        // Optionnel: rafraîchir les données du groupe
        queryClient.invalidateQueries(['group', groupId]);
      },
      onError: (error) => {
        console.error('Erreur lors du traitement:', error);
        setError('Erreur lors du traitement de la demande');
      }
    }
  );

  const handleProcessRequest = (requestId, action) => {
    setProcessingRequest(requestId);
    processRequestMutation.mutate({
      requestId,
      action,
      responseMessage: responseMessage || (action === 'approve' ? 'Bienvenue dans le groupe !' : 'Demande refusée')
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" className="d-flex align-items-center"><Clock size={14} className="me-1" /> En attente</Badge>;
      case 'approved':
        return <Badge bg="success" className="d-flex align-items-center"><CheckCircle size={14} className="me-1" /> Approuvée</Badge>;
      case 'rejected':
        return <Badge bg="danger" className="d-flex align-items-center"><XCircle size={14} className="me-1" /> Refusée</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <User size={20} />
          Demandes d'adhésion - {groupName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" className="me-2" />
            Chargement des demandes...
          </div>
        ) : (
          <>
            {/* Demandes en attente */}
            {pendingRequests.length > 0 && (
              <div className="mb-4">
                <h6 className="text-warning mb-3">
                  <Clock size={16} className="me-1" />
                  Demandes en attente ({pendingRequests.length})
                </h6>
                <div className="border rounded p-3">
                  {pendingRequests.map((request, index) => (
                    <div 
                      key={request.id} 
                      className={`pb-3 mb-3 ${index < pendingRequests.length - 1 ? 'border-bottom' : ''}`}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center">
                          <img
                            src={request.user.profileImg || `https://ui-avatars.com/api/?name=${request.user.name}&background=random&size=32`}
                            alt={request.user.name}
                            className="rounded-circle me-2"
                            style={{ width: 32, height: 32, objectFit: 'cover' }}
                          />
                          <div>
                            <strong>{request.user.name}</strong>
                            <small className="d-block text-muted">{request.user.email}</small>
                          </div>
                        </div>
                        <div className="text-end">
                          {getStatusBadge(request.status)}
                          <small className="d-block text-muted mt-1">
                            {formatDate(request.createdAt)}
                          </small>
                        </div>
                      </div>

                      {request.message && (
                        <div className="mb-3 p-2 bg-light rounded">
                          <small className="text-muted d-flex align-items-center mb-1">
                            <MessageSquare size={12} className="me-1" />
                            Message de motivation :
                          </small>
                          <div>{request.message}</div>
                        </div>
                      )}

                      {/* Formulaire de réponse */}
                      {showResponseForm === request.id && (
                        <div className="mb-3">
                          <Form.Group>
                            <Form.Label>Message de réponse (optionnel)</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              value={responseMessage}
                              onChange={(e) => setResponseMessage(e.target.value)}
                              placeholder="Message à envoyer à l'utilisateur..."
                            />
                          </Form.Group>
                        </div>
                      )}

                      <div className="d-flex">
                        {showResponseForm === request.id ? (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleProcessRequest(request.id, 'approve')}
                              disabled={processingRequest === request.id}
                              className="me-2"
                            >
                              {processingRequest === request.id ? 'Traitement...' : 'Approuver'}
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleProcessRequest(request.id, 'reject')}
                              disabled={processingRequest === request.id}
                              className="me-2"
                            >
                              {processingRequest === request.id ? 'Traitement...' : 'Refuser'}
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => {
                                setShowResponseForm(null);
                                setResponseMessage('');
                              }}
                            >
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setShowResponseForm(request.id);
                              setResponseMessage('');
                            }}
                          >
                            Traiter la demande
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Demandes traitées */}
            {processedRequests.length > 0 && (
              <div>
                <h6 className="text-muted mb-3">
                  Demandes traitées ({processedRequests.length})
                </h6>
                <div className="border rounded p-3">
                  {processedRequests.map((request, index) => (
                    <div 
                      key={request.id} 
                      className={`pb-3 mb-3 ${index < processedRequests.length - 1 ? 'border-bottom' : ''}`}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center">
                          <img
                            src={request.user.profileImg || `https://ui-avatars.com/api/?name=${request.user.name}&background=random&size=32`}
                            alt={request.user.name}
                            className="rounded-circle me-2"
                            style={{ width: 32, height: 32, objectFit: 'cover' }}
                          />
                          <div>
                            <strong>{request.user.name}</strong>
                            <small className="d-block text-muted">{request.user.email}</small>
                          </div>
                        </div>
                        <div className="text-end">
                          {getStatusBadge(request.status)}
                          <small className="d-block text-muted mt-1">
                            Traitée le {formatDate(request.reviewedAt)}
                          </small>
                          {request.reviewer && (
                            <small className="d-block text-muted">
                              par {request.reviewer.name}
                            </small>
                          )}
                        </div>
                      </div>

                      {request.responseMessage && (
                        <div className="p-2 bg-light rounded">
                          <small className="text-muted">Réponse :</small>
                          <div>{request.responseMessage}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aucune demande */}
            {requests.length === 0 && !loading && (
              <div className="text-center py-4 text-muted">
                <User size={48} className="mb-3 opacity-50" />
                <p>Aucune demande d'adhésion pour ce groupe.</p>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GroupJoinRequestsModal;
