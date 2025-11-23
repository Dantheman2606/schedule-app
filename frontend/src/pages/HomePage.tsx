import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { Timeline } from '../components/timeline/Timeline';
import { CurrentTaskDisplay } from '../components/timeline/CurrentTaskDisplay';
import { getTodayString, addDays, formatDate } from '../utils/dateUtils';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  // Generate next 6 days
  const today = new Date();
  const dateOptions = [
    { label: 'Today', date: getTodayString(), dayName: 'Today' },
    ...Array.from({ length: 6 }, (_, i) => {
      const date = addDays(today, i + 1);
      const dateString = formatDate(date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayDate = date.getDate();
      return { label: `${dayName}, ${dayDate}`, date: dateString, dayName };
    })
  ];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleCalendarDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="home-page">
      <div className="home-sidebar">
        <div className="home-sidebar-header">
          <h1 className="home-logo">TimeBlock</h1>
          <p className="home-user-email">{user?.email}</p>
        </div>
        
        <CurrentTaskDisplay tasks={tasks} currentDate={selectedDate} />
        
        <button className="home-add-task-button" onClick={() => setShowNewTaskForm(true)}>
          ➕ New Task
        </button>
        
        <nav className="home-nav">
          {dateOptions.map((option) => (
            <button
              key={option.date}
              className={`home-nav-button ${selectedDate === option.date ? 'active' : ''}`}
              onClick={() => handleDateSelect(option.date)}
            >
              📅 {option.label}
            </button>
          ))}
        </nav>

        <div className="home-sidebar-footer">
          <button className="home-logout-button" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="home-main">
        <div className="timeline-header-bar">
          <div className="calendar-button-wrapper">
            <span className="calendar-icon">📅</span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={handleCalendarDateSelect}
              className="calendar-input-button"
              title="Select Date"
            />
          </div>
        </div>
        <Timeline 
          date={selectedDate} 
          showNewTaskForm={showNewTaskForm} 
          onCloseNewTaskForm={() => setShowNewTaskForm(false)} 
        />
      </div>
    </div>
  );
};
