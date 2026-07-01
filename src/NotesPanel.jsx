import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, BookOpen } from 'lucide-react';

const QUOTES = [
  "Simplicity is the ultimate sophistication. — Leonardo da Vinci",
  "Focus is a matter of deciding what things you're not going to do. — John Carmack",
  "Mindfulness isn't difficult, we just need to remember to do it. — Sharon Salzberg",
  "Well begun is half done. — Aristotle",
  "The present moment is filled with joy and happiness. — Thich Nhat Hanh",
  "One day at a time. — Unknown",
  "Quiet the mind, and the soul will speak. — Ma Jaya Sati Bhagavati",
  "Progress, not perfection. — Unknown"
];

export default function NotesPanel({ isOpen, onClose, currentMode }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Pick a random quote
    const rand = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(rand);

    // Load saved notes
    const saved = localStorage.getItem('study-sound-notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load notes");
      }
    }
  }, [isOpen]);

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      mode: currentMode.startsWith('meditation') ? 'Meditate' : currentMode.startsWith('reading') ? 'Read' : 'Study',
      text: newNote.trim()
    };

    const updated = [newEntry, ...notes];
    setNotes(updated);
    localStorage.setItem('study-sound-notes', JSON.stringify(updated));
    setNewNote('');
  };

  const handleDeleteNote = (id, e) => {
    e.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('study-sound-notes', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="ipod-screen-panel"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
    >
      <div className="settings-header">
        <h3>Notes & Logs</h3>
        <button className="icon-button" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="settings-content notes-content">
        {/* Curated Daily Quote */}
        <div className="notes-quote-card">
          <BookOpen size={14} className="notes-quote-icon" />
          <p className="notes-quote-text">{quote}</p>
        </div>

        {/* Micro-Journal Reflection Form */}
        <form onSubmit={handleSaveNote} className="notes-form">
          <label className="notes-form-label">Add a session reflection:</label>
          <div className="notes-input-group">
            <input
              type="text"
              className="notes-input"
              placeholder="What did you focus on?"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button type="submit" className="notes-submit-btn">Save</button>
          </div>
        </form>

        {/* History log entries */}
        <div className="notes-history-section">
          <div className="notes-history-header">Past Reflections</div>
          <div className="notes-history-list">
            {notes.length === 0 ? (
              <div className="notes-empty-state">No logs yet. Save a reflection above!</div>
            ) : (
              notes.map(note => (
                <div key={note.id} className="note-log-item">
                  <div className="note-log-meta">
                    <span className={`note-log-badge badge-${note.mode.toLowerCase()}`}>{note.mode}</span>
                    <span className="note-log-time">{note.timestamp}</span>
                    <button className="note-log-delete" onClick={(e) => handleDeleteNote(note.id, e)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="note-log-text">{note.text}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
