# 📋 Task Management Application

A full-stack task management application built with **Express.js**, **MongoDB**, and **Vanilla JavaScript**. This application provides a clean, responsive interface for managing tasks with features like priority levels, due dates, categories, and real-time statistics.

### 🎯 Core Functionality

- ✅ **CRUD Operations** - Create, Read, Update, Delete tasks
- ✅ **Task Status Management** - Pending, In Progress, Completed
- ✅ **Priority Levels** - Low, Medium, High priority tasks
- ✅ **Categories** - Organize tasks by Work, Personal, Shopping, etc.
- ✅ **Due Dates** - Set and track task deadlines
- ✅ **Search & Filter** - Real-time search and filtering capabilities

### 📊 Advanced Features

- ✅ **Statistics Dashboard** - Task completion rates and progress tracking
- ✅ **Overdue Alerts** - Visual indicators for overdue tasks
- ✅ **Responsive Design** - Works perfectly on desktop and mobile
- ✅ **Real-time Updates** - Instant UI updates after operations
- ✅ **Toast Notifications** - User-friendly success/error messages

## 🏗️ Project Structure

\`\`\`
task-management-app/
├── server/ # Backend (Express.js + MongoDB)
│ ├── server.js # Main server file with API routes
│ ├── package.json # Server dependencies
│ ├── .env # Environment variables
│ └── .gitignore # Git ignore file
├── client/ # Frontend (Vanilla JavaScript)
│ ├── index.html # Main HTML file
│ ├── styles.css # CSS styles with Material Design
│ └── script.js # JavaScript functionality
├── README.md # Project documentation
└── package.json # Root package.json
\`\`\`

## 🛠️ Technology Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **Vanilla JavaScript** - No frameworks, pure JS
- **Material Icons** - Google Material Design icons
- **Responsive Design** - Mobile-first approach

## 🚀 Quick Start
### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/task-management-app.git
   cd task-management-app
   \`\`\`

2. **Install server dependencies**
   \`\`\`bash
   cd server
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash

   # Create .env file in server directory

   cp .env.example .env

   # Edit .env file with your MongoDB connection string

   MONGODB_URI=mongodb://localhost:27017/taskmanager
   PORT=3001
   \`\`\`

4. **Start MongoDB** (if using local installation)
   \`\`\`bash

   # Windows

   net start MongoDB
   \`\`\`

5. **Start the application**
   \`\`\`bash

   # From server directory

   npm start

   # For development with auto-restart

   npm run dev
   \`\`\`

6. **Access the application**
   - Frontend: http://localhost:3001
   - API Health Check: http://localhost:3001/api/health
   - API Documentation: http://localhost:3001/api/tasks

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

\`\`\`env

# Database Configuration

MONGODB_URI=mongodb://localhost:27017/taskmanager

# Server Configuration

PORT=3001
NODE_ENV=development

# For MongoDB Atlas (Cloud Database)

# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority

\`\`\`

### MongoDB Setup Options

#### Option 1: Local MongoDB

1. Download and install MongoDB Community Edition
2. Start the MongoDB service
3. Use connection string: `mongodb://localhost:27017/taskmanager`

#### Option 2: MongoDB Atlas (Recommended for production)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create database user and get connection string
4. Update `.env` with your Atlas connection string

## 📡 API Documentation

### Base URL

