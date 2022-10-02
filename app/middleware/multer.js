const { log } = require('console');
const multer = require('multer');

const MIME_TYPES = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpeg",
    "image/png" : "png",
    'image/gif': 'gif',
    'image/webp': 'webp'
}

const upload = multer({
    storage : multer.diskStorage({
        // mkdir register
        destination: (req, file, cb) => {
            cb(null, 'app/images');
        },
        // config name img
        filename : (req, file, cb) => {
            // replace space by underscore 
            const name = file.originalname.split(' ').join('_');
            const extension = MIME_TYPES[file.mimetype];
            cb(null, name + Date.now() + '.' + extension)
        }
    }), 
    // limit Size of file : 2mo
    limits: {
        fileSize: 2000000  
    }
});

// Exporte le SEUL fichier image du storage
module.exports = multer(upload).single('image');
