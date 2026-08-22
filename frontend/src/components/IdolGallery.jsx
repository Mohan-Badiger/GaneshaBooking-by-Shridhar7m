import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IdolGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback if no images are loaded
  const fallbackImage = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800';
  const galleryList = images.length > 0 ? images : [fallbackImage];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  // Build clean absolute path or return external URLs
  const getImageUrl = (url) => {
    if (!url) return fallbackImage;
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
  };

  return (
    <div className="space-y-4">
      {/* Main Image Frame */}
      <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-festival-cream border border-festival-creamDark shadow-sm group">
        <img
          src={getImageUrl(galleryList[activeIndex])}
          alt={`Ganesha View ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Carousel Arrow Controllers (Only if > 1 images) */}
        {galleryList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-festival-maroon flex items-center justify-center shadow-md transition-all active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-festival-maroon flex items-center justify-center shadow-md transition-all active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Index indicator */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium">
          {activeIndex + 1} / {galleryList.length}
        </div>
      </div>

      {/* Thumbnails (Only if > 1 images) */}
      {galleryList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {galleryList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 w-20 aspect-4/5 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? 'border-festival-maroon shadow-md scale-95'
                  : 'border-festival-creamDark opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={getImageUrl(img)}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdolGallery;
