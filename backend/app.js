const express = require('express');
const app = express();
const postRoutes = require('../backend/routes/post');
const commentRoutes = require('../backend/routes/comment');
const userRoutes = require('../backend/routes/user');
const likeRoutes = require('./routes/like')
const followRoutes = require('./routes/follow')
const messageRoutes = require('./routes/message')
const conversationRoutes = require('./routes/conversation')
const mysql = require('mysql');
const path = require('path');
const db = require('./config');
const cors = require('cors');
const User = require('./models/User');
const Post = require('./models/Post');
const sequelize = require('sequelize');


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(cors());

app.use(express.json());
//app.use(bodyParser.text());

db.authenticate()
  .then(() => console.log("Database connected sucessfully..."))
  .catch((error) => console.log('Error :' + error))

  db.sync({alter: true, force: true}).then(() => {
    // Now the `users` table in the database corresponds to the model definition
   console.log('Synched!');
  });


app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;