const Like = require('../models/Like');
const User = require('../models/User');
const Post = require('../models/Post');
const { Op } = require("sequelize");


exports.likeOrDislike = (req, res, next) => {
    console.log(req.body)
    const {postId, userId, like} = req.body;
    console.log(userId)
    if (like === 1){
        Like.create({
            like: like,
            PostId: postId,
            UserId: userId
        },{
            include: [ User, Post ]
          })
          Post.increment({likes: 1}, { where: {id: postId}})
          .then(() => res.status(200).json({message: 'Post Liked!'}))
          .catch(error => res.status(500).json({error}))
        }

    else if(like === -1){
        Like.create({
            like: like,
            PostId: postId,
            UserId: userId
        },{
            include: [ User, Post ]
          })
          Post.increment({dislikes: 1}, { where: {id: postId}})
          .then(() => res.status(200).json({message: 'Post Disiked!'}))
          .catch(error => res.status(500).json({error}))
    }

    //If post is unliked or undisliked
    else {
        //Find Like in like table whose postId and userId are those send from the frontend
        Like.findOne({ where: {
           // PostId: postId, UserId: userId
            [Op.and]: [{PostId : postId}, {UserId : userId}]
        }
     })
        .then(like => {
            if (!like){
                return res.status(404).json({error: 'Like not found!'})
            }
                if(like.like === 1){
                    console.log(like.PostId)
                    console.log(like.like)
                Post.increment({likes: -1}, { where: {id: like.PostId}})
                Like.destroy({
                    where: {
                        [Op.and]: [{PostId : postId}, {UserId : userId}]
                    }
                    })
                    .then(() =>{
                         return res.status(200).json({message: 'Post Sucessfully unliked!'})
                        })
                    .catch(error => res.status(500).json({error}))
                }
                else if (like.like === -1){
                    Post.increment({dislikes: -1}, { where: {id: like.PostId}})
                    Like.destroy({
                        where: {
                            [Op.and]: [{PostId : postId}, {UserId : userId}]
                        }
                    })
                    .then(() => res.status(200).json({message: 'Post Sucessfully undisliked!'}))
                    .catch(error => res.status(500).json({error}))
                }
        })
        .catch(error => {
            console.log('Are you the fucking error?')
            res.status(500).json({error})
        })
    }
}