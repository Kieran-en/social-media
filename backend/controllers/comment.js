const Comment = require('../models/Comment');
const Post = require('../models/Post')
const User = require('../models/User')

exports.creatComment = (req, res, next) => {
    //const commentObject = req.body.comment;
    // console.log(commentObject.PostId)
    console.log('YEAHHHHHH' + req.body.text)
    const comment = Comment.build({
        text: req.body.text,
        PostId: req.body.PostId,
        UserId: req.body.userId
    },
    {
        include: [Post, User]
    })
    comment.save()
    .then(() => res.status(201).json({message: 'Comment Created'}))
    .catch((error) => res.status(500).json({error}))
}

exports.modifyComment = (req, res, next) => {
    Comment.findOne({where : {
        id: req.params.id
    }})
    .then(comment => {
        comment.update({
            comment: req.body.comment
        })
        .then(() => res.status(201).json({message: 'Comment modified!'}))
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(400).json({error}))
}

exports.getComments = (req, res, next) => {
    Comment.findAll({ include: [Post, User], order: [['updatedAt', 'DESC']]
    })
    .then((comments) => res.status(200).json(comments))
    .catch((error) => res.status(500).json({error}))
}

