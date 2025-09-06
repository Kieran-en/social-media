import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../Services/userService';
import { getNotifications, markAllAsRead } from '../Services/notificationService';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import CalendarWidget from '../Components/CalendarWidget';
import RandomQuote from '../Components/Quotes';
import NotificationCard from '../Components/NotificationCard';
import style from '../Styles/timeline.module.css';

function Notification() {
  const token = useSelector((state) => state.token);
  const userData = getCurrentUser(token);
  const { role, userId } = userData || {};

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications from backend
  useEffect(() => {
    if (!userId) return;

    async function fetchNotifications() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getNotifications(userId);
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Erreur lors du chargement des notifications');
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [userId]);

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(userId);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  // Mark a single notification as read
  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={style.timelineContainer}>
      <NavBar showAdminInDropdown={windowWidth < 992} />
      <div className={style.contentWrapper}>
        {/* Left column - Calendar */}
        {windowWidth >= 992 && (
          <div className={style.leftCol}>
            <CalendarWidget />
          </div>
        )}

        {/* Center column - Notification Cards */}
        <div className={style.centerCol}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Chargement des notifications...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
              <p>{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <NotificationCard isEmpty={true} />
          ) : (
            <>
              <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <button 
                  onClick={handleMarkAllAsRead}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f8f9fa',
                    color: '#666',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#e9ecef';
                    e.target.style.borderColor = '#adb5bd';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.borderColor = '#dee2e6';
                  }}
                >
                  Marquer tout comme lu
                </button>
              </div>
              {notifications.map((notif) => (
                <NotificationCard 
                  key={notif.id} 
                  notification={notif} 
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </>
          )}
        </div>

        {/* Right column - Quote and Admin link */}
        {windowWidth >= 992 && (
          <div className={style.rightCol}>
            <RandomQuote />
            {role === 'admin' && (
              <div className={style.adminLinkBox}>
                <Link to="/admin" className={style.adminButton}>
                  ⚙️ Gérer la plateforme
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;
