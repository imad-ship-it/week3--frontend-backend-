// TODO (Week 3): This component currently uses local-only validation and has no API calls to the backend yet.
import { useState } from 'react';

function AddTask() {
  const [form, setForm] = useState({ title: '', description: '', due: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim())
      newErrors.description = 'Description is required';
    if (!form.due) newErrors.due = 'Due date is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="success">
        <h1>Task Added!</h1>
        <p>
          <strong>{form.title}</strong> has been added successfully.
        </p>
        <button
          className="add-another-btn"
          onClick={() => {
            setForm({ title: '', description: '', due: '' });
            setSubmitted(false);
          }}
        >
          Add Another
        </button>
      </div>
    );
  }

  return (
    <div className="add-task">
      <h1>Add New Task</h1>
      <div className="form">
        <div className="field">
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter task title"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter task description"
          />
          {errors.description && (
            <span className="error">{errors.description}</span>
          )}
        </div>

        <div className="field">
          <label>Due Date</label>
          <input
            type="date"
            name="due"
            value={form.due}
            onChange={handleChange}
          />
          {errors.due && <span className="error">{errors.due}</span>}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Add Task
        </button>
      </div>
    </div>
  );
}

export default AddTask;
