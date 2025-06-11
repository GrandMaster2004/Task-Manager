const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../client")))

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  category: {
    type: String,
    maxlength: 50,
  },
  dueDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const Task = mongoose.model("Task", taskSchema)

// Routes

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    res.status(500).json({ error: "Failed to fetch tasks" })
  }
})

// Create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate } = req.body

    const task = new Task({
      title,
      description,
      status: status || "pending",
      priority: priority || "medium",
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })

    const savedTask = await task.save()
    res.status(201).json(savedTask)
  } catch (error) {
    console.error("Error creating task:", error)
    res.status(500).json({ error: "Failed to create task" })
  }
})

// Update a task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, priority, category, dueDate } = req.body

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
        priority,
        category,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)
    res.status(500).json({ error: "Failed to update task" })
  }
})

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params
    const deletedTask = await Task.findByIdAndDelete(id)

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Error deleting task:", error)
    res.status(500).json({ error: "Failed to delete task" })
  }
})

// Get task statistics
app.get("/api/tasks/stats", async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments()
    const completedTasks = await Task.countDocuments({ status: "completed" })
    const inProgressTasks = await Task.countDocuments({ status: "in-progress" })
    const pendingTasks = await Task.countDocuments({ status: "pending" })
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).json({ error: "Failed to fetch statistics" })
  }
})

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
