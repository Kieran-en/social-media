import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../Services/userService';
import { getNotifications } from '../Services/notificationService';
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

  // Fetch notifications from backend
  useEffect(() => {
    if (!userId) return;

    async function fetchNotifications() {
      try {
        const { data } = await getNotifications(userId);
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    }

    fetchNotifications();
  }, [userId]);

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
          {notifications.length === 0 ? (
            <NotificationCard isEmpty={true} />
          ) : (
            notifications.map((notif) => (
              <NotificationCard key={notif.id} notification={notif} />
            ))
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
