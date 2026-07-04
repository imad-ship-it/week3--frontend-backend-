import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">TaskManager</h2>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/add">Add Task</Link>
      </div>
    </nav>
  );
}

export default Navbar;
