const Message = require('../models/Message')

exports.createMessage = (req, res, next) => {

    const {text, conversationId, senderId} = req.body

    console.log(req.body)

    const newMessage = Message.create({
        text: text,
        ConversationId: conversationId,
       // UserId: senderId,
        senderId: senderId
    })
    .then(() => res.status(201).json({message: 'Message created!'}))
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