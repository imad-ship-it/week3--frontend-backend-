// src/pages/Tasks.jsx
import { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../services/tasks';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setLoading(false);
    }
    fetchTasks();
  }, []);

  async function handleDelete(id) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  if (loading)
    return (
      <div className="container">
        <p>Loading your tasks...</p>
      </div>
    );

  return (
    <div className="container tasks">
      <div
        className="header-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>My Tasks</h1>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {tasks.length} tasks found
        </span>
      </div>

      {tasks.length === 0 && (
        <div
          className="task-card"
          style={{ textAlign: 'center', padding: '3rem' }}
        >
          <p>No tasks yet. Ready to get started?</p>
        </div>
      )}

      <div
        className="task-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <h3>{task.title}</h3>
              <span
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  background:
                    task.priority === 'high'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(148, 163, 184, 0.2)',
                  color:
                    task.priority === 'high'
                      ? 'var(--error)'
                      : 'var(--text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p style={{ marginBottom: '1.25rem', opacity: 0.8 }}>
                {task.description}
              </p>
            )}
            <div
              style={{
                marginTop: 'auto',
                borderTop: '1px solid var(--border)',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
              >
                Due: {task.due_date ?? 'No due date'}
              </span>
              <button
                onClick={() => handleDelete(task.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--error)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
