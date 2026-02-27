const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  deadline: { type: Date, required: true },
  done: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  priority: { type: Number, default: 0 },
  rescheduled: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)