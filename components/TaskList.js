import React from 'react';

export default function TaskList({ tasks, onEdit }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
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
            <p className={`mt-2 font-bold ${task.important ? 'text-red-600' : 'text-gray-500'}`}>
              {task.important ? 'Important' : 'Not Important'}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              onClick={() => onEdit(task)}
            >
              Edit
            </button>
          </div>
        ))
      )}
    </div>
  );
}
