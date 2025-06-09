import React from 'react';

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition duration-200 text-xl"
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
