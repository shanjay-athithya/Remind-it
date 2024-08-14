import { XCircle } from 'react-feather'; // Importing Feather Icons for a cool close icon
import { FiPlusCircle } from 'react-icons/fi'; // Importing Feather Icon for the new task button

export default function Sidebar({ onFilterChange, isOpen, closeSidebar, openTaskModal }) {
  const handleOptionClick = (filterOption) => {
    onFilterChange(filterOption);
    if (window.innerWidth < 1024) {
      closeSidebar(); // Close sidebar on mobile screens after selecting an option
    }
  };

  return (
    <>
      {/* Sidebar for large screens */}
      <div
        className={`fixed top-16 left-0 z-40 h-screen bg-gray-800 text-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-64 lg:flex lg:flex-col lg:top-16 lg:h-[calc(100vh-4rem)] lg:shadow-lg lg:border-l lg:border-gray-700`}
        style={{ width: '16rem' }}
      >
        {/* Close Button for Large Screens */}
        <button
          className="lg:hidden p-4 text-white absolute right-2"
          onClick={closeSidebar}
        >
          <XCircle size={24} /> {/* Using a cool Feather Icon */}
        </button>

        <div className="p-4 flex flex-col h-full">
          {/* New Task Button for Large Screens */}
          <button 
            onClick={openTaskModal} // Opens the modal to add a new task
            className="hidden lg:flex mb-4 py-3 px-4 bg-blue-500 text-left text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <FiPlusCircle size={20} className="mr-2" /> {/* Feather Icon for New Task */}
            New Task
          </button>

          {/* Sidebar Options */}
          <button 
            onClick={() => handleOptionClick('All')} 
            className="mt-4 mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            All
          </button>
          <button 
            onClick={() => handleOptionClick('Important')} 
            className="mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            Important
          </button>
          <button 
            onClick={() => handleOptionClick('In Progress')} 
            className="mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            In Progress
          </button>
          <button 
            onClick={() => handleOptionClick('To Do')} 
            className="mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            To Do
          </button>
          <button 
            onClick={() => handleOptionClick('Completed')} 
            className="mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            Completed
          </button>
          <button 
            onClick={() => handleOptionClick('Incomplete')} 
            className="mb-2 py-3 px-4 border-b border-gray-600 text-left hover:bg-gray-700 transition-colors"
          >
            Incomplete
          </button>
        </div>
      </div>

      {/* Close Button and New Task Button for Mobile Screens */}
      <div
        className={`fixed top-0 left-0 z-30 p-4 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        style={{ top: '3.5rem' }} // Adjust top to account for the fixed header height
      >
        <button
          onClick={closeSidebar}
          className="text-white"
        >
          <XCircle size={24} /> {/* Using a cool Feather Icon */}
        </button>

        {/* New Task Button for Mobile Screens */}
        <button 
          onClick={openTaskModal} // Opens the modal to add a new task
          className="mt-4 py-3 px-4 bg-blue-500 text-left text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <FiPlusCircle size={20} className="mr-2" /> {/* Feather Icon for New Task */}
          New Task
        </button>
      </div>
    </>
  );
}
