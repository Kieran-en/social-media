const express = require('express');
const app = express();
const postRoutes = require('../backend/routes/post');
const commentRoutes = require('../backend/routes/comment');
const userRoutes = require('../backend/routes/user');
const likeRoutes = require('./routes/like')
const followRoutes = require('./routes/follow')
const messageRoutes = require('./routes/message')
const conversationRoutes = require('./routes/conversation')
const userAdminRoutes = require('./routes/userAdmin');
const mysql = require('mysql');
const path = require('path');
const db = require('./config');
const cors = require('cors');
const User = require('./models/User');
const Post = require('./models/Post');
const Event = require('./models/Event');
const sequelize = require('sequelize');
const groupRoutes = require('./routes/group');
const groupMessageRoutes = require('./routes/groupMessage');
const Group = require('./models/Group');
const GroupMember = require('./models/GroupMember');
const GroupMessage = require('./models/GroupMessage');
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes')




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

  db.sync({ alter: true })
  .then(() => {
    console.log('Synched!'); // Tu peux le garder pour confirmer que Sequelize est bien connecté à la DB
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation :', error);
  });



app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/users', userAdminRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/groups', groupRoutes);
app.use('/api/groupMessages', groupMessageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);

module.exports = app;