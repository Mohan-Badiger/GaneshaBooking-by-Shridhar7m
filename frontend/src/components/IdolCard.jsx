import React from 'react';
import { Link } from 'react-router-dom';
import { Ruler, ShoppingBag, Eye, Award } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getFullImageUrl, handleImageError, FALLBACK_IMAGE } from '../utils/urlHelper';

const IdolCard = ({ idol }) => {
  const { settings } = useSettings();
  const { _id, name, code, height, price, images, availability, material, featured } = idol;

  // Format price to Indian currency style
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  const primaryImage = images && images.length > 0
    ? getFullImageUrl(images[0])
    : FALLBACK_IMAGE;

  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919876543210';

  return (
    <div className="bg-white rounded-2xl border border-festival-creamDark/80 overflow-hidden shadow-[0_4px_20px_-4px_rgba(197,160,40,0.08)] hover:shadow-[0_12px_30px_-6px_rgba(92,6,18,0.12)] transition-all duration-300 flex flex-col h-full group relative hover:-translate-y-1">
      {/* Featured Badge */}
      {featured && (
        <span className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10 bg-linear-to-r from-festival-gold to-festival-goldLight text-festival-dark text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md flex items-center gap-1 shadow-md border border-white/20">
          <Award className="w-3 h-3" /> Special Model
        </span>
      )}

      {/* Idol Image Container */}
      <div className="relative aspect-square overflow-hidden bg-festival-cream/50 border-b border-festival-creamDark/40">
        <img
          src={primaryImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onError={handleImageError}
        />
        {/* Availability Overlay */}
        {!availability && (
          <div className="absolute inset-0 bg-festival-dark/85 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300">
            <span className="bg-transparent border-2 border-festival-gold text-festival-gold font-serif font-medium text-xs tracking-widest px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg shadow-lg uppercase">
              Bookings Full
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col grow">
        {/* Material & Availability Status */}
        <div className="flex justify-between items-center mb-1.5 sm:mb-2">
          <span className="text-[10px] text-festival-gold font-bold tracking-widest uppercase">
            {material}
          </span>
          {availability ? (
            <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold tracking-wider px-2 py-0.5 rounded-sm border border-emerald-200/50">
              AVAILABLE
            </span>
          ) : (
            <span className="text-[9px] bg-festival-creamDark/50 text-festival-darkLight/60 font-bold tracking-wider px-2 py-0.5 rounded-sm">
              RESERVED
            </span>
          )}
        </div>

        {/* Idol Name */}
        <h3 className="text-sm sm:text-base font-serif font-medium text-festival-maroon mb-1.5 line-clamp-1 group-hover:text-festival-gold transition-colors duration-300">
          {name}
        </h3>

        {/* Height and Pricing */}
        <div className="flex justify-between items-center pt-2 sm:pt-2.5 pb-3 sm:pb-3.5 mt-auto border-t border-festival-creamDark/60">
          <div className="flex flex-col text-left space-y-0.5 text-festival-darkLight/70 text-[11px]">
            <div className="flex items-center">
              <Ruler className="w-3.5 h-3.5 text-festival-gold mr-1 shrink-0" />
              <span>Height: {height} Ft</span>
            </div>
            {code && (
              <span className="text-[10px] font-bold text-festival-gold/90 font-sans">
                Code: #{code}
              </span>
            )}
          </div>
          <div className="text-base sm:text-lg font-serif font-bold text-festival-maroon">
            {formattedPrice}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-auto pt-1">
          <Link
            to={`/idols/${_id}`}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 sm:px-3 bg-festival-cream/50 hover:bg-festival-creamDark text-festival-maroon font-bold rounded-xl text-xs transition-all border border-festival-maroon/10 tracking-wide text-center"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" /> <span>Details</span>
          </Link>
          {availability ? (
            <Link
              to={`/book/${_id}`}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 sm:px-3 bg-festival-maroon hover:bg-festival-maroonDark text-white font-bold rounded-xl text-xs transition-all shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-center"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" /> <span>Book</span>
            </Link>
          ) : (
            <a
              href={`https://wa.me/${whatsappNum}?text=Hello,%20is%20idol%20${encodeURIComponent(name)}%20(Code:%20${code})%20available%20for%20special%20order?`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 sm:px-3 bg-festival-darkLight hover:bg-[#3E3833] text-[#DED7D2] font-semibold rounded-xl text-xs transition-all text-center"
            >
              Inquire
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdolCard;
