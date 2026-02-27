const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true })

module.exports = mongoose.model('Resource', resourceSchema)