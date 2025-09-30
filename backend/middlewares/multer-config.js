const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { upload: uploadConfig } = require('../config/security');

// Types MIME autorisés avec extensions correspondantes
const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'video/mp4': 'mp4',
};

// Configuration du stockage sécurisé
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        try {
            // Générer un nom de fichier sécurisé avec crypto
            const randomName = crypto.randomBytes(16).toString('hex');
            const extension = MIME_TYPES[file.mimetype];
            
            if (!extension) {
                return callback(new Error('Type de fichier non autorisé'), null);
            }
            
            const secureFilename = `${randomName}_${Date.now()}.${extension}`;
            callback(null, secureFilename);
        } catch (error) {
            callback(error, null);
        }
    },
});

// Filtrage des fichiers avec validation stricte
const fileFilter = (req, file, callback) => {
    try {
        // Vérifier le type MIME
        if (!uploadConfig.allowedMimeTypes.includes(file.mimetype)) {
            const error = new Error('Type de fichier non autorisé. Types acceptés: images (JPEG, PNG, GIF) et vidéos MP4.');
            error.code = 'INVALID_FILE_TYPE';
            return callback(error, false);
        }

        // Vérifier l'extension du fichier original
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4'];
        
        if (!allowedExtensions.includes(fileExtension)) {
            const error = new Error('Extension de fichier non autorisée.');
            error.code = 'INVALID_FILE_EXTENSION';
            return callback(error, false);
        }

        // Vérifier que le nom du fichier ne contient pas de caractères dangereux
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        if (sanitizedOriginalName !== file.originalname) {
            console.warn(`Nom de fichier sanitisé: ${file.originalname} -> ${sanitizedOriginalName}`);
        }

        callback(null, true);
    } catch (error) {
        callback(error, false);
    }
};

// Configuration multer avec limites de sécurité
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: uploadConfig.maxFileSize, // Limite de taille (5MB par défaut)
        files: 1, // Un seul fichier à la fois
        fields: 10, // Limite le nombre de champs
        fieldNameSize: 100, // Limite la taille des noms de champs
        fieldSize: 1000000 // Limite la taille des champs (1MB)
    }
});

// Middleware de gestion d'erreurs pour multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        switch (error.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    error: 'Fichier trop volumineux',
                    message: `La taille maximale autorisée est de ${uploadConfig.maxFileSize / 1024 / 1024}MB`
                });
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({
                    error: 'Trop de fichiers',
                    message: 'Un seul fichier autorisé à la fois'
                });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                    error: 'Champ de fichier inattendu',
                    message: 'Le champ de fichier spécifié n\'est pas autorisé'
                });
            default:
                return res.status(400).json({
                    error: 'Erreur d\'upload',
                    message: error.message
                });
        }
    }
    
    if (error.code === 'INVALID_FILE_TYPE' || error.code === 'INVALID_FILE_EXTENSION') {
        return res.status(400).json({
            error: 'Type de fichier invalide',
            message: error.message
        });
    }
    
    next(error);
};

module.exports = { upload, handleMulterError };
