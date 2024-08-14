import React from 'react';
import { XCircle } from 'react-feather'; // Import the Feather icon

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
        {/* Close Button Inside the Box */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <XCircle size={24} /> {/* Replaced with a Feather icon */}
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
