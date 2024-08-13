import { useState } from 'react';
import { FaBars } from 'react-icons/fa'; // Importing FontAwesome icon

export default function Sidebar({ onFilterChange, isOpen, closeSidebar }) {
  return (
    <>
      <div
        className={`fixed top-0 left-0 z-40 h-full bg-gray-800 text-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-64 lg:flex lg:flex-col`}
        style={{ width: '16rem' }}
      >
        <button
          className="lg:hidden p-4 text-white"
          onClick={closeSidebar}
        >
          <FaBars size={24} />
        </button>
        <div className="p-4 flex flex-col h-full">
          <button onClick={() => onFilterChange('All')} className="mb-2">All</button>
          <button onClick={() => onFilterChange('Important')} className="mb-2">Important</button>
          <button onClick={() => onFilterChange('In Progress')} className="mb-2">In Progress</button>
          <button onClick={() => onFilterChange('To Do')} className="mb-2">To Do</button>
          <button onClick={() => onFilterChange('Completed')} className="mb-2">Completed</button>
          <button onClick={() => onFilterChange('Incomplete')} className="mb-2">Incomplete</button>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 z-30 p-4 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        style={{ top: '3.5rem' }} // Adjust top to account for the fixed header height
      >
        <button
          onClick={() => closeSidebar()}
          className="text-white"
        >
          <FaBars size={24} />
        </button>
      </div>
    </>
  );
}
