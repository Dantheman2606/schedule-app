# TimeBlock Planner

A modern time-blocking day planner application built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- ✅ User authentication with JWT
- ✅ Create, edit, and delete tasks
- ✅ 24-hour timeline view with 15-minute intervals
- ✅ Real-time current time indicator
- ✅ Active task highlighting with glow animation
- ✅ Drag-and-drop task repositioning
- ✅ Overlap detection and warnings
- ✅ Color coding for tasks
- ✅ Dark mode UI with glass morphism effects

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd c:\PICT\Schedule-app\schedule-app
```

### 2. Set up MongoDB

Make sure MongoDB is running on your local machine at `mongodb://localhost:27017`

Or update the connection string in `backend/.env`

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Backend Environment

The `.env` file is already created with default values. Update if needed:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/timeblock-planner
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 5. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3000`

### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. **Register**: Navigate to the register page and create an account
2. **Login**: Log in with your credentials
3. **Create Tasks**: Click on any time slot in the timeline to create a task
4. **Edit Tasks**: Click on an existing task to edit it
5. **Delete Tasks**: Hover over a task and click the × button
6. **Drag Tasks**: Click and drag tasks to different time slots
7. **View Active Task**: The currently active task (based on system time) will glow
8. **Overlap Warnings**: You'll be warned when tasks overlap

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router
- Axios
- Vite

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Project Structure

```
schedule-app/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Task.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   └── tasks.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   └── index.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── timeline/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected)
- `GET /api/tasks?date=YYYY-MM-DD` - Get tasks for a date
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Future Enhancements

- Electron.js desktop app for Windows
- System notifications for upcoming tasks
- Task templates and recurring tasks
- Multi-day calendar view
- Task categories and filtering
- Search functionality
- Export/import tasks

## License

MIT
