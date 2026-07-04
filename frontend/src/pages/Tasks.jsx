// TODO (Week 3): This component currently uses static data and has no API calls to the backend yet.
function Tasks() {
  const tasks = [
    { id: 1, title: 'Complete Week 1 deliverables', due: '2026-06-25' },
    { id: 2, title: 'Finish React course', due: '2026-06-22' },
    { id: 3, title: 'Set up ESLint', due: '2026-06-21' },
  ];

  return (
    <div className="tasks">
      <h1>My Tasks</h1>
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <h3>{task.title}</h3>
          <p>Due: {task.due}</p>
        </div>
      ))}
    </div>
  );
}

export default Tasks;
