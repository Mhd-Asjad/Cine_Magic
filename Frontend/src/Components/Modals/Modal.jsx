import React from 'react';

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[40%] h-[480px] p-6 transform transition-all scale-95 md:scale-100">
        <button
          onClick={closeModal}
          className="absolute top-5 right-4 text-gray-400 hover:text-gray-600 transition duration-200"
          aria-label="Close"
        >
          X
        </button>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
