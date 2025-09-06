import { createPortal } from 'react-dom';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 10000
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};
