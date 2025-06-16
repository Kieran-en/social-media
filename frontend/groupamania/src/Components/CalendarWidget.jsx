import React from 'react';
import Calendar from 'react-calendar';
import '../Styles/CalendarWidget.css';

function CalendarWidget() {
  return (
    <div className="page-wrapper">
      <div className="calendar-container">
        <h5 className="calendar-title">
          <i className="bi bi-calendar3"></i> Agenda
        </h5>
        <Calendar />
      </div>
    </div>
  );
}

export default CalendarWidget;
