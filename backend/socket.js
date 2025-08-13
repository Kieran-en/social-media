// backend/socket.js
const { Server } = require("socket.io");
const axios = require("axios");

let io;
const users = [];

// helper functions
function addUser(userId, socketId, username, profileImg) {
  if (!users.find(u => u.userId === userId)) {
    users.push({ userId, socketId, username, profileImg });
  }
}

function removeUser(socketId) {
  const idx = users.findIndex(u => u.socketId === socketId);
  if (idx !== -1) users.splice(idx, 1);
}

function getUser(userId) {
  return users.find(u => u.userId === userId);
}

/**
 * Initialize socket.io on your HTTP server.
 */
function init(server) {
  io = new Server(server, {
    cors: { origin: ["http://localhost:4000"] }
  });

  io.on("connection", socket => {
    console.log(`→ socket ${socket.id} connected`);

    socket.on("addUser", ({ userId, username, profileImg }) => {
      addUser(userId, socket.id, username, profileImg);
      socket.join(userId); //  This enables io.to(userId) to work
      io.emit("getUsers", users);
});


    socket.on("join_room", ({ room, senderId }) => {
      socket.join(room);
      console.log(`${senderId} joined ${room}`);
    });

    socket.on("sendMessage", ({ senderId, room, text }) => {
      io.in(room).emit("getMessage", { senderId, text, room });
    });

    socket.on("typing", ({ senderName, room }) => {
      socket.to(room).emit("typing", { userTyping: senderName });
    });
    socket.on("stop typing", ({ room }) => {
      socket.to(room).emit("stop typing");
    });

    socket.on("sendNotification", async ({ senderId, receiverId, type, text }) => {
      // 1) Persist in DB via your REST endpoint
      try {
        const { data: notification } = await axios.post(
          "http://localhost:4000/api/notifications",
          { senderId, receiverId, type, text, isRead: false }
        );

        // 2) If target user is online, emit directly
        const user = getUser(receiverId);
        if (user) {
          io.to(user.socketId).emit("newNotification", notification);
        }
      } catch (err) {
        console.error("Notification error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`← socket ${socket.id} disconnected`);
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });

  return io;
}

function getIo() {
  if (!io) throw new Error("Socket not initialized!");
  return io;
}

module.exports = { init, getIo };
