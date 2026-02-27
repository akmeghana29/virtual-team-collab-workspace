const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'member' },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  avatar: { type: String, default: '' },
  online: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)