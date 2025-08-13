const express = require('express');
const app = express();
const cors = require('cors')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(5500, {
  cors: {
    origin: ["http://localhost:4000"],
},
});

app.use(cors())

let users = [];

const addUser = (userId, socketId, profileImg, username) => {
    let index = users.findIndex(user => user.userId === userId)

    //if the userId in parameters is not inside the users array yet, add it
    if (index === -1){
        users.push({userId, socketId, username, profileImg})
    }
    
}

console.log("usersss" + users)


const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

/**
 * const io = require("socket.io")(5500, {
    cors: {
        origin: ["http://localhost:4000"],
    },
})
 */


app.use(cors())

io.on('connection', (socket) => {
    //when connected
  console.log('a user connected!')

  //Receive userId and socketId from user
  socket.on("addUser", ({userId, username, profileImg}) => {
    addUser(userId, socket.id, profileImg, username) //We add both userId and socketId to have a unique pair because at each session, the socketId changes
    io.emit("getUsers", users) //for client to receive new user array after user is added
  })


  socket.on("join_room", ({room, senderId}) => {
    socket.join(room)
    console.log(senderId + " has joined the room " + room)
  })

  //Send and get message
  socket.on('sendMessage', ({senderId, receiverId, text, room}) => {
    console.log(receiverId, text)
    //const user = getUser(receiverId);

    io.in(room).emit('getMessage', {
        senderId,
        text,
        room
    })
  })

  socket.on('typing', ({senderName, room}) => {
    console.log(senderName + " is typing... in room " + room)

    socket.to(room).emit('typing', {
        userTyping: senderName
    })
  })

  socket.on('stop typing', ({senderName, room}) => {

    socket.to(room).emit('stop typing')
  })

//when disconnected
socket.on('disconnect', () => {
    console.log('a user disconnected!')
    removeUser(socket.id)
    io.emit("getUsers", users) //for client to receive new user array after user is removed
})

// ENVOI DE NOTIFICATION
socket.on('sendNotification', async ({ senderId, receiverId, type, text }) => {
    console.log(`Notification: ${senderId} ➡️ ${receiverId} : ${text}`)

    // Enregistrer la notification via ton backend
    const axios = require('axios');
    try {
        const response = await axios.post('http://localhost:4000/api/notifications', {
            senderId,
            receiverId,
            type,
            text,
            isRead: false
        });

        const notification = response.data;

        // Trouver le socket de l'utilisateur ciblé
        const receiver = getUser(receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit('newNotification', notification);
        }
    } catch (error) {
        console.error('Erreur lors de la création de la notification :', error.message);
    }
});


});

