import { Router } from 'express';
import multer from 'multer';

export const mediaRouter = Router();

const upload = multer({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max file size limit
});

mediaRouter.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const mediaUrl = `https://storage.novalink.io/uploads/${Date.now()}_${file.originalname}`;

  res.json({
    success: true,
    file: {
      name: file.originalname,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      mimeType: file.mimetype,
      url: mediaUrl,
      thumbnailUrl: file.mimetype.startsWith('image/') ? mediaUrl : null,
      duration: file.mimetype.startsWith('audio/') ? 12 : 0,
      compressed: true,
    },
  });
});
