import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getFullImageUrl, handleImageError, FALLBACK_IMAGE } from '../utils/urlHelper';

const IdolGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback if no images are loaded
  const galleryList = images.length > 0 ? images : [FALLBACK_IMAGE];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  // Build clean absolute path or return external URLs
  const getImageUrl = (url) => {
    return getFullImageUrl(url);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image Frame */}
      <div className="relative aspect-4/5 rounded-2xl sm:rounded-3xl overflow-hidden bg-festival-cream border border-festival-creamDark shadow-xs group">
        <img
          src={getImageUrl(galleryList[activeIndex])}
          alt={`Ganesha View ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
          onError={handleImageError}
        />

        {/* Carousel Arrow Controllers (Only if > 1 images) */}
        {galleryList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-festival-maroon flex items-center justify-center shadow-md transition-all active:scale-90 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-festival-maroon flex items-center justify-center shadow-md transition-all active:scale-90 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Index indicator */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/60 backdrop-blur-xs text-white text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-medium">
          {activeIndex + 1} / {galleryList.length}
        </div>
      </div>

      {/* Thumbnails (Only if > 1 images) */}
      {galleryList.length > 1 && (
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-1.5 scrollbar-thin">
          {galleryList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 w-16 sm:w-20 aspect-4/5 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'border-festival-maroon shadow-xs scale-95'
                  : 'border-festival-creamDark opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={getImageUrl(img)}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdolGallery;
