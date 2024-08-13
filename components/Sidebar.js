import { FaBars, FaTimes } from 'react-icons/fa'; // Importing FontAwesome icons

export default function Sidebar({ onFilterChange, isOpen, closeSidebar }) {
  return (
    <>
      {/* Sidebar for large screens */}
      <div
        className={`fixed top-16 left-0 z-40 h-screen bg-gray-800 text-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-64 lg:flex lg:flex-col lg:top-16 lg:h-[calc(100vh-4rem)] lg:shadow-lg lg:border-l lg:border-gray-700`}
        style={{ width: '16rem' }}
      >
        {/* Close Button for Large Screens */}
        <button
          className="lg:hidden p-4 text-white absolute top-4 right-4"
          onClick={closeSidebar}
        >
          <FaTimes size={24} />
        </button>
        <div className="p-4 flex flex-col h-full">
          <button 
            onClick={() => onFilterChange('All')} 
            className="mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            All
          </button>
          <button 
            onClick={() => onFilterChange('Important')} 
            className="mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            Important
          </button>
          <button 
            onClick={() => onFilterChange('In Progress')} 
            className="mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            In Progress
          </button>
          <button 
            onClick={() => onFilterChange('To Do')} 
            className="mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            To Do
          </button>
          <button 
            onClick={() => onFilterChange('Completed')} 
            className="mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            Completed
          </button>
          <button 
            onClick={() => onFilterChange('Incomplete')} 
            className="mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            Incomplete
          </button>
        </div>
      </div>

      {/* Close Button for Mobile Screens */}
      <div
        className={`fixed top-0 left-0 z-30 p-4 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        style={{ top: '3.5rem' }} // Adjust top to account for the fixed header height
      >
        <button
          onClick={closeSidebar}
          className="text-white"
        >
          <FaTimes size={24} />
        </button>
      </div>
    </>
  );
}
