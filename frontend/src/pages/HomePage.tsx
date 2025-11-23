import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { Timeline } from '../components/timeline/Timeline';
import { CurrentTaskDisplay } from '../components/timeline/CurrentTaskDisplay';
import { getTodayString } from '../utils/dateUtils';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const [date] = useState(getTodayString());
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  return (
    <div className="home-page">
      <div className="home-sidebar">
        <div className="home-sidebar-header">
          <h1 className="home-logo">TimeBlock</h1>
          <p className="home-user-email">{user?.email}</p>
        </div>
        
        <CurrentTaskDisplay tasks={tasks} />
        
        <button className="home-add-task-button" onClick={() => setShowNewTaskForm(true)}>
          ➕ New Task
        </button>
        
        <nav className="home-nav">
          <button className="home-nav-button active">
            📅 Today
          </button>
        </nav>

        <div className="home-sidebar-footer">
          <button className="home-logout-button" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="home-main">
        <Timeline date={date} showNewTaskForm={showNewTaskForm} onCloseNewTaskForm={() => setShowNewTaskForm(false)} />
      </div>
    </div>
  );
};
