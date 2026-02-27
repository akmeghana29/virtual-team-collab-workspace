class MinHeap {
  constructor() {
    this.heap = []
  }

  insert(task) {
    this.heap.push(task)
    this._bubbleUp(this.heap.length - 1)
  }

  extractMin() {
    if (this.heap.length === 0) return null
    const min = this.heap[0]
    const last = this.heap.pop()
    if (this.heap.length > 0) {
      this.heap[0] = last
      this._sinkDown(0)
    }
    return min
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2)
      if (this._priority(this.heap[parent]) <= this._priority(this.heap[i])) break
      ;[this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]]
      i = parent
    }
  }

  _sinkDown(i) {
    const n = this.heap.length
    while (true) {
      let smallest = i
      const left = 2 * i + 1
      const right = 2 * i + 2
      if (left < n && this._priority(this.heap[left]) < this._priority(this.heap[smallest])) smallest = left
      if (right < n && this._priority(this.heap[right]) < this._priority(this.heap[smallest])) smallest = right
      if (smallest === i) break
      ;[this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]]
      i = smallest
    }
  }

  _priority(task) {
    return new Date(task.deadline).getTime()
  }

  size() {
    return this.heap.length
  }
}

const scheduleTasks = (tasks) => {
  const heap = new MinHeap()
  tasks.forEach(task => {
    if (!task.done) heap.insert(task)
  })
  const scheduled = []
  while (heap.size() > 0) {
    scheduled.push(heap.extractMin())
  }
  return scheduled
}

const rescheduleOnCompletion = (tasks, completedTaskId) => {
  const remaining = tasks.filter(t => t._id.toString() !== completedTaskId && !t.done)
  return scheduleTasks(remaining)
}

module.exports = { scheduleTasks, rescheduleOnCompletion }