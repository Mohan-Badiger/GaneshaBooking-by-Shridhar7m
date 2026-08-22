import React from 'react';
import { Link } from 'react-router-dom';
import { Ruler, ShoppingBag, Eye, BadgePercent } from 'lucide-react';

const IdolCard = ({ idol }) => {
  const { _id, name, height, price, images, availability, material, featured } = idol;

  // Format price to Indian currency style
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  // Fallback image if empty
  const primaryImage = images && images.length > 0
    ? (images[0].startsWith('http') || images[0].startsWith('/uploads/') ? images[0] : `http://localhost:5000${images[0]}`)
    : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="bg-white rounded-3xl border border-festival-creamDark overflow-hidden shadow-sm hover-card flex flex-col h-full group relative">
      {/* Featured Badge */}
      {featured && (
        <span className="absolute top-4 left-4 z-10 bg-festival-saffron text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
          <BadgePercent className="w-3.5 h-3.5" /> Featured
        </span>
      )}

      {/* Idol Image Container */}
      <div className="relative aspect-4/5 overflow-hidden bg-festival-cream">
        <img
          src={primaryImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Availability Overlay */}
        {!availability && (
          <div className="absolute inset-0 bg-[#1C1816]/75 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-festival-maroon border border-festival-gold/50 text-white font-serif font-bold text-sm tracking-wider px-5 py-2 rounded-xl shadow-lg">
              BOOKINGS CLOSED
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        {/* Material & Availability Status */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-festival-darkLight/70 font-medium truncate max-w-[70%]">
            {material}
          </span>
          {availability ? (
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 px-2.5 py-0.5 rounded-full">
              AVAILABLE
            </span>
          ) : (
            <span className="text-[10px] bg-red-50 text-red-700 font-bold border border-red-200 px-2.5 py-0.5 rounded-full">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Idol Name */}
        <h3 className="text-lg font-serif font-black text-festival-maroon mb-2 line-clamp-1 group-hover:text-festival-maroonDark transition-colors">
          {name}
        </h3>

        {/* Height and Pricing */}
        <div className="flex justify-between items-baseline pt-2 pb-4 mt-auto border-t border-dashed border-festival-creamDark">
          <div className="flex items-center text-festival-darkLight text-sm font-medium">
            <Ruler className="w-4 h-4 text-festival-saffron mr-1.5 shrink-0" />
            <span>Height: {height} Feet</span>
          </div>
          <div className="text-xl font-extrabold text-festival-maroon">
            {formattedPrice}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto pt-1">
          <Link
            to={`/idols/${_id}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-festival-cream hover:bg-festival-creamDark text-festival-maroon font-semibold rounded-xl text-xs transition-all border border-festival-maroon/10"
          >
            <Eye className="w-3.5 h-3.5" /> Details
          </Link>
          {availability ? (
            <Link
              to={`/book/${_id}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-festival-maroon hover:bg-festival-maroonDark text-white font-semibold rounded-xl text-xs transition-all shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Book Now
            </Link>
          ) : (
            <a
              href="https://wa.me/919876543210" // Replaced by general helper or custom trigger
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-festival-darkLight hover:bg-[#3E3833] text-[#DED7D2] font-semibold rounded-xl text-xs transition-all"
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
