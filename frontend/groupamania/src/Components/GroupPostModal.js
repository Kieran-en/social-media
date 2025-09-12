import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';
import { createGroupPost } from '../Services/groupService';
import { PenTool, Image as ImageIcon, X } from 'lucide-react';

const GroupPostModal = ({ show, onHide, groupId, groupName, groupImage }) => {
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  
  const queryClient = useQueryClient();

  // Mutation pour créer un post de groupe
  const createPostMutation = useMutation(
    (postData) => createGroupPost(groupId, postData),
    {
      onSuccess: () => {
        // Rafraîchir les posts du groupe
        queryClient.invalidateQueries(['groupPosts', groupId]);
        queryClient.invalidateQueries(['group', groupId]);
        
        // Réinitialiser le formulaire
        setPostText('');
        setSelectedImage(null);
        setImagePreview(null);
        setError('');
        
        // Fermer le modal
        onHide();
      },
      onError: (error) => {
        console.error('Erreur lors de la création du post:', error);
        setError(error.response?.data?.message || 'Erreur lors de la publication');
      }
    }
  );

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne peut pas dépasser 5MB');
        return;
      }
      
      setSelectedImage(file);
      setError('');
      
      // Créer une preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!postText.trim()) {
      setError('Le contenu du post ne peut pas être vide');
      return;
    }
    
    const formData = new FormData();
    formData.append('text', postText.trim());
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    
    createPostMutation.mutate(formData);
  };

  const handleClose = () => {
    if (!createPostMutation.isLoading) {
      setPostText('');
      setSelectedImage(null);
      setImagePreview(null);
      setError('');
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <PenTool size={20} className="me-2" />
          Publier au nom de {groupName}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          {/* Indicateur de publication au nom du groupe */}
          <div className="d-flex align-items-center mb-3 p-3 bg-light rounded">
            <img
              src={groupImage || `https://ui-avatars.com/api/?name=${groupName}&background=random&size=40`}
              alt={groupName}
              className="rounded-circle me-3"
              style={{ width: 40, height: 40, objectFit: 'cover' }}
            />
            <div>
              <strong>{groupName}</strong>
              <small className="d-block text-muted">Publication au nom du groupe</small>
            </div>
          </div>

          {/* Zone de texte */}
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Que voulez-vous partager au nom du groupe ?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              disabled={createPostMutation.isLoading}
            />
          </Form.Group>

          {/* Sélection d'image */}
          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center">
              <ImageIcon size={16} className="me-1" />
              Ajouter une image (optionnel)
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={createPostMutation.isLoading}
            />
            <Form.Text className="text-muted">
              Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
            </Form.Text>
          </Form.Group>

          {/* Prévisualisation de l'image */}
          {imagePreview && (
            <div className="mb-3 position-relative">
              <img
                src={imagePreview}
                alt="Prévisualisation"
                className="img-fluid rounded"
                style={{ maxHeight: '300px', width: '100%', objectFit: 'contain' }}
              />
              <Button
                variant="danger"
                size="sm"
                className="position-absolute top-0 end-0 m-2"
                onClick={handleRemoveImage}
                disabled={createPostMutation.isLoading}
              >
                <X size={16} />
              </Button>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            disabled={createPostMutation.isLoading}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={!postText.trim() || createPostMutation.isLoading}
          >
            {createPostMutation.isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Publication...
              </>
            ) : (
              'Publier'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default GroupPostModal;
