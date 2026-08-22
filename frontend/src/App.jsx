import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, Link, Outlet } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Customer Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Customer Pages
import Home from './pages/Home';
import Idols from './pages/Idols';
import IdolDetails from './pages/IdolDetails';
import Booking from './pages/Booking';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import IdolManagement from './pages/admin/IdolManagement';
import IdolForm from './pages/admin/IdolForm';
import Settings from './pages/admin/Settings';

// Icons
import { LayoutDashboard, ShoppingBag, Plus, Settings as SettingsIcon, LogOut, ArrowLeft, Menu, X } from 'lucide-react';

// Wrapper for Customer Pages (With Navbar and Footer)
const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-festival-cream">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

// Route Guard for Admin Pages
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-festival-cream">
        <div className="w-10 h-10 border-4 border-festival-maroon border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Layout for Admin Dashboard (Sidebar on desktop, drawer on mobile)
const AdminLayout = () => {
  const { logout, admin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const sidebarLinks = [
    { to: '/admin', end: true, icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/admin/idols', end: true, icon: <ShoppingBag className="w-5 h-5" />, label: 'Idols Catalog' },
    { to: '/admin/idols/new', icon: <Plus className="w-5 h-5" />, label: 'Add Ganesh Idol' },
    { to: '/admin/settings', icon: <SettingsIcon className="w-5 h-5" />, label: 'Shop Settings' },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-festival-maroon text-white shadow-md'
        : 'text-festival-darkLight/70 hover:bg-festival-creamDark hover:text-festival-maroon'
    }`;

  return (
    <div className="min-h-screen bg-festival-cream flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <header className="md:hidden h-16 bg-white border-b border-festival-creamDark px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-festival-darkLight hover:bg-festival-cream transition-all"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-serif font-black text-festival-maroon text-lg">Catalog Control</span>
        <button
          onClick={logout}
          className="p-2 text-festival-darkLight hover:text-red-600 rounded-xl transition-all"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`w-64 bg-white border-r border-festival-creamDark flex flex-col fixed md:sticky top-0 h-[calc(100vh-4rem)] md:h-screen z-20 transition-all duration-300 ${
          sidebarOpen ? 'left-0' : '-left-64 md:left-0'
        }`}
      >
        {/* Brand header */}
        <div className="h-20 border-b border-festival-creamDark px-6 hidden md:flex items-center justify-between">
          <span className="font-serif font-black text-xl text-festival-maroon flex items-center">
            Control Center
          </span>
        </div>

        {/* User profile brief */}
        <div className="p-6 border-b border-festival-creamDark bg-festival-cream/20">
          <p className="text-xs text-festival-darkLight/40 font-bold uppercase tracking-wider">Signed in as</p>
          <h4 className="font-bold text-sm text-festival-maroon truncate mt-0.5">{admin?.name || 'Administrator'}</h4>
          <p className="text-[10px] text-festival-darkLight/60 truncate">{admin?.email}</p>
        </div>

        {/* Links */}
        <nav className="grow p-4 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={linkClass}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer buttons */}
        <div className="p-4 border-t border-festival-creamDark space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-festival-cream text-festival-maroon font-bold rounded-xl text-xs hover:bg-festival-creamDark transition-all border border-festival-maroon/10"
          >
            <ArrowLeft className="w-4.5 h-4.5" /> Back to Storefront
          </Link>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-red-700 bg-red-50 hover:bg-red-100 font-bold rounded-xl text-xs transition-all"
          >
            <LogOut className="w-4.5 h-4.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Sidebar mobile overlay background */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
        ></div>
      )}

      {/* Main Panel Content Area */}
      <main className="grow p-4 md:p-8 overflow-y-auto max-w-full">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            {/* Customer Facing Web Routes */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path="idols" element={<Idols />} />
              <Route path="idols/:id" element={<IdolDetails />} />
              <Route path="book/:id" element={<Booking />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Console Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="idols" element={<IdolManagement />} />
              <Route path="idols/new" element={<IdolForm />} />
              <Route path="idols/edit/:id" element={<IdolForm />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
