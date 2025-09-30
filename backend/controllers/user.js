const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig, bcrypt: bcryptConfig } = require('../config/security');

exports.signup = async (req, res, next) => {
    try {
        const { name, email, password, confirmedPassword } = req.body;

        // Validation des mots de passe
        if (password !== confirmedPassword) {
            return res.status(400).json({
                error: 'Les mots de passe ne correspondent pas'
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                error: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Hacher le mot de passe avec le niveau de sécurité configuré
        const hash = await bcrypt.hash(password, bcryptConfig.rounds);
        
        const user = await User.create({
            name: name,
            email: email,
            password: hash,
            isActive: true
        });

        // Ne pas retourner le mot de passe
        const { password: _, ...userWithoutPassword } = user.toJSON();
        
        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation des inputs
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email et mot de passe requis'
            });
        }

        // Rechercher l'utilisateur par email
        const user = await User.findOne({ 
            where: { email: email.toLowerCase().trim() }
        });

        if (!user) {
            // Message générique pour éviter l'énumération d'utilisateurs
            return res.status(401).json({
                error: 'Identifiants invalides'
            });
        }

        // Vérifier si le compte est actif
        if (!user.isActive) {
            return res.status(403).json({
                error: 'Compte désactivé. Contactez l\'administrateur.'
            });
        }

        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Identifiants invalides'
            });
        }

        // Créer le token JWT sécurisé
        const tokenPayload = {
            userId: user.id,
            username: user.name,
            role: user.role,
            profileImg: user.profileImg,
            iat: Math.floor(Date.now() / 1000) // Timestamp de création
        };

        const token = jwt.sign(
            tokenPayload,
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        // Réponse de connexion réussie
        res.status(200).json({
            message: 'Connexion réussie',
            userId: user.id,
            username: user.name,
            role: user.role,
            profileImg: user.profileImg,
            token: token
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
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


exports.modifyUserData = async (req, res, next) => {
    try {
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

        // Si un nouveau mot de passe est fourni, le hasher
        if (req.body.newPassword) {
            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
            userObject.password = hashedPassword;
        }

        await User.update({
            ...userObject
        }, {
            where : {
                id: req.auth.userId
            }
        });

        res.status(201).json({message: 'User data updated!'});
    } catch (error) {
        res.status(500).json({error});
    }
}

// Fonction de recherche d'utilisateurs
exports.searchUsers = async (req, res, next) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        
        if (!query || query.trim().length < 2) {
            return res.status(400).json({ 
                message: 'La requête de recherche doit contenir au moins 2 caractères' 
            });
        }

        const offset = (page - 1) * limit;
        const searchTerm = `%${query.trim()}%`;

        // Recherche par nom ou email
        const users = await User.findAll({
            where: {
                [require('sequelize').Op.or]: [
                    { name: { [require('sequelize').Op.like]: searchTerm } },
                    { email: { [require('sequelize').Op.like]: searchTerm } }
                ],
                isActive: true // Seulement les utilisateurs actifs
            },
            attributes: ['id', 'name', 'email', 'profileImg', 'role', 'followers', 'following'],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['name', 'ASC']]
        });

        const totalUsers = await User.count({
            where: {
                [require('sequelize').Op.or]: [
                    { name: { [require('sequelize').Op.like]: searchTerm } },
                    { email: { [require('sequelize').Op.like]: searchTerm } }
                ],
                isActive: true
            }
        });

        res.status(200).json({
            users,
            totalUsers,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalUsers / limit),
            hasMore: offset + users.length < totalUsers
        });
    } catch (error) {
        console.error('Erreur lors de la recherche d\'utilisateurs:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la recherche d\'utilisateurs',
            error: error.message 
        });
    }
}