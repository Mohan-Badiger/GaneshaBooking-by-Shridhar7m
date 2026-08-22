import React from 'react';
import { useSettings } from '../context/SettingsContext';

const WhatsAppButton = () => {
  const { settings } = useSettings();

  // Strip non-digits from WhatsApp number
  const formattedNumber = settings.whatsappNumber.replace(/\D/g, '');

  return (
    <a
      href={`https://wa.me/${formattedNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-300"
      aria-label="Contact us on WhatsApp"
      title="Quick inquiry on WhatsApp"
    >
      <svg
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.449 5.483 0 9.944-4.461 9.947-9.948.002-2.658-1.03-5.155-2.906-7.03C16.436 1.741 13.94 1.7 12.01 1.7c-5.485 0-9.948 4.463-9.951 9.953-.001 1.929.501 3.541 1.448 5.109L2.528 21.36l4.119-1.206z" />
      </svg>
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-sm font-semibold pl-0 group-hover:pl-2">
        Chat with Us
      </span>
    </a>
  );
};

export default WhatsAppButton;
