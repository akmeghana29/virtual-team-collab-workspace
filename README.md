# Virtual Team Collaborative Workspace

## Find the deployed website here
# **https://vtcw.vercel.app/**

## If you are not able to access it, open this:
#
--

## What is VTCW?

Virtual Team Collaborative Workspace (VTCW) is a full-stack web application built for students and professionals working in distributed teams. It provides a single unified platform where team members can manage tasks, share resources, track deadlines, post daily standups, and interact with an AI-powered knowledge assistant all from one glassmorphism-styled dashboard.

The platform simulates real-world team collaboration workflows, making it ideal for academic project teams, internship cohorts, and remote working professionals.

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://vtcw.vercel.app |
| Backend API | Render | https://vtcw-backend.onrender.com |
| Database | MongoDB Atlas (Mumbai, ap-south-1) | Hosted on Atlas Flex Tier |

- The frontend is deployed on **Vercel** with automatic redeployment on every push to the `main` branch
- The backend is deployed on **Render** as a Node.js Web Service with the root directory set to `backend/`
- The database is hosted on **MongoDB Atlas** with GridFS for file storage and IP access open for deployment compatibility
- Environment variables are managed directly through Vercel and Render dashboards — no secrets are pushed to GitHub

---

## Features

### Landing Page
- Full-screen parallax hero section with a dark overlay on a background image
- Animated headings and subtitle with staggered Framer Motion reveals
- Features strip showcasing five core capabilities with icons
- Overlapping split card with a team overview and project description
- Fixed navbar with glassmorphism blur effect that activates on scroll
- Second background section with students image below the hero

### Authentication
- Unified Sign In / Sign Up page with an animated pill toggle
- Split layout professionals image with dark overlay on the left, form on the right
- JWT-based session authentication
- Google OAuth option for quick access
- Styled input fields with beige focus states matching the design palette
- Form transitions powered by Framer Motion AnimatePresence

### Dashboard
The dashboard is a glassmorphism rectangular box centered over a full-screen background image, inspired by modern SaaS UI patterns. Everything happens inside this one box with no external page navigation.

**Overview Tab**
- Live stat cards showing tasks completed, total members, deadlines marked, and files shared
- All numbers update in real time as the team adds data
- Add new team members directly from this tab
- Today's standup updates previewed at the bottom

**Tasks Tab**
- View all team members with their task count
- Click any member to see their individual task list
- Add tasks to any member with a name and deadline
- Tick off completed tasks they get struck through and marked with a beige checkmark
- Back button to return to the full member list

**Calendar Tab**
- Fully dynamic calendar that always shows the current month and year
- Today's date is highlighted in beige
- Deadline dates are highlighted in red click any red date to expand and view all deadlines for that day
- Add new deadlines from the same tab by entering a day, label, and assigned member

**Resources Tab**
- Upload files directly from your local computer
- Files are stored in MongoDB via GridFS and persist across sessions
- View all uploaded files with name, size, type badge, and uploader name
- Delete files from the dashboard removes from both the UI and MongoDB

**AI Assistant Tab**
- Rule-based knowledge assistant that reads live team data
- Quick suggestion chips for common queries
- Responds to questions about team members, pending tasks, upcoming deadlines, shared files, and today's standups
- Typing indicator with a 600ms simulated response delay for realism
- Chat-style interface with user and assistant message bubbles

**Standups Tab**
- Always displays today's date dynamically no hardcoded dates
- Post your daily progress update with a single input field
- All updates for the day are shown in a card feed with timestamp
- Data persists in React state during the session and can be wired to the backend

**Members Panel (Right Side)**
- Always visible alongside any tab
- Shows all team members with avatar initials, role, and green/grey online indicator
- Click any member to instantly jump to their task list in the Tasks tab

---

## Tech Stack

### Frontend
- **React** + **Vite**
- **Framer Motion** - page transitions, stagger animations, AnimatePresence
- **React Router DOM** - client-side routing
- **React Icons** - icon library (Material Design icons)
- **Fontsource** - Poppins (body) and Bodoni Moda (display headings)
- **Tailwind CSS v4** - utility classes
- All component styling uses inline style objects for precise palette control

### Backend
- **Node.js** + **Express.js**
- **Mongoose** - MongoDB ODM for schema definition and querying
- **GridFS** via `multer-gridfs-storage` - stores uploaded files directly inside MongoDB
- **JWT** (`jsonwebtoken`) — stateless authentication tokens
- **bcryptjs** - password hashing
- **Multer** - multipart file upload handling
- **dotenv** - environment variable management
- **CORS** - configured to allow requests from the Vercel frontend URL

### Database
- **MongoDB Atlas** Flex Tier
- Collections: `users`, `tasks`, `resources`
- GridFS bucket `uploads` for binary file storage
- Hosted in Mumbai (ap-south-1) region

---

## Data Structures - Dynamic Task Scheduling

The backend implements a **Min-Heap Priority Queue** in `backend/lib/taskScheduler.js` to handle dynamic task scheduling based on deadlines.

### Why a Min-Heap?

A min-heap is a complete binary tree where the parent node always has a smaller value than its children. For task scheduling, the "value" is the deadline timestamp. This guarantees that the task with the nearest deadline is always at the root extractable in O(1) time while insertion and re-ordering happen in O(log n) time.

### Complexity

| Operation | Time Complexity |
|-----------|----------------|
| Insert task | O(log n) |
| Extract nearest deadline task | O(log n) |
| Build full schedule from n tasks | O(n log n) |
| Reschedule after completion | O(n log n) |

### How It Works in Practice

When a task is created via the API, it is inserted into the heap using its `deadline` field converted to a Unix timestamp as the priority key. The heap bubbles it up to the correct position. The API returns the full `scheduledQueue` an array of tasks sorted by urgency alongside the created task.

When a task is marked complete via `PATCH /api/tasks/:taskId/complete`, the `rescheduleOnCompletion` function:
1. Filters out the completed task from the team's task list
2. Rebuilds the heap from all remaining incomplete tasks
3. Extracts them in order to produce a fresh priority queue
4. Returns the updated `rescheduledQueue` to the frontend

This means if a member completes a task early, the next most urgent task automatically surfaces. If a task is completed late, the scheduler reassesses all remaining deadlines and surfaces any tasks now at risk of being missed. The frontend can use this queue to visually reorder task lists and flag urgent items.

This approach mirrors how tools like Jira and Linear order backlogs by urgency and deadline proximity, not manual sorting.

---

## RAG Model: AI Knowledge Assistant

The AI Assistant is designed around a **Retrieval-Augmented Generation (RAG)** architecture intended to run on **Google Colab** using free, open-source models.

### What is RAG?

Standard language models generate answers purely from their training data, which means they know nothing about your team's private documents. RAG solves this by first **retrieving** the most relevant chunks from your own documents, then passing those chunks as context to the language model, which **generates** a grounded answer based on what it actually found.

This prevents hallucination and ensures the assistant can accurately answer questions about your specific project files.



---

*Built by A Kirti Meghana*
