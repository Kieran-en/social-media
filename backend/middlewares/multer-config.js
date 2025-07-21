const multer = require('multer');

const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'video/mp4': 'mp4',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype] || 'jpg';
        callback(null, name + Date.now() + '.' + extension);
    },
});

// On exporte multer brut (pas .single ici)
module.exports = multer({ storage });
