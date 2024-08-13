import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskSubmit = async (task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Task created successfully:', result);

      // Refresh tasks list and show success message
      fetchTasks();
      setSuccessMessage('Task added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error creating task:', error);
      // Optionally show an error message
    }
  };

  return (
    <div>
      <h1>Create a New Task</h1>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <TaskForm onSubmit={handleTaskSubmit} />
      <TaskList tasks={tasks} />
    </div>
  );
}
