// backend/utils/notify.js
const { getIo } = require("../socket");
const axios = require("axios");

async function notify({ senderId, receiverId, type, text }) {
  // Persist
  const { data: notification } = await axios.post(
    "http://localhost:3000/api/notifications", 
    { senderId, receiverId, type, text, isRead: false }
  );

  // Emit
  const io = getIo();
  io.emit("sendNotification", { senderId, receiverId, type, text }); // for analytics
  io.to(receiverId).emit("newNotification", notification);

  return notification;
  console.error('Notification sending failed:', error.message);
    throw error;
}

module.exports = { notify };
