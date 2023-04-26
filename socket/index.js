const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
//const { Server } = require("socket.io");
//const io = new Server(server);

let users = [];

const addUser = (userId, socketId) => {
    let index = users.findIndex(user => user.userId === userId)

    //if the userId in parameters is not inside the users array yet, add it
    if (index === -1){
        users.push({userId, socketId})
    }
    
}

console.log("usersss" + users)


const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

const io = require("socket.io")(5500, {
    cors: {
        origin: ["http://localhost:4000"],
    },
})

io.on('connection', (socket) => {
    //when connected
  console.log('a user connected!')

  //Receive userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id) //We add both userId and socketId to have a unique pair because at each session, the socketId changes
    io.emit("getUsers", users) //for client to receive new user array after user is added
  })


  socket.on("join_room", ({room, senderId}) => {
    socket.join(room)
    console.log(senderId + " has joined the room " + room)
  })

  //Send and get message
  socket.on('sendMessage', ({senderId, receiverId, text, room}) => {
    console.log(receiverId)
    //const user = getUser(receiverId);
    io.to(room).emit('getMessage', {
        senderId,
        text
    })
  })

  socket.on('typing', ({senderName, room}) => {
    console.log(senderName + " is typing...")

    io.to(room).emit('userTyping', {
        userTyping: senderName
    })
  })

//when disconnected
socket.on('disconnect', () => {
    console.log('a user disconnected!')
    removeUser(socket.id)
    io.emit("getUsers", users) //for client to receive new user array after user is removed
})

});

