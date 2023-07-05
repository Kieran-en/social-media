const Conversation = require('../models/Conversation')
const User = require('../models/User')
const { Op } = require("sequelize");

exports.createConversation = (req, res, next) => {

    const {receiverId, senderId} = req.body

    Conversation.findOne({
        where: {
            [Op.and]: [{
                 receiverId: {
                    [Op.or] : [receiverId, senderId]
                    },
                 senderId: {
                    [Op.or] : [receiverId, senderId]
                    }
              }]
        }
    })
    .then(conversation => {
        console.log('ASKDBasd', conversation)
        if(!conversation){
            Promise.all([
                Conversation.create({
                receiverId: receiverId,
                senderId: senderId,
                UserId: senderId
            }),
            //.then(() => res.status(201).json({message: 'Conversation Created!'}))
           // .catch((error) => res.status(500).json({error})),
            Conversation.findOne({
                where: {
                    [Op.and]: [{
                         receiverId: receiverId ,
                         senderId: senderId 
                      }]
                }
            })
            .then((conversation) => res.status(200).json(conversation))
            .catch((error) => res.status(500).json({error}))
        ])
        }
        else {
            Conversation.findOne({
                where: {
                    [Op.and]: [{
                        receiverId: {
                           [Op.or] : [receiverId, senderId]
                           },
                        senderId: {
                           [Op.or] : [receiverId, senderId]
                           }
                     }]
                }
            })
            .then((conversation) => res.status(200).json(conversation))
            .catch((error) => res.status(500).json({error}))
        }
    })

}

exports.getConversations = (req, res, next) => {
    Conversation.findAll({ 
        where: {
            senderId: req.params.senderId
        },
        include: [User]
    })
    .then(conversations => res.status(200).json(conversations))
    .catch(error  => res.status(500).json({error}));
}

exports.getSpecificConversation = (req, res, next) => {

    const {receiverId, senderId} = req.params

    Conversation.findOne({
        where: {
            [Op.and]: [{
                 receiverId: receiverId ,
                 senderId: senderId 
              }]
        }
    })
    .then((conversation) => res.status(200).json(conversation))
    .catch((error) => res.status(500).json({error}))
}