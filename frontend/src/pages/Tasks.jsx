// src/pages/Tasks.jsx
import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/tasks";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    const data = await getTasks();
    setTasks(data);
    setLoading(false);
  }

  async function handleDelete(id) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="tasks">
      <h1>My Tasks</h1>
      {tasks.length === 0 && <p>No tasks yet. Add one!</p>}
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
          <p>Due: {task.due_date ?? "No due date"}</p>
          <p>
            Status: <strong>{task.status}</strong> | Priority:{" "}
            <strong>{task.priority}</strong>
          </p>
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
