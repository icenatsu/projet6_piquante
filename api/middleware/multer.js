const multer = require('multer');

// Le dictionnaire des mymes type
const MIME_TYPES = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpg",
    "image/png" : "png"
}


const storage = multer.diskStorage({
    // mkdir register
    destination: (req, file, cb) => {
        cb(null, 'api/images');
    },
    // config name img
    filename : (req, file, cb) => {
        // remplace space by underscore 
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        cb(null, name + Date.now() + '.' + extension)
    }
})

// Exporte le SEUL fichier image du storage
module.exports = multer({storage: storage}).single('image');
