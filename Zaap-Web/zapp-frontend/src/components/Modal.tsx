import React from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 relative min-w-[320px] max-w-full">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-yellow-400 text-xl"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
