'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Profile from '../components/Profile';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Sidebar from '../components/Sidebar';
import { FaBars } from 'react-icons/fa'; // Import FaBars icon

export default function HomePage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [successMessage, setSuccessMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      // Automatically mark overdue tasks as incomplete
      const updatedTasks = data.map(task => {
        if (task.status !== 'Completed' && new Date(task.deadline) < new Date()) {
          task.status = 'Incomplete';
        }
        return task;
      });

      setTasks(updatedTasks);
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

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (status === 'loading') {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center text-gray-500">Please sign in</p>; // Handle unauthenticated state
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Fixed Header */}
      <header className="bg-red-600 text-white fixed top-0 left-0 w-full z-50 py-4 px-8 flex items-center justify-between">
        {/* Sidebar Toggle Button */}
        <button
          className="text-white lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars size={24} />
        </button>
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-center flex-1">Remind It!</h1>
      </header>

      {/* Sidebar */}
      <Sidebar 
        onFilterChange={handleFilterChange} 
        isOpen={sidebarOpen} 
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 p-8 mt-16 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}
      >
        <header className="mb-8">
          <Profile />
        </header>
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          {successMessage && (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
          )}
          <TaskForm onSubmit={handleTaskSubmit} />
          <TaskList tasks={tasks} filter={filter} />
        </div>
      </div>
    </div>
  );
}
