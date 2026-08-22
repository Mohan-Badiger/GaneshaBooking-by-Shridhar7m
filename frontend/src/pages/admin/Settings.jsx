import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from '../../context/SettingsContext';
import { Save, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';
import Toast from '../../components/Toast';

const Settings = () => {
  const { settings, setSettings, refreshSettings } = useSettings();

  const [formData, setFormData] = useState({
    businessName: '',
    whatsappNumber: '',
    phoneNumber: '',
    address: '',
    businessHours: '',
    mapsEmbedLink: '',
    pickupInfo: '',
    deliveryInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  useEffect(() => {
    // Populate form from context
    if (settings) {
      setFormData({
        businessName: settings.businessName || '',
        whatsappNumber: settings.whatsappNumber || '',
        phoneNumber: settings.phoneNumber || '',
        address: settings.address || '',
        businessHours: settings.businessHours || '',
        mapsEmbedLink: settings.mapsEmbedLink || '',
        pickupInfo: settings.pickupInfo || '',
        deliveryInfo: settings.deliveryInfo || '',
      });
      setFetching(false);
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.businessName || !formData.whatsappNumber || !formData.phoneNumber || !formData.address) {
      setToastType('warning');
      setToastMessage('Please complete all required business details.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put('/api/admin/settings', formData);

      if (response.data && response.data.success) {
        setSettings(response.data.data); // Update global settings context
        setToastType('success');
        setToastMessage('Business configuration updated successfully!');
        refreshSettings(); // Refresh settings data from server
      }
    } catch (err) {
      console.error('Settings update error:', err);
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Server error updating business settings.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-sans space-y-3">
        <div className="w-12 h-12 border-4 border-festival-maroon border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-festival-darkLight/70 text-sm font-semibold">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-black text-festival-maroon">
          Dynamic Shop Settings
        </h1>
        <p className="text-xs text-festival-darkLight/60">
          Edit configurations dynamically. All changes reflect instantly in headers, footers, and maps.
        </p>
      </div>

      <div className="bg-white border border-festival-creamDark rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Business Identity & Contact */}
          <div>
            <h3 className="text-sm font-bold text-festival-maroon uppercase tracking-wider mb-4 border-b border-festival-creamDark pb-2">
              1. Shop Identity & Contacts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Business Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="e.g. Sri Vinayaka Murti Kendra"
                  className="form-input"
                />
              </div>

              {/* WhatsApp booking Number */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  WhatsApp Booking Number *
                  <span className="text-[10px] text-festival-darkLight/40 hover:text-festival-maroon transition-colors cursor-help" title="Include country code without + or spaces, e.g., 919876543210 for India.">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  required
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 919876543210"
                  className="form-input"
                />
              </div>

              {/* Direct call number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Direct Call Phone Number *
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  className="form-input"
                />
              </div>

              {/* Working Hours */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Business Timings *
                </label>
                <input
                  type="text"
                  name="businessHours"
                  required
                  value={formData.businessHours}
                  onChange={handleInputChange}
                  placeholder="e.g. 8:00 AM - 10:00 PM"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Locations & Address */}
          <div>
            <h3 className="text-sm font-bold text-festival-maroon uppercase tracking-wider mb-4 border-b border-festival-creamDark pb-2">
              2. Workshop Location
            </h3>
            <div className="space-y-4">
              {/* Detailed Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Workshop Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows="2"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full street name, landmark, zip code, city..."
                  className="form-input"
                ></textarea>
              </div>

              {/* Google Maps Link */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Google Maps Embed Iframe URL
                  <span className="text-[10px] text-festival-darkLight/40 hover:text-festival-maroon transition-colors cursor-help" title="Go to Google Maps -> Share -> Embed Map -> Copy URL from inside the src attribute of the iframe tag.">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </label>
                <input
                  type="text"
                  name="mapsEmbedLink"
                  value={formData.mapsEmbedLink}
                  onChange={handleInputChange}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Customer Instructions */}
          <div>
            <h3 className="text-sm font-bold text-festival-maroon uppercase tracking-wider mb-4 border-b border-festival-creamDark pb-2">
              3. Pickup & Shipping Instructions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Pickup info */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Workshop Pickup Instructions
                </label>
                <textarea
                  name="pickupInfo"
                  rows="3"
                  value={formData.pickupInfo}
                  onChange={handleInputChange}
                  placeholder="e.g. Please bring a soft blanket or sheet to collect..."
                  className="form-input"
                ></textarea>
              </div>

              {/* Delivery info */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Home Delivery Policy Details
                </label>
                <textarea
                  name="deliveryInfo"
                  rows="3"
                  value={formData.deliveryInfo}
                  onChange={handleInputChange}
                  placeholder="e.g. Transport charges calculated based on distance..."
                  className="form-input"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-6 border-t border-festival-creamDark flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-8 py-3.5 bg-festival-maroon hover:bg-festival-maroonDark text-white font-bold rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Updating values...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Configuration
                </>
              )}
            </button>
          </div>
        </form>
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

export default Settings;
