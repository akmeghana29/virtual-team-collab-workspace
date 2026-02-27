const express = require('express')
const Task = require('../models/Task')
const authMiddleware = require('../middleware/auth')
const { scheduleTasks, rescheduleOnCompletion } = require('../lib/taskScheduler')

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, assignedTo, teamId, deadline } = req.body
    const task = await Task.create({ name, assignedTo, teamId, deadline })
    const allTasks = await Task.find({ teamId, done: false })
    const scheduled = scheduleTasks(allTasks)
    res.status(201).json({ task, scheduledQueue: scheduled })
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message })
  }
})

router.get('/:teamId', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ teamId: req.params.teamId }).populate('assignedTo', 'name email avatar')
    const scheduled = scheduleTasks(tasks.filter(t => !t.done))
    res.json({ tasks, scheduledQueue: scheduled })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message })
  }
})

router.patch('/:taskId/complete', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { done: true, completedAt: new Date() },
      { new: true }
    )
    const allTasks = await Task.find({ teamId: task.teamId })
    const rescheduled = rescheduleOnCompletion(allTasks, req.params.taskId)
    res.json({ task, rescheduledQueue: rescheduled })
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete task', error: err.message })
  }
})

router.delete('/:taskId', authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId)
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message })
  }
})

module.exports = router