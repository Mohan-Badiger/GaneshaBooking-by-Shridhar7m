import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, CheckCircle, XCircle, Star, Plus, Settings as SettingsIcon, Eye } from 'lucide-react';
import { CardSkeleton } from '../../components/LoadingSkeleton';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, available: 0, outOfStock: 0, featured: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/dashboard');
        if (response.data && response.data.success) {
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
        setError('Failed to fetch dashboard metrics. Please reload.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cardClass = "bg-white p-6 rounded-3xl border border-festival-creamDark shadow-sm flex items-center justify-between";

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6 font-sans">
        <div className="h-8 w-48 rounded shimmer-loader"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-3xl shimmer-loader"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-festival-maroon">
            Admin Dashboard
          </h1>
          <p className="text-xs text-festival-darkLight/60">
            Overview of Ganesha catalog status and store parameters.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/idols/new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-festival-maroon hover:bg-festival-maroonDark text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Ganesha
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-festival-cream hover:bg-festival-creamDark text-festival-maroon border border-festival-maroon/20 text-xs font-bold rounded-xl transition-all"
          >
            <SettingsIcon className="w-4 h-4" /> Business Info
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Idols */}
        <div className={cardClass}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-festival-darkLight/50 uppercase tracking-wider">Total Catalog</span>
            <p className="text-3xl font-black text-festival-maroon">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-festival-cream text-festival-maroon rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Available Idols */}
        <div className={cardClass}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-festival-darkLight/50 uppercase tracking-wider">Available</span>
            <p className="text-3xl font-black text-emerald-600">{stats.available}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Out of Stock Idols */}
        <div className={cardClass}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-festival-darkLight/50 uppercase tracking-wider">Sold Out</span>
            <p className="text-3xl font-black text-red-600">{stats.outOfStock}</p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Featured Idols */}
        <div className={cardClass}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-festival-darkLight/50 uppercase tracking-wider">Featured</span>
            <p className="text-3xl font-black text-festival-saffron">{stats.featured}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-festival-saffron rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Catalog Manage Shortcut */}
        <div className="bg-white border border-festival-creamDark rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-black text-festival-maroon">Manage Ganesh Idols</h3>
            <p className="text-xs text-festival-darkLight/70 leading-relaxed">
              View all current Ganeshas in your system. Update their pricing, height specifications, custom features lists, and mark their availability tags instantly.
            </p>
          </div>
          <Link
            to="/admin/idols"
            className="w-full text-center py-3 bg-festival-cream text-festival-maroon border border-festival-maroon/20 hover:bg-festival-creamDark font-bold rounded-xl text-xs transition-all"
          >
            Open Catalog Manager
          </Link>
        </div>

        {/* Dynamic Settings Shortcut */}
        <div className="bg-white border border-festival-creamDark rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-black text-festival-maroon">Dynamic Shop Settings</h3>
            <p className="text-xs text-festival-darkLight/70 leading-relaxed">
              Edit the business address, phone lines, workshop timings, pickup instructions, and configured WhatsApp booking lines dynamically without touches to source code.
            </p>
          </div>
          <Link
            to="/admin/settings"
            className="w-full text-center py-3 bg-festival-cream text-festival-maroon border border-festival-maroon/20 hover:bg-festival-creamDark font-bold rounded-xl text-xs transition-all"
          >
            Modify Shop Parameters
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
