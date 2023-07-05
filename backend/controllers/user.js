const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    const {name, email, password, confirmedPassword} = req.body;

        bcrypt.hash(password, 10)
        .then(async (hash) => {
           const user = await User.build({
                name: name,
                email: email,
                password: hash,
            })
            user.save()
            .then(() =>  res.status(201).json({message: 'User created!'}))
            .catch(error => {return res.status(400).json({error})})
        })
        .catch(error => {return res.status(500).json({error})})

};

exports.login = (req, res, next) => {
    const {email, password} = req.body;
    console.log(email)
    User.findOne({where :{
        email: email,
    }})
    .then(user => {
        if(!user){
           return res.status(401).json({message: 'User Not Found!'})
        }
        bcrypt.compare(password, user.password)
        .then(valid => {
            if(!valid){
               return res.status(401).json({message: 'Password Not Valid!'});
            }
            res.status(200).json({
                userId: user.id,
                username: user.name,
                token: jwt.sign({
                    userId: user.id,
                    username: user.name,
                    profileImg: user.profileImg
                },
                    'RANDOM_SECRET_KEY',
                    {expiresIn: '24h'}
                    ) 
            })
        })
        .catch(error => res.status(500).json({error}))
    })
    .catch(error => res.status(500).json({error}))
}

exports.getUser = (req, res, next) => {
    User.findOne({where : {
        name: req.params.username
    }
},
)
.then(user => res.status(200).json(user))
.catch(error => res.status(500).json({error}))
}

exports.getFriends = (req, res, next) => {
    console.log("ASDAUJDHuaoWE")
    User.findOne({where : {
        name: req.params.username
    }, include: 'following_user_id'
},
)
.then(user => res.status(200).json(user))
.catch(error => res.status(500).json({error}))
}

exports.deleteUser = (req, res, next) => {
    User.findOne({
        where: {
            id: req.auth.userId
        }
    })
    .then((user) => {
        if(!user){
            return res.status(404).json({message: 'User Not Found!'})
        }
        if (user.id !== req.auth.userId){
            return res.status(401).json({message: 'Not authorized!'})
        }
        User.destroy({
            where: {
                name: req.params.username
            }
        })
        .then(() => res.status(200).json({message: 'Deleted Sucessfully'}))
        .catch(error => res.status(500).json({error}))
    })
    .catch(error => res.status(500).json({error}))
}


exports.modifyUserData = (req, res, next) => {
    console.log(req.file)
    console.log(req.body.name)
    console.log(req.body.email)

    const userObject = req.file ? {
        name: req.body.name,
        email: req.body.email,
        profileImg: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        name: req.body.name,
        email: req.body.email,
    }

    User.update({
        ...userObject
    }, {
        where : {
            id: req.auth.userId
        }
    })
    .then(() => res.status(201).json({message: 'User data updated!'}))
    .catch(error => res.status(500).json({error}))
}