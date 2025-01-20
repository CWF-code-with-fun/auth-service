import express from 'express';
import upload from '../middleware/upload';

const router = express.Router();

router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log('🚀 ~ upload ~ err:', err);
            return res
                .status(400)
                .json({ success: false, message: err.message });
        }
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: 'No file uploaded' });
        }
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            file: req.file,
        });
    });
});

export default router;
