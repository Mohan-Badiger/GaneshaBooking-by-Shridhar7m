import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Settings as SettingsIcon, ShoppingBag } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { settings } = useSettings();
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const linkClass = ({ isActive }) =>
    `font-medium text-sm transition-colors duration-200 py-2 border-b-2 ${isActive
      ? 'border-festival-maroon text-festival-maroon'
      : 'border-transparent text-festival-darkLight hover:text-festival-maroon'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-xl font-medium transition-all ${isActive
      ? 'bg-festival-maroon text-white'
      : 'text-festival-darkLight hover:bg-festival-creamDark hover:text-festival-maroon'
    }`;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-festival-creamDark shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo / Brand */}
            <div className="shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                <span className="text-2xl font-serif font-medium tracking-wide text-festival-maroon flex items-center">
                  {settings.businessName.split(' ')[0]} <span className="text-festival-saffron ml-1.5 font-sans font-normal text-lg hidden sm:inline">Idols</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" end className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/idols" className={linkClass}>
                Ganesh Idols
              </NavLink>
              <a
                href="#about"
                onClick={() => {
                  const el = document.getElementById('about');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-medium text-sm text-festival-darkLight hover:text-festival-maroon transition-colors py-2"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-medium text-sm text-festival-darkLight hover:text-festival-maroon transition-colors py-2"
              >
                Contact
              </a>

              {/* Admin Links */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 border-l border-festival-creamDark pl-6">
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-xs bg-festival-cream text-festival-maroon border border-festival-maroon/20 px-3 py-1.5 rounded-lg hover:bg-festival-creamDark transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-1.5 text-festival-darkLight hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin"
                  className="text-xs text-festival-darkLight/60 hover:text-festival-maroon transition-colors border-l border-festival-creamDark pl-6"
                >
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2.5 rounded-xl text-festival-darkLight hover:bg-festival-cream hover:text-festival-maroon transition-all focus:outline-none focus:ring-2 focus:ring-festival-gold/40 cursor-pointer"
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden border-t border-festival-creamDark bg-white shadow-xl animate-fade-in absolute top-16 sm:top-20 left-0 w-full z-50">
            <div className="px-4 pt-3 pb-6 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <NavLink to="/" end className={mobileLinkClass} onClick={closeMenu}>
                Home
              </NavLink>
              <NavLink to="/idols" className={mobileLinkClass} onClick={closeMenu}>
                Ganesh Idols
              </NavLink>
              <a
                href="#about"
                onClick={() => {
                  closeMenu();
                  setTimeout(() => {
                    const el = document.getElementById('about');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="block px-4 py-3 rounded-xl font-medium text-festival-darkLight hover:bg-festival-creamDark hover:text-festival-maroon transition-all"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={() => {
                  closeMenu();
                  setTimeout(() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="block px-4 py-3 rounded-xl font-medium text-festival-darkLight hover:bg-festival-creamDark hover:text-festival-maroon transition-all"
              >
                Contact & Location
              </a>

              {/* Mobile Quick Action Buttons */}
              <div className="pt-2 pb-1 grid grid-cols-2 gap-2 border-t border-festival-creamDark/60">
                <a
                  href={`tel:${settings.phoneNumber}`}
                  className="flex items-center justify-center py-2.5 px-3 bg-festival-cream text-festival-maroon border border-festival-maroon/20 rounded-xl text-xs font-bold"
                  onClick={closeMenu}
                >
                  Call Us
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-2.5 px-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs"
                  onClick={closeMenu}
                >
                  WhatsApp
                </a>
              </div>

              {isAuthenticated ? (
                <div className="border-t border-festival-creamDark pt-3 mt-3 space-y-2">
                  <Link
                    to="/admin"
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-festival-cream text-festival-maroon rounded-xl font-medium hover:bg-festival-creamDark transition-all"
                    onClick={closeMenu}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-red-700 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-festival-creamDark pt-3 mt-2">
                  <Link
                    to="/admin"
                    className="block text-center px-4 py-2 text-xs text-festival-darkLight/50 hover:text-festival-maroon"
                    onClick={closeMenu}
                  >
                    Admin Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop overlay when mobile menu is open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 sm:top-20 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
