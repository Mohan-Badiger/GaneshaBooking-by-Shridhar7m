import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Check, X, Star, Ruler, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { TableRowSkeleton } from '../../components/LoadingSkeleton';
import Toast from '../../components/Toast';

const IdolManagement = () => {
  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [availability, setAvailability] = useState('all'); // all, true, false
  const [sort, setSort] = useState('displayOrder');

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchIdols = async () => {
    try {
      setLoading(true);
      let queryParams = ['limit=100'];

      if (debouncedSearch) queryParams.push(`search=${encodeURIComponent(debouncedSearch)}`);
      if (availability !== 'all') queryParams.push(`availability=${availability}`);
      if (sort !== 'displayOrder') queryParams.push(`sort=${sort}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const response = await axios.get(`/api/idols${queryString}`);

      if (response.data && response.data.success) {
        setIdols(response.data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load idols:', err);
      setError('Could not fetch catalog. Make sure the server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdols();
  }, [debouncedSearch, availability, sort]);

  const handleToggleStatus = async (id, field, currentValue) => {
    try {
      const updateData = { [field]: !currentValue };
      const response = await axios.patch(`/api/admin/idols/${id}/status`, updateData);

      if (response.data && response.data.success) {
        setIdols((prev) =>
          prev.map((idol) => (idol._id === id ? { ...idol, [field]: !currentValue } : idol))
        );
        setToastType('success');
        setToastMessage(`Updated Ganesha ${field} status successfully.`);
      }
    } catch (err) {
      console.error('Status patch error:', err);
      setToastType('error');
      setToastMessage('Could not update status.');
    }
  };

  const handleDeleteIdol = async (id, name) => {
    const confirmDelete = window.confirm(`Are you absolutely sure you want to delete "${name}"? This will permanently remove it from the catalog and delete all associated image files.`);
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/api/admin/idols/${id}`);
      if (response.data && response.data.success) {
        setIdols((prev) => prev.filter((idol) => idol._id !== id));
        setToastType('success');
        setToastMessage(`"${name}" deleted successfully.`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Could not delete Ganesha idol.');
    }
  };

  // Helper for rendering image previews safely
  const getPrimaryImage = (images) => {
    if (!images || images.length === 0) {
      return 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=150';
    }
    const img = images[0];
    if (img.startsWith('http')) return img;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-festival-maroon">
            Catalog Manager
          </h1>
          <p className="text-xs text-festival-darkLight/60">
            View, search, edit, delete, and control Ganesha listings.
          </p>
        </div>
        <div>
          <Link
            to="/admin/idols/new"
            className="flex items-center gap-1.5 px-5 py-3 bg-festival-maroon hover:bg-festival-maroonDark text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4.5 h-4.5" /> Add New Ganesha
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-festival-creamDark rounded-3xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="relative sm:col-span-6">
          <Search className="w-4.5 h-4.5 text-festival-darkLight/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Ganesha name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Availability */}
        <div className="relative sm:col-span-3 flex items-center bg-festival-cream/30 border border-festival-creamDark rounded-2xl px-3 py-2.5">
          <SlidersHorizontal className="w-4 h-4 text-festival-maroon/70 mr-2 shrink-0" />
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full bg-transparent text-xs text-festival-darkLight font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Bookings</option>
            <option value="true">Available</option>
            <option value="false">Sold Out</option>
          </select>
        </div>

        {/* Sort */}
        <div className="relative sm:col-span-3 flex items-center bg-festival-cream/30 border border-festival-creamDark rounded-2xl px-3 py-2.5">
          <ArrowUpDown className="w-4 h-4 text-festival-maroon/70 mr-2 shrink-0" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-transparent text-xs text-festival-darkLight font-medium focus:outline-none cursor-pointer"
          >
            <option value="displayOrder">Sort: Recommended</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="newest">Sort: Newest First</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Table for Desktop */}
      <div className="hidden md:block bg-white border border-festival-creamDark rounded-3xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-festival-creamDark">
          <thead className="bg-festival-cream/40">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-festival-maroon uppercase tracking-wider">
                Ganesha Idol
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-festival-maroon uppercase tracking-wider">
                Dimensions
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-festival-maroon uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-festival-maroon uppercase tracking-wider">
                Status Toggle
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-festival-maroon uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-festival-creamDark text-sm">
            {loading ? (
              [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : idols.length > 0 ? (
              idols.map((idol) => (
                <tr key={idol._id} className="hover:bg-festival-cream/10">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-festival-cream border border-festival-creamDark shrink-0">
                        <img
                          src={getPrimaryImage(idol.images)}
                          alt={idol.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-festival-maroon">{idol.name}</div>
                        <div className="text-xs text-festival-darkLight/50">{idol.material}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-festival-darkLight/75">
                    <div className="flex items-center font-medium">
                      <Ruler className="w-3.5 h-3.5 text-festival-saffron mr-1 shrink-0" />
                      <span>{idol.height} ft {idol.width ? `x ${idol.width} ft` : ''}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-festival-maroon">
                    ₹{idol.price.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-4">
                      {/* Availability Toggle */}
                      <button
                        onClick={() => handleToggleStatus(idol._id, 'availability', idol.availability)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          idol.availability
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                        title="Click to toggle availability"
                      >
                        {idol.availability ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Bookable
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" /> Sold Out
                          </>
                        )}
                      </button>

                      {/* Featured Toggle */}
                      <button
                        onClick={() => handleToggleStatus(idol._id, 'featured', idol.featured)}
                        className={`p-1.5 rounded-xl border transition-all ${
                          idol.featured
                            ? 'bg-amber-50 border-amber-300 text-festival-saffron shadow-sm'
                            : 'bg-white border-festival-creamDark text-festival-darkLight/35 hover:text-festival-saffron'
                        }`}
                        title="Click to toggle featured spotlight"
                      >
                        <Star className={`w-4 h-4 ${idol.featured ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/idols/edit/${idol._id}`}
                        className="p-2 text-festival-darkLight hover:text-festival-maroon hover:bg-festival-cream rounded-xl transition-all"
                        title="Edit details"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteIdol(idol._id, idol.name)}
                        className="p-2 text-festival-darkLight hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Ganesha"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-festival-darkLight/50">
                  No Ganesh idols found in catalog matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Responsive Cards for Mobile */}
      <div className="md:hidden space-y-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-festival-creamDark rounded-2xl p-4 shimmer-loader h-32"></div>
          ))
        ) : idols.length > 0 ? (
          idols.map((idol) => (
            <div key={idol._id} className="bg-white border border-festival-creamDark rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-festival-cream border border-festival-creamDark shrink-0">
                  <img
                    src={getPrimaryImage(idol.images)}
                    alt={idol.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-festival-maroon text-sm leading-tight">{idol.name}</h3>
                  <p className="text-[10px] text-festival-darkLight/60">{idol.material}</p>
                  <p className="text-sm font-black text-festival-maroon">₹{idol.price.toLocaleString('en-IN')}</p>
                  <div className="text-[10px] text-festival-darkLight/60 flex items-center pt-0.5">
                    <Ruler className="w-3.5 h-3.5 text-festival-saffron mr-1 shrink-0" />
                    <span>Height: {idol.height} ft {idol.width ? `x ${idol.width} ft` : ''}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Quick Toggles & Edit CTA */}
              <div className="border-t border-dashed border-festival-creamDark pt-3.5 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStatus(idol._id, 'availability', idol.availability)}
                    className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold rounded-full transition-all border ${
                      idol.availability
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    {idol.availability ? 'Bookable' : 'Sold Out'}
                  </button>

                  <button
                    onClick={() => handleToggleStatus(idol._id, 'featured', idol.featured)}
                    className={`p-1.5 rounded-xl border transition-all ${
                      idol.featured
                        ? 'bg-amber-50 border-amber-300 text-festival-saffron'
                        : 'bg-white border-festival-creamDark text-festival-darkLight/35'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${idol.featured ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/admin/idols/edit/${idol._id}`}
                    className="p-2 border border-festival-creamDark text-festival-darkLight hover:text-festival-maroon rounded-xl transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteIdol(idol._id, idol.name)}
                    className="p-2 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white border border-festival-creamDark rounded-2xl text-festival-darkLight/50">
            No Ganesh idols found in catalog.
          </div>
        )}
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
};

export default IdolManagement;
