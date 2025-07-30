const Event = require('../models/Event');

// Créer un événement
exports.createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  try {
    const event = await Event.create({
      title,
      description,
      date,
      location,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les événements
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ order: [['date', 'ASC']] });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modifier un événement
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location } = req.body;

  try {
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Événement non trouvé" });

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un événement
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Event.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Événement non trouvé" });

    res.json({ message: "Événement supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Changer l’état (OK / CANCELED)
exports.toggleEventState = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Événement non trouvé" });

    event.state = event.state === 'OK' ? 'CANCELED' : 'OK';
    await event.save();

    res.json({ message: `Événement ${event.state === 'OK' ? 'réactivé' : 'annulé'}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
