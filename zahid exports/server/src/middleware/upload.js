import multer from 'multer'

const allowedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

const productImageUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 12,
  },

  fileFilter(req, file, callback) {
    if (!allowedImageTypes.has(file.mimetype)) {
      const error = new Error('Only JPG, PNG and WebP images are allowed')
      error.status = 400
      return callback(error)
    }

    callback(null, true)
  },
}).array('images', 12)

export function uploadProductImages(req, res, next) {
  productImageUpload(req, res, (error) => {
    if (!error) return next()

    if (error instanceof multer.MulterError) {
      const uploadError = new Error(
        error.code === 'LIMIT_FILE_SIZE'
          ? 'Each image must be 5 MB or smaller'
          : 'Maximum 12 images are allowed per product',
      )

      uploadError.status = 400
      return next(uploadError)
    }

    next(error)
  })
}