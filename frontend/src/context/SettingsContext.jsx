import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

// Setup default axios API base URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    businessName: 'Sri Vinayaka Murti Kala Kendra',
    whatsappNumber: '919876543210',
    phoneNumber: '9876543210',
    address: '123 Ganesha Lane, Craft Town, Banahatti 587311, Karnataka',
    businessHours: '8:00 AM - 10:00 PM',
    mapsEmbedLink: '',
    pickupInfo: 'Pickups are scheduled daily from our main workshop. Please bring a soft, cushioned sheet or cardboard box to transport your Ganesha safely.',
    deliveryInfo: 'Local home delivery available within a 15km radius. A standard shipping fee will be charged based on the distance at pickup.',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/settings');
      if (response.data && response.data.success) {
        setSettings(response.data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Could not load shop settings from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        loading,
        error,
        refreshSettings: fetchSettings,
        apiUrl: API_URL,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
export default SettingsContext;
