import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const typeStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-xl border shadow-lg max-w-md w-[calc(100vw-2rem)] md:w-96 transition-all duration-300 transform scale-100 ${typeStyles[type]}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">{icons[type]}</div>
      <div className="flex-grow font-sans text-sm font-medium mr-2">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-75 transition-opacity focus:outline-none"
        aria-label="Close message"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
