"use client";

import React, { useState } from 'react';
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '/lib/firebase'; // Adjust the path according to your project structure

export default function TaskList({ tasks, onEdit, filter }) {
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  // Function to categorize tasks for the 'All' filter
  const categorizeTasks = (tasks) => {
    return tasks.reduce((categories, task) => {
      if (task.status === 'In Progress') {
        categories.inProgress.push(task);
      } else if (task.status === 'To Do') {
        categories.toDo.push(task);
      } else if (task.status === 'Completed') {
        categories.completed.push(task);
      } else if (task.status === 'Incomplete') {
        categories.incomplete.push(task);
      }
      return categories;
    }, { inProgress: [], toDo: [], completed: [], incomplete: [] });
  };

  const categorizedTasks = categorizeTasks(tasks);

  const handleDeleteTask = async (id) => {
    try {
      // Delete the task document from Firestore
      await deleteDoc(doc(db, 'tasks', id));
  
      // Fetch the updated list of tasks
      const tasksCollection = collection(db, 'tasks');
      const tasksSnapshot = await getDocs(tasksCollection);
      const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Update the state with the new list of tasks
      setTasks(tasksList); // Assume setTasks is a state setter function from useState
  
      // Show a success notification
      showNotification('Task deleted successfully!', 'success'); // Assume showNotification is a function to display notifications
    } catch (error) {
      // Handle errors and show an error notification
      console.error('Error deleting task:', error);
      showNotification('Error deleting task!', 'error');
    }
  };
  


  return (
    <div className="grid gap-4">
      {filter === 'All' ? (
        <div className="grid md:grid-cols-3 gap-4">
          {/* In Progress Column */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">In Progress</h2>
            {categorizedTasks.inProgress.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600 mt-1">{task.description}</p>
                <p className="text-red-600 font-semibold mt-2">
                  Deadline: <span className="text-red-800">{new Date(task.deadline).toLocaleDateString()}</span>
                </p>
                <p className={`mt-2 font-bold ${task.isImportant ? 'text-red-600' : 'text-gray-500'}`}>
                  {task.isImportant ? 'Important' : 'Not Important'}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    onClick={() => onEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    onClick={() => handleDeleteTask(task.id)} // Ensure task.id is correct here
                  >
                  Delete
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* To Do Column */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">To Do</h2>
            {categorizedTasks.toDo.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600 mt-1">{task.description}</p>
                <p className="text-red-600 font-semibold mt-2">
                  Deadline: <span className="text-red-800">{new Date(task.deadline).toLocaleDateString()}</span>
                </p>
                <p className={`mt-2 font-bold ${task.isImportant ? 'text-red-600' : 'text-gray-500'}`}>
                  {task.isImportant ? 'Important' : 'Not Important'}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    onClick={() => onEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    onClick={() => handleDeleteTask(task.id)} // Ensure task.id is correct here
                  >
                  Delete
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* Completed Column */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">Completed</h2>
            {categorizedTasks.completed.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600 mt-1">{task.description}</p>
                <p className="text-red-600 font-semibold mt-2">
                  Deadline: <span className="text-red-800">{new Date(task.deadline).toLocaleDateString()}</span>
                </p>
                <p className={`mt-2 font-bold ${task.isImportant ? 'text-red-600' : 'text-gray-500'}`}>
                  {task.isImportant ? 'Important' : 'Not Important'}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    onClick={() => onEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    onClick={() => handleDeleteTask(task.id)} // Ensure task.id is correct here
                  >
                  Delete
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-1 gap-4">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-600 col-span-3">No tasks found.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600 mt-1">{task.description}</p>
                <p className="text-red-600 font-semibold mt-2">
                  Deadline: <span className="text-red-800">{new Date(task.deadline).toLocaleDateString()}</span>
                </p>
                <p className={`mt-2 font-bold ${task.isImportant ? 'text-red-600' : 'text-gray-500'}`}>
                  {task.isImportant ? 'Important' : 'Not Important'}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    onClick={() => onEdit(task)}
                  >
                    Edit
                  </button>
                  
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    onClick={() => handleDeleteTask(task.id)} // Ensure task.id is correct here
                  >
                  Delete
                  </button>

                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
