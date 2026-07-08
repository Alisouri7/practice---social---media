const multer = require('multer');
const fs = require('fs');
const path = require('path');

exports.multerUploader = (destination, allowedTypes = /jpeg|jpg|png|webp|mp4|mkv/) => {
    //create directory if doesnt exist
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination)
    };

    //multer configs
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination)
        },

        filename: function (req, file, cb) {
            const unique = Date.now() * Math.floor(Math.random() * 1e9);
            const ext = path.extname(file.originalname);

            cb(null, `${unique}${ext}`)
        }
    });

    const fileFilter = function (req, file, cb)  {
        //allow extension
        if (allowedTypes.test(file.mimetype)) {                        //mimetype: image/jpeg - image/png - application/pdf ... 
            cb(null, true)
        } else {
            cb(new Error('Invalid file type'), false)
        }
    };

    const uploader = multer({
        storage,
        limits: {
            fileSize: 10_000_000
        },
        fileFilter
    });

    return uploader
}