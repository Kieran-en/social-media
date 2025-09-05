const Message = require('../models/Message')
const NotificationService = require('../services/notificationService');

exports.createMessage = (req, res, next) => {

    const {text, conversationId, senderId} = req.body

    console.log(req.body)

    const newMessage = Message.create({
        text: text,
        ConversationId: conversationId,
       // UserId: senderId,
        senderId: senderId
    })
    .then(async (savedMessage) => {
      // Envoyer une notification pour le message
      try {
        // Récupérer le destinataire depuis la conversation
        const Conversation = require('../models/Conversation');
        const conversation = await Conversation.findByPk(conversationId);
        if (conversation) {
          const receiverId = conversation.senderId === senderId ? conversation.receiverId : conversation.senderId;
          await NotificationService.notifyMessage(savedMessage.id, senderId, receiverId);
        }
      } catch (notifError) {
        console.error('Erreur lors de l\'envoi de notification de message:', notifError);
      }
      res.status(201).json({message: 'Message created!'});
    })
    .catch(error => res.status(400).json({error}));
}

exports.getMessages = (req, res, next) => {
    Message.findAll({ 
        where: {
            ConversationId: req.params.conversationId
        }
    })
    .then(messages => res.status(200).json(messages))
    .catch(error  => res.status(500).json({error}));
}