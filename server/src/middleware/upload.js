import multer from 'multer';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * In-memory upload for a single image field, validated by MIME type and size.
 * The buffer is handed to the controller, which streams it to object storage.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Apenas imagens JPEG, PNG, WebP ou AVIF são permitidas.'));
  },
});

/**
 * Express middleware accepting a single `image` file, normalizing multer errors
 * into the JSON error shape used across the API.
 */
export function uploadImage(req, res, next) {
  upload.single('image')(req, res, (error) => {
    if (!error) {
      next();
      return;
    }
    const statusCode = error instanceof multer.MulterError ? 400 : 400;
    res.status(statusCode).json({ error: error.message });
  });
}

export default uploadImage;
