// Global variables
let tasks = []
let filteredTasks = []
let editingTaskId = null
let isLoading = false

// API Base URL
const API_BASE = "/api"

// DOM Elements
const elements = {
  tasksGrid: document.getElementById("tasksGrid"),
  statsGrid: document.getElementById("statsGrid"),
  searchInput: document.getElementById("searchInput"),
  statusFilter: document.getElementById("statusFilter"),
  priorityFilter: document.getElementById("priorityFilter"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  taskModal: document.getElementById("taskModal"),
  taskForm: document.getElementById("taskForm"),
  closeModal: document.getElementById("closeModal"),
  cancelBtn: document.getElementById("cancelBtn"),
  saveBtn: document.getElementById("saveBtn"),
  modalTitle: document.getElementById("modalTitle"),
  saveText: document.getElementById("saveText"),
  noTasks: document.getElementById("noTasks"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  toastContainer: document.getElementById("toastContainer"),
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
})

function initializeApp() {
  fetchTasks()
  fetchStats()
}

function setupEventListeners() {
  // Search and filters
  elements.searchInput.addEventListener("input", handleSearch)
  elements.statusFilter.addEventListener("change", handleFilter)
  elements.priorityFilter.addEventListener("change", handleFilter)

  // Modal controls
  elements.addTaskBtn.addEventListener("click", () => openModal())
  elements.closeModal.addEventListener("click", closeModal)
  elements.cancelBtn.addEventListener("click", closeModal)
  elements.taskForm.addEventListener("submit", handleSubmit)

  // Close modal on backdrop click
  elements.taskModal.addEventListener("click", (e) => {
    if (e.target === elements.taskModal) {
      closeModal()
    }
  })

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elements.taskModal.classList.contains("show")) {
      closeModal()
    }
  })
}

// API Functions
async function fetchTasks() {
  try {
    showLoading(true)
    const response = await fetch(`${API_BASE}/tasks`)
    if (!response.ok) throw new Error("Failed to fetch tasks")

    tasks = await response.json()
    filteredTasks = [...tasks]
    renderTasks()
    showNoTasks(tasks.length === 0)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    showToast("Failed to load tasks", "error")
  } finally {
    showLoading(false)
  }
}

async function fetchStats() {
  try {
    const response = await fetch(`${API_BASE}/tasks/stats`)
    if (!response.ok) throw new Error("Failed to fetch stats")

    const stats = await response.json()
    renderStats(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
  }
}

async function createTask(taskData) {
  try {
    showLoading(true)
    const response = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })

    if (!response.ok) throw new Error("Failed to create task")

    showToast("Task created successfully!", "success")
    fetchTasks()
    fetchStats()
    closeModal()
  } catch (error) {
    console.error("Error creating task:", error)
    showToast("Failed to create task", "error")
  } finally {
    showLoading(false)
  }
}

async function updateTask(id, taskData) {
  try {
    showLoading(true)
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })

    if (!response.ok) throw new Error("Failed to update task")

    showToast("Task updated successfully!", "success")
    fetchTasks()
    fetchStats()
    closeModal()
  } catch (error) {
    console.error("Error updating task:", error)
    showToast("Failed to update task", "error")
  } finally {
    showLoading(false)
  }
}

async function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return

  try {
    showLoading(true)
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Failed to delete task")

    showToast("Task deleted successfully!", "success")
    fetchTasks()
    fetchStats()
  } catch (error) {
    console.error("Error deleting task:", error)
    showToast("Failed to delete task", "error")
  } finally {
    showLoading(false)
  }
}

