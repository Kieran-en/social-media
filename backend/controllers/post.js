const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');

exports.displayPosts = (req, res, next) => {
  Post.findAll({
    include: User,
    order: [['updatedAt', 'DESC']],
  })
  .then(posts => res.status(200).json(posts))
  .catch(error => res.status(500).json({ error }));
};


exports.getPost = (req, res, next) => {
    Post.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(post => res.status(200).json(post))
    .catch(error => res.status(404).json({error}))
}

exports.createPost = (req, res, next) => {
   const postObject = req.file ? {
    text: req.body.text,
    likes: 0,
    dislikes: 0,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    UserId: req.body.userId
   } : {
    text: req.body.text,
    likes: 0,
    dislikes: 0,
    UserId: req.body.userId
   }

    const post = Post.build({
        ...postObject,
    },
    {
        include: [ User ]
      })
    post.save()
    .then(() => res.status(201).json({message: 'Post Created!'}))
    .catch(error => res.status(400).json({error}));
}

exports.modifyPost = (req, res, next) => {
    console.log(req.body)
    const postObject = req.file ? { 
        text: req.body.text,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    }
    
    Post.update({
        ...postObject
    }, {
        where: {
        id: req.body.postId
    }
})

.then(() => res.status(201).json({message: 'Post Modified!'}))
.catch(error => res.status(401).json({error}))

}

exports.modifyProfile = (req, res, next) => {
    User.update({
        profileImg: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }, {
        where: {
        id: req.body.postId
    }
})
}

exports.deletePost = (req, res, next) => { 
    console.log(req.params.id)
  console.log("THIS IS ITTTTTTTTTTT" + req.params.id)
    Post.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(post => {
        if(!post){
            return res.status(404).json({message: 'Post Not Found!'})
        }
        if(req.auth.userId !== post.UserId){
            console.log(req.auth.userId);
            console.log(post.UserId);
            return res.status(401).json({message: 'Unauthorized request!'})
        }
       else{ 

        if(post.imageUrl){
            filename = post.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Post.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(() => res.status(200).json({message: 'Post deleted!'}))
                .catch(error => {
                    res.status(500).json({error})
                })
            })
        } else {
            Post.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then(() => res.status(200).json({message: 'Post deleted!'}))
            .catch(error => {
                res.status(500).json({error})
            })
        }
       }
    })
    .catch(error => {
        console.log('Are you the error?')
        res.status(500).json({error})
    })
}