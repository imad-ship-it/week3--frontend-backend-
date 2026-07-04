import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AddTask from './AddTask';

describe('AddTask Form', () => {
  it('renders the form correctly', () => {
    render(<AddTask />);
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter task description')
    ).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('shows validation errors when form is submitted empty', () => {
    render(<AddTask />);
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Due date is required')).toBeInTheDocument();
  });

  it('shows success message when form is filled and submitted', () => {
    render(<AddTask />);
    fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
      target: { value: 'Test Task' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter task description'), {
      target: { value: 'Test Description' },
    });
    fireEvent.change(screen.getByDisplayValue(''), {
      target: { value: '2026-12-01' },
    });
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByText('Task Added!')).toBeInTheDocument();
  });
});
