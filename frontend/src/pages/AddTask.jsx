// src/pages/AddTask.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTask } from "../services/tasks";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors(null);
    try {
      await createTask({ title, description, due_date: dueDate || null, priority });
      navigate("/tasks");
    } catch (err) {
      setErrors(err.response?.data); // e.g. { title: ["..."], due_date: ["..."] }
    }
  }

  return (
    <div className="add-task">
      <h1>Add New Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
          />
        </div>
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
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        {errors && (
          <ul className="errors">
            {Object.entries(errors).map(([field, msgs]) => (
              <li key={field}>{field}: {Array.isArray(msgs) ? msgs.join(", ") : String(msgs)}</li>
            ))}
          </ul>
        )}
        <button type="submit">Add task</button>
      </form>
    </div>
  );
}
