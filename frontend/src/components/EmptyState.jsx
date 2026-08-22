import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  title = 'No Ganesh idols found',
  description = 'We couldn\'t find any Ganesha idols matching your criteria. Try adjusting your filters or search terms.',
  showReset = true,
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white rounded-3xl border border-festival-creamDark shadow-sm max-w-lg mx-auto my-8">
      <div className="p-4 bg-festival-cream rounded-full text-festival-maroon/80 mb-4">
        <Search className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-serif font-bold text-festival-maroon mb-2">{title}</h3>
      <p className="text-festival-darkLight text-sm md:text-base mb-6 leading-relaxed">
        {description}
      </p>
      {showReset && (
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          {onReset ? (
            <button
              onClick={onReset}
              className="px-6 py-2.5 bg-festival-maroon text-white font-medium rounded-xl hover:bg-festival-maroonDark transition-all text-sm shadow-sm"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              to="/idols"
              className="px-6 py-2.5 bg-festival-maroon text-white font-medium rounded-xl hover:bg-festival-maroonDark transition-all text-sm shadow-sm"
            >
              Browse All Idols
            </Link>
          )}
          <a
            href="https://wa.me/919876543210" // Will override in actual integration with settings WHATSAPP_NUMBER
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-all text-sm shadow-sm"
          >
            Inquire on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
