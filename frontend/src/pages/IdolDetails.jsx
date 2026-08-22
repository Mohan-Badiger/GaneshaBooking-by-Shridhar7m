import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Ruler, Award, ShieldCheck, Heart, Leaf, ChevronLeft, ShoppingBag } from 'lucide-react';
import IdolGallery from '../components/IdolGallery';
import { DetailSkeleton } from '../components/LoadingSkeleton';

const IdolDetails = () => {
  const { id } = useParams();
  const [idol, setIdol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdolDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/idols/${id}`);
        if (response.data && response.data.success) {
          setIdol(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load idol info:', err);
        setError('Ganesha idol details could not be found.');
      } finally {
        setLoading(false);
      }
    };
    fetchIdolDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !idol) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-black text-festival-maroon">Oops! Details Not Found</h2>
        <p className="text-festival-darkLight/70">{error || 'Idol could not be resolved.'}</p>
        <Link
          to="/idols"
          className="inline-flex items-center text-sm font-bold text-festival-maroon hover:underline"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Ganesh Catalog
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(idol.price);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/idols"
          className="inline-flex items-center text-sm font-bold text-festival-maroon/70 hover:text-festival-maroon transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Ganesh Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="w-full">
          <IdolGallery images={idol.images} />
        </div>

        {/* Right Column: Information Panel */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              {idol.availability ? (
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 px-3 py-1 rounded-full">
                  AVAILABLE FOR BOOKING
                </span>
              ) : (
                <span className="text-xs bg-red-50 text-red-700 font-bold border border-red-200 px-3 py-1 rounded-full">
                  FULLY BOOKED / SOLD OUT
                </span>
              )}
              {idol.featured && (
                <span className="text-xs bg-festival-gold/20 text-festival-maroon border border-festival-gold/40 font-bold px-3 py-1 rounded-full">
                  ★ RECOMMENDED
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-festival-maroon leading-tight">
              {idol.name}
            </h1>
            <p className="text-sm font-semibold text-festival-darkLight/60">
              Sculpture Material: {idol.material}
            </p>
          </div>

          {/* Price Tag */}
          <div className="bg-linear-to-r from-festival-cream to-festival-creamDark border-l-4 border-festival-gold p-4 rounded-xl flex items-baseline justify-between shadow-sm">
            <span className="text-xs font-bold text-festival-darkLight/60 uppercase tracking-wider">
              Booking Price
            </span>
            <span className="text-3xl font-extrabold text-festival-maroon">
              {formattedPrice}
            </span>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-festival-creamDark rounded-2xl bg-white space-y-1">
              <span className="text-xs text-festival-darkLight/50 font-medium">Height</span>
              <p className="text-lg font-serif font-bold text-festival-maroon flex items-center">
                <Ruler className="w-4 h-4 text-festival-saffron mr-1.5 shrink-0" />
                {idol.height} Feet
              </p>
            </div>
            {idol.width ? (
              <div className="p-4 border border-festival-creamDark rounded-2xl bg-white space-y-1">
                <span className="text-xs text-festival-darkLight/50 font-medium">Width</span>
                <p className="text-lg font-serif font-bold text-festival-maroon flex items-center">
                  <Ruler className="w-4 h-4 text-festival-saffron mr-1.5 shrink-0" />
                  {idol.width} Feet
                </p>
              </div>
            ) : null}
            {idol.code && (
              <div className={`p-4 border border-festival-creamDark rounded-2xl bg-white space-y-1 ${idol.width ? 'col-span-2 sm:col-span-1' : ''}`}>
                <span className="text-xs text-festival-darkLight/50 font-medium">Model Code</span>
                <p className="text-lg font-sans font-extrabold text-festival-maroon flex items-center">
                  #{idol.code}
                </p>
              </div>
            )}
          </div>

          <hr className="border-festival-creamDark" />

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-bold text-festival-maroon">Artisan Description</h3>
            <p className="text-festival-darkLight/80 text-sm md:text-base leading-relaxed">
              {idol.description}
            </p>
          </div>

          {/* Features Checklist */}
          {idol.features && idol.features.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-festival-maroon uppercase tracking-wider">
                Special Specifications
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-festival-darkLight/85">
                {idol.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <hr className="border-festival-creamDark" />

          {/* Trust points */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-festival-darkLight/70">
            <div className="flex flex-col items-center space-y-1">
              <Leaf className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold">Eco Mud</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Award className="w-5 h-5 text-festival-saffron" />
              <span className="font-semibold">Local Craft</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-semibold">Devout Sculpting</span>
            </div>
          </div>

          {/* CTA Book Button */}
          <div className="pt-4">
            {idol.availability ? (
              <Link
                to={`/book/${idol._id}`}
                className="w-full flex items-center justify-center gap-2 py-4 bg-festival-maroon hover:bg-festival-maroonDark text-white font-bold rounded-2xl text-base transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-[0.99]"
              >
                <ShoppingBag className="w-5 h-5" /> Book Ganesha Idol
              </Link>
            ) : (
              <div className="space-y-3">
                <button
                  disabled
                  className="w-full py-4 bg-festival-darkLight/10 text-festival-darkLight/50 font-bold rounded-2xl text-base cursor-not-allowed border border-festival-creamDark"
                >
                  Bookings Closed
                </button>
                <p className="text-xs text-center text-festival-darkLight/50">
                  This Ganesha is fully booked. Please contact us on WhatsApp to check if more stock can be made.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdolDetails;
