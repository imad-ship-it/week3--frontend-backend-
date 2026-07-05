// src/pages/AddTask.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../services/tasks';

export default function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors(null);
    try {
      await createTask({
        title,
        description,
        due_date: dueDate || null,
        priority,
      });
      navigate('/tasks');
    } catch (err) {
      setErrors(err.response?.data);
    }
  }

  return (
    <div className="container">
      <div className="add-task" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1
          style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}
        >
          Create New Task
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div className="field">
            <label>Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some details..."
              style={{ minHeight: '120px' }}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
            }}
          >
            <div className="field">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
          {errors && (
            <ul className="error" style={{ listStyle: 'none', padding: 0 }}>
              {Object.entries(errors).map(([field, msgs]) => (
                <li key={field}>
                  {field}:{' '}
                  {Array.isArray(msgs) ? msgs.join(', ') : String(msgs)}
                </li>
              ))}
            </ul>
          )}
          <button
            type="submit"
            style={{ marginTop: '1rem', height: '56px', fontSize: '1.1rem' }}
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}
