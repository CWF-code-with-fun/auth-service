import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/videos',
    filename: (req, file, cb) => {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
        );
    },
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 * 5 }, // 5GB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
}).single('video');

// Check file type
function checkFileType(
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) {
    const filetypes = /mp4|mkv|mov|avi/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Videos only!'));
    }
}

export default upload;
