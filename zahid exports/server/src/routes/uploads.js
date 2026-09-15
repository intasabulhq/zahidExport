import { Router } from 'express'
import { cloudinary } from '../config/cloudinary.js'
import { requireAuth } from '../middleware/auth.js'
import { uploadProductImages } from '../middleware/upload.js'

const router = Router()
const productFolder = 'zahid-exports/products'

function hasValidImageSignature(file) {
  const buffer = file.buffer

  if (file.mimetype === 'image/jpeg') {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    )
  }

  if (file.mimetype === 'image/png') {
    const pngSignature = Buffer.from([
      0x89, 0x50, 0x4e, 0x47,
      0x0d, 0x0a, 0x1a, 0x0a,
    ])

    return (
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(pngSignature)
    )
  }

  if (file.mimetype === 'image/webp') {
    return (
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString() === 'RIFF' &&
      buffer.subarray(8, 12).toString() === 'WEBP'
    )
  }

  return false
}

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: productFolder,
        resource_type: 'image',
        unique_filename: true,
        overwrite: false,
        transformation: [
          {
            width: 2400,
            height: 2400,
            crop: 'limit',
            quality: 'auto:good',
          },
        ],
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      },
    )

    stream.end(file.buffer)
  })
}

router.post(
  '/images',
  requireAuth,
  uploadProductImages,
  async (req, res) => {
    const files = req.files || []

    if (!files.length) {
      return res.status(400).json({
        error: 'Select at least one image',
      })
    }

    const invalidFile = files.find(
      (file) => !hasValidImageSignature(file),
    )

    if (invalidFile) {
      return res.status(400).json({
        error: `${invalidFile.originalname} is not a valid JPG, PNG or WebP image`,
      })
    }

    const uploadedImages = []

    try {
      for (const file of files) {
        const result = await uploadToCloudinary(file)

        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          originalName: file.originalname,
        })
      }

      res.status(201).json({
        images: uploadedImages,
      })
    } catch (error) {
      await Promise.allSettled(
        uploadedImages.map((image) =>
          cloudinary.uploader.destroy(image.publicId),
        ),
      )

      throw error
    }
  },
)

router.delete('/images', requireAuth, async (req, res) => {
  const publicId = String(req.body?.publicId || '').trim()

  if (!publicId.startsWith(`${productFolder}/`)) {
    return res.status(400).json({
      error: 'Invalid product image public ID',
    })
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true,
  })

  res.json({
    deleted: result.result === 'ok',
    result: result.result,
  })
})

export default router