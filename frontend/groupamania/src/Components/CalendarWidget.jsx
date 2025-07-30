import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // style par défaut
import '../Styles/CalendarWidget.css';
import { getAllEvents } from '../Services/eventService';
import { Modal, Button } from 'react-bootstrap';

function CalendarWidget() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des événements :", err);
    }
  };

  const onDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  // 🔍 Trouve les événements du jour sélectionné
  const eventsOfSelectedDate = events.filter(event =>
    new Date(event.date).toDateString() === new Date(selectedDate).toDateString()
  );

  // 📌 Fonction pour marquer les jours avec événements
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasEvent = events.some(event =>
        new Date(event.date).toDateString() === date.toDateString()
      );
      if (hasEvent) {
        return <div className="dot" />;
      }
    }
    return null;
  };

  return (
    <div className="page-wrapper">
      <div className="calendar-container">
        <h5 className="calendar-title">
          <i className="bi bi-calendar3"></i> Agenda
        </h5>

        <Calendar
          onClickDay={onDateClick}
          tileContent={tileContent}
          formatMonthYear={(locale, date) =>
            date.toLocaleString(locale, {
              month: 'long',
              year: 'numeric',
            }).replace(/^./, str => str.toUpperCase())
          }
        />

        {/* Détail des événements */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Événements du {selectedDate?.toLocaleDateString()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {eventsOfSelectedDate.length > 0 ? (
              eventsOfSelectedDate.map(event => (
                <div key={event.id} style={{ marginBottom: '10px' }}>
                  <h6>{event.title}</h6>
                  <p style={{ marginBottom: '5px' }}>{event.description}</p>
                  <small>Heure : {new Date(event.date).toLocaleTimeString()}</small><br />
                  <small>Lieu : {event.location}</small>
                </div>
              ))
            ) : (
              <p>Aucun événement ce jour-là.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default CalendarWidget;
