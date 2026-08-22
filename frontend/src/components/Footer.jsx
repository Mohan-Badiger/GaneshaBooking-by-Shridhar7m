import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer id="contact" className="bg-[#1C1816] text-[#DED7D2] border-t-4 border-festival-gold font-sans pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Business Branding & Hours */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-black tracking-wide text-festival-gold flex items-center">
              <span className="mr-2">🕉️</span>
              {settings.businessName}
            </h3>
            <p className="text-sm leading-relaxed text-[#B8AFAB]">
              Preserving tradition with premium handcrafted eco-friendly Ganesha idols. Sculpted by local artisans with organic materials, safe for nature and celebrations.
            </p>
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="w-5 h-5 text-festival-saffron flex-shrink-0" />
                <span>
                  <strong className="text-white">Hours:</strong> {settings.businessHours} (All days)
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-5 h-5 text-festival-saffron flex-shrink-0" />
                <span>
                  <strong className="text-white">Call:</strong> {settings.phoneNumber}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MessageSquare className="w-5 h-5 text-festival-saffron flex-shrink-0" />
                <span>
                  <strong className="text-white">WhatsApp:</strong> {settings.whatsappNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Address & Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-serif font-bold text-white border-b border-[#302A27] pb-3">Workshop Address</h4>
            <div className="flex items-start space-x-3 text-sm">
              <MapPin className="w-5 h-5 text-festival-saffron flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {settings.address}
              </p>
            </div>
            <div className="pt-2">
              <h4 className="text-xs font-semibold tracking-wider text-festival-gold uppercase mb-3">Quick Navigation</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Link to="/" className="hover:text-festival-saffron transition-colors">Home</Link>
                <Link to="/idols" className="hover:text-festival-saffron transition-colors">Browse Catalog</Link>
                <a href="#about" className="hover:text-festival-saffron transition-colors">About Us</a>
                <Link to="/admin" className="hover:text-festival-saffron transition-colors">Admin Area</Link>
              </div>
            </div>
          </div>

          {/* Column 3: Google Maps Embed */}
          <div className="space-y-6">
            <h4 className="text-lg font-serif font-bold text-white border-b border-[#302A27] pb-3">Find Us</h4>
            {settings.mapsEmbedLink ? (
              <div className="w-full h-48 rounded-xl overflow-hidden border border-[#302A27] shadow-lg">
                <iframe
                  title="Google Maps Location"
                  src={settings.mapsEmbedLink}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            ) : (
              <div className="w-full h-48 rounded-xl bg-[#282220] flex items-center justify-center text-sm text-[#8E837D] border border-dashed border-[#443B37]">
                <span>Map location not configured</span>
              </div>
            )}
          </div>
        </div>

        <hr className="border-[#302A27] mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-[#8E837D] space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} {settings.businessName}. All Rights Reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Handcrafted with devotion in India 🇮🇳</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
