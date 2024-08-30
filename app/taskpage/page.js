"use client";
import React, { useState, useEffect } from 'react';
import TaskForm from '../../components/TaskForm';
import TaskList from '../../components/TaskList';
import { deleteDoc, doc } from 'firebase/firestore'; // Ensure to import necessary Firestore functions
import { db } from '../../lib/firebase'; // 

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
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
        method: selectedTask ? 'PUT' : 'POST', // Use PUT for editing
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Task saved successfully:', result);

      fetchTasks(); // Refresh the task list
      setSelectedTask(null); // Clear the selected task after saving
      setSuccessMessage(selectedTask ? 'Task updated successfully!' : 'Task added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task); // Set the selected task for editing
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Task deleted successfully:', result);
  
      // Update your UI or state to reflect the deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  
  

  return (
    <div className="max-w-3xl mx-auto">
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <TaskForm onSubmit={handleTaskSubmit} selectedTask={selectedTask} />
      <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDelete} />
    </div>
  );
}
