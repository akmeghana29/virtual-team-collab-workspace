const express = require('express')
const multer = require('multer')
const mongoose = require('mongoose')
const { GridFsStorage } = require('multer-gridfs-storage')
const Resource = require('../models/Resource')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => ({
    filename: `${Date.now()}-${file.originalname}`,
    bucketName: 'uploads',
  })
})

const upload = multer({ storage })

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const resource = await Resource.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      teamId: req.body.teamId,
      fileId: req.file.id,
    })
    res.status(201).json(resource)
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message })
  }
})

router.get('/:teamId', authMiddleware, async (req, res) => {
  try {
    const resources = await Resource.find({ teamId: req.params.teamId }).populate('uploadedBy', 'name')
    res.json(resources)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resources', error: err.message })
  }
})

router.delete('/:resourceId', authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.resourceId)
    if (!resource) return res.status(404).json({ message: 'Resource not found' })
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' })
    await bucket.delete(resource.fileId)
    res.json({ message: 'Resource deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete resource', error: err.message })
  }
})

module.exports = router