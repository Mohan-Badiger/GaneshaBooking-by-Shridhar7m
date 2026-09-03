import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import IdolCard from '../components/IdolCard';
import EmptyState from '../components/EmptyState';
import { CardGridSkeleton } from '../components/LoadingSkeleton';

const Idols = () => {
  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [availability, setAvailability] = useState('all'); // all, true, false
  const [sort, setSort] = useState('displayOrder'); // displayOrder, priceAsc, priceDesc, newest
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchIdols = async () => {
    try {
      setLoading(true);
      let queryParams = [];

      if (debouncedSearch) queryParams.push(`search=${encodeURIComponent(debouncedSearch)}`);
      if (availability !== 'all') queryParams.push(`availability=${availability}`);
      if (featuredOnly) queryParams.push(`featured=true`);
      if (sort !== 'displayOrder') queryParams.push(`sort=${sort}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const response = await axios.get(`/api/idols${queryString}`);

      if (response.data && response.data.success) {
        setIdols(response.data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load idols:', err);
      setError('Unable to load Ganesha idols. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdols();
  }, [debouncedSearch, availability, sort, featuredOnly]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setAvailability('all');
    setSort('displayOrder');
    setFeaturedOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans space-y-6 sm:space-y-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-festival-maroon">
          Ganesh Idol Catalog
        </h1>
        <p className="text-festival-darkLight/70 text-xs sm:text-sm md:text-base">
          Browse and select from our available traditional clay statues.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white border border-festival-creamDark rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Search Box */}
          <div className="relative sm:col-span-2 md:col-span-6 lg:col-span-5">
            <Search className="w-5 h-5 text-festival-darkLight/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Ganesha name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-11"
            />
          </div>

          {/* Availability Select */}
          <div className="relative sm:col-span-1 md:col-span-3 flex items-center bg-festival-cream/50 border border-festival-creamDark rounded-2xl px-3 py-3">
            <SlidersHorizontal className="w-4 h-4 text-festival-maroon/70 mr-2 shrink-0" />
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full bg-transparent text-sm text-festival-darkLight font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="true">Available Only</option>
              <option value="false">Sold Out Only</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="relative sm:col-span-1 md:col-span-3 lg:col-span-4 flex items-center bg-festival-cream/50 border border-festival-creamDark rounded-2xl px-3 py-3">
            <ArrowUpDown className="w-4 h-4 text-festival-maroon/70 mr-2 shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-transparent text-sm text-festival-darkLight font-medium focus:outline-none cursor-pointer"
            >
              <option value="displayOrder">Sort: Recommended</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="newest">Sort: Newest First</option>
            </select>
          </div>
        </div>

        {/* Featured Toggle Tag & Reset */}
        <div className="flex flex-wrap gap-2.5 pt-1 items-center justify-between">
          <button
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              featuredOnly
                ? 'bg-festival-saffron border-festival-gold text-festival-dark shadow-xs'
                : 'bg-white border-festival-creamDark text-festival-darkLight/70 hover:bg-festival-cream'
            }`}
          >
            ★ Featured Idols Only
          </button>

          {(searchTerm || availability !== 'all' || featuredOnly || sort !== 'displayOrder') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-festival-maroon hover:text-festival-maroonDark underline decoration-dotted cursor-pointer py-1"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid or Loading States */}
      {loading ? (
        <CardGridSkeleton count={8} />
      ) : error ? (
        <div className="text-center py-12 sm:py-16 bg-white border border-festival-creamDark rounded-2xl sm:rounded-3xl text-red-700 px-4">
          <p className="font-semibold text-base sm:text-lg">{error}</p>
          <button
            onClick={fetchIdols}
            className="mt-4 px-6 py-2.5 bg-festival-maroon text-white font-bold rounded-xl hover:bg-festival-maroonDark transition-all text-sm"
          >
            Retry Loading
          </button>
        </div>
      ) : idols.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
          {idols.map((idol) => (
            <IdolCard key={idol._id} idol={idol} />
          ))}
        </div>
      ) : (
        <EmptyState onReset={handleResetFilters} />
      )}
    </div>
  );
};

export default Idols;