\`\`\`
http://localhost:3001/api
\`\`\`

### Endpoints

#### Tasks

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| GET    | `/tasks`       | Get all tasks       |
| POST   | `/tasks`       | Create a new task   |
| PUT    | `/tasks/:id`   | Update a task       |
| DELETE | `/tasks/:id`   | Delete a task       |
| GET    | `/tasks/stats` | Get task statistics |

#### Health Check

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| GET    | `/health` | API health status |

### Request/Response Examples

#### Create Task

\`\`\`bash
POST /api/tasks
Content-Type: application/json

{
"title": "Complete project documentation",
"description": "Write comprehensive README and API docs",
"priority": "high",
"category": "Work",
"dueDate": "2024-12-31",
"status": "pending"
}
\`\`\`

#### Response

\`\`\`json
{
"\_id": "507f1f77bcf86cd799439011",
"title": "Complete project documentation",
"description": "Write comprehensive README and API docs",
"priority": "high",
"category": "Work",
"dueDate": "2024-12-31T00:00:00.000Z",
"status": "pending",
"createdAt": "2024-01-15T10:30:00.000Z",
"updatedAt": "2024-01-15T10:30:00.000Z"
}
\`\`\`

## 🚀 Deployment

### Option 1: Heroku Deployment

1. **Install Heroku CLI**
   \`\`\`bash

   # Download from https://devcenter.heroku.com/articles/heroku-cli

   \`\`\`

2. **Prepare for deployment**
   \`\`\`bash

   # Create Procfile in root directory

   echo "web: node server/server.js" > Procfile

   # Update package.json scripts

   {
   "scripts": {
   "start": "node server/server.js",
   "heroku-postbuild": "cd server && npm install"
   }
   }
   \`\`\`

3. **Deploy to Heroku**
   \`\`\`bash

   # Login to Heroku

   heroku login

   # Create Heroku app

   heroku create your-task-app-name

   # Set environment variables

   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set NODE_ENV=production

   # Deploy

   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main

   # Open your app

   heroku open
   \`\`\`

### Option 2: Railway Deployment

1. **Connect to Railway**

   - Visit [Railway](https://railway.app)
   - Connect your GitHub repository
   - Select your task management app

2. **Configure environment variables**
   \`\`\`
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=3001
   NODE_ENV=production
   \`\`\`

3. **Deploy**
   - Railway will automatically deploy your app
   - Access via the provided Railway URL

### Option 3: DigitalOcean App Platform

1. **Create App**

   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Connect your GitHub repository

2. **Configure Build Settings**
   \`\`\`yaml
   # app.yaml
   name: task-management-app
   services:
   - name: api
     source_dir: /
     github:
     repo: yourusername/task-management-app
     branch: main
     run_command: node server/server.js
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: MONGODB_URI
       value: your_mongodb_atlas_connection_string
     - key: NODE_ENV
       value: production
       \`\`\`

### Option 4: Vercel Deployment

1. **Install Vercel CLI**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Configure for Vercel**
   \`\`\`json
   // vercel.json
   {
   "version": 2,
   "builds": [
   {
   "src": "server/server.js",
   "use": "@vercel/node"
   },
   {
   "src": "client/**",
   "use": "@vercel/static"
   }
   ],
   "routes": [
   {
   "src": "/api/(.*)",
   "dest": "server/server.js"
   },
   {
   "src": "/(.*)",
   "dest": "client/$1"
   }
   ]
   }
   \`\`\`

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

## 🔧 Development

### Running in Development Mode

\`\`\`bash

# Start server with auto-restart

cd server
npm run dev

# The server will restart automatically when you make changes

\`\`\`

### Adding New Features

1. **Backend Changes**

   - Add new routes in `server/server.js`
   - Update the Task schema if needed
   - Test API endpoints

2. **Frontend Changes**
   - Update `client/index.html` for new UI elements
   - Add styles in `client/styles.css`
   - Implement functionality in `client/script.js`

### Database Schema

\`\`\`javascript
// Task Schema
{
title: String (required, max 100 chars),
description: String (required, max 500 chars),
status: String (enum: ['pending', 'in-progress', 'completed']),
priority: String (enum: ['low', 'medium', 'high']),
category: String (max 50 chars),
dueDate: Date,
createdAt: Date (auto-generated),
updatedAt: Date (auto-updated)
}
\`\`\`

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

\`\`\`bash

# Error: EADDRINUSE: address already in use :::3001

# Solution 1: Use different port

PORT=4000 npm start

# Solution 2: Kill process using the port

# Windows

netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux

lsof -i :3001
kill -9 <PID>
\`\`\`

#### MongoDB Connection Error

\`\`\`bash

# Error: MongoNetworkError: failed to connect to server

# Solution 1: Start MongoDB service

# Windows: net start MongoDB

# macOS: brew services start mongodb-community

# Linux: sudo systemctl start mongod

# Solution 2: Check connection string in .env

# Make sure MONGODB_URI is correct

\`\`\`

#### CORS Issues

\`\`\`javascript
// If you encounter CORS errors, ensure CORS is properly configured
app.use(cors({
origin: ['http://localhost:3000', 'http://localhost:3001'],
credentials: true
}));
\`\`\`

### Performance Optimization

1. **Database Indexing**
   \`\`\`javascript
   // Add indexes for better query performance
   taskSchema.index({ status: 1 });
   taskSchema.index({ priority: 1 });
   taskSchema.index({ dueDate: 1 });
   \`\`\`

2. **Frontend Optimization**
   - Implement debouncing for search
   - Add pagination for large task lists
   - Use virtual scrolling for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow JavaScript ES6+ standards
- Use meaningful variable and function names
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Team collaboration features
- [ ] File attachments for tasks
- [ ] Email notifications for due dates
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Task templates
- [ ] Time tracking
- [ ] Reporting and analytics
- [ ] Integration with calendar apps
