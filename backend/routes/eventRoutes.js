const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
// const auth = require('../middlewares/auth'); // Si tu protèges les routes

// Créer un événement
router.post('/', eventController.createEvent);

// Récupérer tous les événements
router.get('/', eventController.getAllEvents);

// Modifier un événement
router.put('/:id', eventController.updateEvent);

// Supprimer un événement
router.delete('/:id', eventController.deleteEvent);

// Basculer l’état (OK ↔ CANCELED)
router.put('/:id/toggle', eventController.toggleEventState);

module.exports = router;
