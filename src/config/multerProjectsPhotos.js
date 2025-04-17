const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../projectPhoto'))
    },
    filename: function(req, file, cb){
        const mimeType = file.mimetype.split('/')[1]
        const fileName = `${req.user.fullName}-${req.body.experienceTitle}.${mimeType}`.trim().replaceAll(' ', '')
        cb(null, fileName)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
    fileFilter: function(req, file, cb) {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/webp",
            "image/tiff",
            "image/svg+xml",
            "image/x-icon",
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); 
        } else {
            cb(null, false);
        }
    }
})

module.exports = upload