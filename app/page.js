'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Profile from '../components/Profile';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTasks();
    }
  }, [status]);

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
      fetchTasks();
      setSuccessMessage('Task added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (status === 'loading') {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center text-gray-500">Please sign in</p>; // Handle unauthenticated state
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Profile />
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <TaskForm onSubmit={handleTaskSubmit} />
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}
