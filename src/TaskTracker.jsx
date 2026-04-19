import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Plus, Trash2, X } from 'lucide-react';
import './index.css';

export default function TaskTracker({ isOpen, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Load tasks from local storage
  useEffect(() => {
    const saved = localStorage.getItem('study-sound-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse tasks');
      }
    }
  }, []);

  // Save tasks to local storage
  useEffect(() => {
    localStorage.setItem('study-sound-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="task-drawer-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="task-drawer glass"
          >
            <div className="task-drawer-header">
              <h2>Goals for this Session</h2>
              <button className="icon-button" onClick={onClose}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddTask} className="task-input-form">
              <input
                type="text"
                placeholder="What are you working on?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="task-input"
              />
              <button type="submit" className="task-add-btn">
                <Plus size={20} />
              </button>
            </form>

            <div className="task-list">
              <AnimatePresence>
                {tasks.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`task-item ${task.completed ? 'completed' : ''}`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <button className="task-check-btn">
                      {task.completed ? (
                        <CheckCircle2 size={22} className="text-accent" />
                      ) : (
                        <Circle size={22} className="text-secondary" />
                      )}
                    </button>
                    <span className="task-text">{task.text}</span>
                    <button 
                      className="task-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
                {tasks.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-tasks">
                    <p>No tasks yet. Set a goal for your pomodoro!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
