const Conversation = require('../models/Conversation')
const User = require('../models/User')

exports.createConversation = (req, res, next) => {

    const {receiverId, senderId} = req.body

    const newConversation = Conversation.create({
        receiverId: receiverId,
        senderId: senderId
    })
    .then(() => res.status(201).json({message: 'Conversation created!'}))
    .catch(error => res.status(400).json({error}));
}

exports.getConversations = (req, res, next) => {
    console.log("SENDER ID IS " + req.params.senderId)
    Conversation.findAll({ 
        where: {
            senderId: req.params.senderId
        },
        include: { model: User, as: 'senderId' }
    })
    .then(conversations => res.status(200).json(conversations))
    .catch(error  => res.status(500).json({error}));
}