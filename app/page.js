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

  useEffect(() => {
    switch (filter) {
      case 'All':
        setHeading('All Tasks');
        break;
      case 'Incomplete':
        setHeading('Incomplete Tasks');
        break;
      case 'In Progress':
        setHeading('In Progress Tasks');
        break;
      case 'Completed':
        setHeading('Completed Tasks');
        break;
      case 'To Do':
        setHeading('To Do Tasks');
        break;
      case 'Important':
        setHeading('Important Tasks');
        break;
      default:
        setHeading('All Tasks');
    }
  }, [filter]);

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
      setErrorMessage('Failed to fetch tasks. Please try again later.');
      setTimeout(() => setErrorMessage(''), 5000);
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
      setTimeout(() => setSuccessMessage(''), 5000);
      setIsTaskFormModalOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error('Error saving task:', error);
      setErrorMessage(task.id ? 'Failed to update task. Please try again.' : 'Failed to add task. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskFormModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      fetchTasks();
      setSuccessMessage('Task deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error deleting task:', error);
      setErrorMessage('Failed to delete task. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
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
    if (filter === 'To Do') return task.status === 'To Do';
    if (filter === 'Important') return task.isImportant;
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

          {filter === 'All' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-2">To Do</h3>
                <TaskList tasks={filteredTasks.filter(task => task.status === 'To Do')} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-2">In Progress</h3>
                <TaskList tasks={filteredTasks.filter(task => task.status === 'In Progress')} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-2">Completed</h3>
                <TaskList tasks={filteredTasks.filter(task => task.status === 'Completed')} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              </div>
            </div>
          ) : (
            <TaskList tasks={filteredTasks} onEdit={handleEditTask} handleDelete={handleDeleteTask} />
          )}

          <Modal isOpen={isTaskFormModalOpen} onClose={() => setIsTaskFormModalOpen(false)}>
            <TaskForm task={taskToEdit} onSubmit={handleTaskSubmit} />
          </Modal>
        </div>
      </div>
    </div>
  );
}
