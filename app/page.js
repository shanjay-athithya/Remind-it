'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Profile from '../components/Profile';
import TaskForm from '../components/TaskForm';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import Modal from '../components/Modal';
import { FaBars, FaPlus } from 'react-icons/fa';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTaskFormModalOpen, setIsTaskFormModalOpen] = useState(false);
  const [heading, setHeading] = useState('All Tasks');
  const [taskToEdit, setTaskToEdit] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/signin');
      return;
    }
    if (status === 'authenticated') {
      fetchTasks();
    }
  }, [status, session, router]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const updatedTasks = data.map((task) => {
        if (task.status !== 'Completed' && new Date(task.deadline) < new Date()) {
          task.status = 'Incomplete';
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      setErrorMessage('Failed to fetch tasks.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleTaskSubmit = async (task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: task.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      fetchTasks();
      setSuccessMessage(task.id ? 'Task updated successfully!' : 'Task added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsTaskFormModalOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error('Error saving task:', error);
      setErrorMessage(task.id ? 'Failed to update task.' : 'Failed to add task.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskFormModalOpen(true);
  };

  const handleFilterChange = (newFilter, newHeading) => {
    setFilter(newFilter);
    setHeading(newHeading);
  };

  if (status === 'loading') {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Incomplete') return task.status === 'Incomplete';
    if (filter === 'In Progress') return task.status === 'In Progress';
    if (filter === 'Completed') return task.status === 'Completed';
    if (filter === 'Important') return task.important;
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <header className="bg-red-600 text-white fixed top-0 left-0 w-full z-50 py-4 px-8 flex items-center justify-between">
        <button className="text-white lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars size={24} />
        </button>
        <h1 className="text-2xl font-bold text-center flex-1">Remind It!</h1>
      </header>

      <Sidebar onFilterChange={handleFilterChange} isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className={`flex-1 p-8 mt-16 lg:mt-16 lg:pl-64 transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {successMessage && <div className="fixed top-20 right-0 w-full lg:w-auto p-4 bg-green-100 text-green-700 text-center z-40 shadow-md">{successMessage}</div>}
        {errorMessage && <div className="fixed top-32 right-0 w-full lg:w-auto p-4 bg-red-100 text-red-700 text-center z-40 shadow-md">{errorMessage}</div>}

        <div className="relative bg-white p-6 rounded-lg shadow-lg w-full mx-auto mt-16 lg:mt-8">
          <header className="mb-4">
            <Profile />
            <h2 className="text-xl font-bold mt-4">{heading}</h2>
          </header>

          <div className="fixed bottom-16 right-4 lg:bottom-8 lg:right-8 z-30">
            <button className="bg-green-500 text-white p-2 rounded-lg flex items-center" onClick={() => { setTaskToEdit(null); setIsTaskFormModalOpen(true); }}>
              <FaPlus className="mr-2" />
              Add New Task
            </button>
          </div>

          <TaskList tasks={filteredTasks} onEdit={handleEditTask} />
        </div>
      </div>

      <Modal isOpen={isTaskFormModalOpen} onClose={() => setIsTaskFormModalOpen(false)}>
        <TaskForm onSubmit={handleTaskSubmit} task={taskToEdit} />
      </Modal>
    </div>
  );
}