async function toggleTaskStatus(task) {
  const newStatus = task.status === "completed" ? "pending" : "completed"
  const updatedTask = { ...task, status: newStatus }

  try {
    const response = await fetch(`${API_BASE}/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })

    if (!response.ok) throw new Error("Failed to update task status")

    showToast(`Task marked as ${newStatus}!`, "success")
    fetchTasks()
    fetchStats()
  } catch (error) {
    console.error("Error updating task status:", error)
    showToast("Failed to update task status", "error")
  }
}

// Render Functions
function renderTasks() {
  if (filteredTasks.length === 0) {
    elements.tasksGrid.innerHTML = ""
    showNoTasks(true)
    return
  }

  showNoTasks(false)

  // Sort tasks: overdue first, then by priority, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aOverdue = isOverdue(a)
    const bOverdue = isOverdue(b)

    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1

    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff

    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1

    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  elements.tasksGrid.innerHTML = sortedTasks.map((task) => createTaskCard(task)).join("")
}

function createTaskCard(task) {
  const overdue = isOverdue(task)
  const dueDate = task.dueDate ? formatDate(task.dueDate) : null

  return `
        <div class="task-card ${task.status} ${overdue ? "overdue" : ""}" data-id="${task._id}">
            <div class="task-header">
                <button class="task-status-btn" onclick="toggleTaskStatus('${task._id}')">
                    <span class="material-icons" style="color: ${task.status === "completed" ? "#4caf50" : "#ccc"}">
                        ${task.status === "completed" ? "check_circle" : "radio_button_unchecked"}
                    </span>
                </button>
                <div class="task-title ${task.status === "completed" ? "completed" : ""}">
                    ${escapeHtml(task.title)}
                </div>
            </div>
            
            <div class="task-body">
                <div class="task-description">
                    ${escapeHtml(task.description)}
                </div>
                
                ${
                  task.category || task.dueDate
                    ? `
                    <div class="task-meta">
                        ${
                          task.category
                            ? `
                            <div class="task-meta-item">
                                <span class="material-icons">category</span>
                                <span>${escapeHtml(task.category)}</span>
                            </div>
                        `
                            : ""
                        }
                        ${
                          task.dueDate
                            ? `
                            <div class="task-meta-item ${overdue ? "overdue" : ""}">
                                <span class="material-icons">event</span>
                                <span>Due: ${dueDate}</span>
                                ${overdue ? '<span style="font-weight: bold; color: #f44336;">(OVERDUE)</span>' : ""}
                            </div>
                        `
                            : ""
                        }
                    </div>
                `
                    : ""
                }
                
                <div class="task-tags">
                    <span class="tag status-${task.status}">${task.status.replace("-", " ")}</span>
                    <span class="tag priority-${task.priority}">${task.priority}</span>
                </div>
                
                <div class="task-actions">
                    <button class="btn btn-secondary" onclick="editTask('${task._id}')">
                        <span class="material-icons">edit</span>
                        Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteTask('${task._id}')">
                        <span class="material-icons">delete</span>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `
}

function renderStats(stats) {
  const statsData = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: "assignment",
      class: "total",
      color: "#1976d2",
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: "check_circle",
      class: "completed",
      color: "#4caf50",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: "schedule",
      class: "progress",
      color: "#ff9800",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: "trending_up",
      class: "rate",
      color: "#9c27b0",
    },
  ]

  elements.statsGrid.innerHTML = statsData
    .map(
      (stat) => `
        <div class="stat-card ${stat.class}">
            <div class="stat-icon">
                <span class="material-icons" style="color: ${stat.color}">${stat.icon}</span>
            </div>
            <div class="stat-content">
                <h3>${stat.value}</h3>
                <p>${stat.title}</p>
            </div>
        </div>
    `,
    )
    .join("")
}

// Modal Functions
function openModal(task = null) {
  editingTaskId = task ? task._id : null
  elements.modalTitle.textContent = task ? "Edit Task" : "Add New Task"
  elements.saveText.textContent = task ? "Update Task" : "Save Task"

  if (task) {
    populateForm(task)
  } else {
    elements.taskForm.reset()
    document.getElementById("taskStatus").value = "pending"
    document.getElementById("taskPriority").value = "medium"
  }

  elements.taskModal.classList.add("show")
  document.getElementById("taskTitle").focus()
}

function closeModal() {
  elements.taskModal.classList.remove("show")
  elements.taskForm.reset()
  editingTaskId = null
}

function populateForm(task) {
  document.getElementById("taskTitle").value = task.title
  document.getElementById("taskDescription").value = task.description
  document.getElementById("taskCategory").value = task.category || ""
  document.getElementById("taskDueDate").value = task.dueDate ? task.dueDate.split("T")[0] : ""
  document.getElementById("taskStatus").value = task.status
  document.getElementById("taskPriority").value = task.priority
}

// Event Handlers
function handleSubmit(e) {
  e.preventDefault()

  const formData = new FormData(elements.taskForm)
  const taskData = {
    title: document.getElementById("taskTitle").value.trim(),
    description: document.getElementById("taskDescription").value.trim(),
    category: document.getElementById("taskCategory").value,
    dueDate: document.getElementById("taskDueDate").value,
    status: document.getElementById("taskStatus").value,
    priority: document.getElementById("taskPriority").value,
  }

  if (!taskData.title || !taskData.description) {
    showToast("Please fill in all required fields", "error")
    return
  }

  if (editingTaskId) {
    updateTask(editingTaskId, taskData)
  } else {
    createTask(taskData)
  }
}

function handleSearch() {
  applyFilters()
}

function handleFilter() {
  applyFilters()
}

function applyFilters() {
  const searchTerm = elements.searchInput.value.toLowerCase()
  const statusFilter = elements.statusFilter.value
  const priorityFilter = elements.priorityFilter.value

  filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  renderTasks()
}

// Global functions for onclick handlers
window.editTask = (id) => {
  const task = tasks.find((t) => t._id === id)
  if (task) {
    openModal(task)
  }
}

window.deleteTask = (id) => {
  deleteTask(id)
}

window.toggleTaskStatus = (id) => {
  const task = tasks.find((t) => t._id === id)
  if (task) {
    toggleTaskStatus(task)
  }
}

// Utility Functions
function isOverdue(task) {
  return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function showLoading(show) {
  elements.loadingOverlay.style.display = show ? "flex" : "none"
  isLoading = show
}

function showNoTasks(show) {
  elements.noTasks.style.display = show ? "block" : "none"
}

function showToast(message, type = "info") {
  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.textContent = message

  elements.toastContainer.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 4000)
}
