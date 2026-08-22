import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ShoppingBag, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { DetailSkeleton } from '../components/LoadingSkeleton';
import { getFullImageUrl } from '../utils/urlHelper';

const Booking = () => {
  const { id } = useParams();
  const { settings } = useSettings();

  const [idol, setIdol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    quantity: 1,
    message: '',
    pickupDate: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  useEffect(() => {
    const fetchIdol = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/idols/${id}`);
        if (response.data && response.data.success) {
          const fetchedIdol = response.data.data;
          setIdol(fetchedIdol);
          if (!fetchedIdol.availability) {
            setError('This Ganesha idol is currently sold out and cannot be booked.');
          }
        }
      } catch (err) {
        console.error('Failed to load idol info:', err);
        setError('Could not load booking details for this Ganesha.');
      } finally {
        setLoading(false);
      }
    };
    fetchIdol();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    const indianPhoneRegex = /^[6-9]\d{9}$/;

    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!indianPhoneRegex.test(formData.mobile.trim())) {
      errors.mobile = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData.pickupDate) errors.pickupDate = 'Preferred pickup date is required';

    if (formData.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear validation error on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleQuantityChange = (val) => {
    const qty = Math.max(1, parseInt(val) || 1);
    setFormData((prev) => ({ ...prev, quantity: qty }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Compile WhatsApp Booking message
    // Fetch price dynamically from loaded state (which came from database)
    const unitPrice = idol.price;
    const totalAmount = unitPrice * formData.quantity;

    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(unitPrice);

    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(totalAmount);

    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = new Date(formData.pickupDate).toLocaleDateString('en-IN', dateOptions);

    const messageTemplate = `Hello, I would like to book a Ganesh idol.

*Idol Details*
Model Code: #${idol.code}
Name: ${idol.name}
Height: ${idol.height} Feet
Price: ${formattedPrice}
Quantity: ${formData.quantity}
Total: ${formattedTotal}

*Customer Details*
Name: ${formData.name.trim()}
Mobile: ${formData.mobile.trim()}
Delivery Type: Store Pickup Only

*Preferred Store Pickup Date*
${formattedDate}

${formData.message.trim() ? `*Additional Notes*\n${formData.message.trim()}\n` : ''}
Please confirm my booking.`;

    const cleanWhatsappNum = settings.whatsappNumber.replace(/\D/g, '');
    const encodedText = encodeURIComponent(messageTemplate);
    const finalUrl = `https://wa.me/${cleanWhatsappNum}?text=${encodedText}`;

    setWhatsappUrl(finalUrl);
    setIsSubmitted(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !idol) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-black text-festival-maroon">Booking Unavailable</h2>
        <p className="text-festival-darkLight/70">{error || 'Unable to book Ganesha.'}</p>
        <Link to="/idols" className="inline-flex items-center text-sm font-bold text-festival-maroon hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" /> Browse Available Idols
        </Link>
      </div>
    );
  }

  const itemTotal = idol.price * formData.quantity;

  const formattedUnitPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(idol.price);

  const formattedTotalAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(itemTotal);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      {/* Back button */}
      <div>
        <Link
          to={`/idols/${idol._id}`}
          className="inline-flex items-center text-sm font-bold text-festival-maroon/70 hover:text-festival-maroon transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to details
        </Link>
      </div>

      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Summary panel */}
          <div className="lg:col-span-5 bg-white border border-festival-creamDark rounded-3xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-serif font-medium text-festival-maroon border-b border-festival-creamDark pb-3">
              Booking Summary
            </h2>
            <div className="flex gap-4">
              <div className="w-20 aspect-square rounded-2xl overflow-hidden bg-festival-cream border border-festival-creamDark shrink-0">
                <img
                  src={
                    idol.images && idol.images.length > 0
                      ? getFullImageUrl(idol.images[0])
                      : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200'
                  }
                  alt={idol.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-festival-maroon text-sm line-clamp-1">{idol.name}</h3>
                <p className="text-xs text-festival-darkLight/60">Height: {idol.height} Feet</p>
                <p className="text-xs font-bold text-festival-maroon">{formattedUnitPrice} each</p>
              </div>
            </div>

            <hr className="border-festival-creamDark" />

            <div className="space-y-2 text-sm text-festival-darkLight/80">
              <div className="flex justify-between">
                <span>Quantity</span>
                <span className="font-bold">x {formData.quantity}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-festival-maroon pt-2 border-t border-dashed border-festival-creamDark">
                <span>Estimated Total</span>
                <span>{formattedTotalAmount}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start space-x-2 text-xs text-amber-800 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-festival-saffron mt-0.5 shrink-0" />
              <p>
                <strong>No online payments:</strong> This form only registers your booking and prepares a WhatsApp request. Final payment is processed at workshop pickup.
              </p>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-7 bg-white border border-festival-creamDark rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-medium text-festival-maroon border-b border-festival-creamDark pb-4">
              Enter Your Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Customer Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 bg-festival-cream/30 border ${
                    formErrors.name ? 'border-red-400 focus:ring-red-100' : 'border-festival-creamDark focus:ring-festival-maroon/20'
                  } rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all`}
                />
                {formErrors.name && <p className="text-xs font-medium text-red-600">{formErrors.name}</p>}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Mobile Number (WhatsApp preferred) *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full px-4 py-3 bg-festival-cream/30 border ${
                    formErrors.mobile ? 'border-red-400 focus:ring-red-100' : 'border-festival-creamDark focus:ring-festival-maroon/20'
                  } rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all`}
                />
                {formErrors.mobile && <p className="text-xs font-medium text-red-600">{formErrors.mobile}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quantity input */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                    Quantity *
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(formData.quantity - 1)}
                      className="w-10 h-10 border border-festival-creamDark bg-festival-cream rounded-xl font-bold flex items-center justify-center hover:bg-festival-creamDark focus:outline-none"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-16 text-center py-2 bg-festival-cream/30 border border-festival-creamDark rounded-xl text-sm font-bold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(formData.quantity + 1)}
                      className="w-10 h-10 border border-festival-creamDark bg-festival-cream rounded-xl font-bold flex items-center justify-center hover:bg-festival-creamDark focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Pickup Date */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 bg-festival-cream/30 border ${
                      formErrors.pickupDate ? 'border-red-400 focus:ring-red-100' : 'border-festival-creamDark focus:ring-festival-maroon/20'
                    } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all`}
                  />
                  {formErrors.pickupDate && <p className="text-xs font-medium text-red-600">{formErrors.pickupDate}</p>}
                </div>
              </div>

              {/* Optional Message */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-festival-maroon uppercase tracking-wider">
                  Optional Instructions
                </label>
                <textarea
                  name="message"
                  rows="2"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Any special colors request or instructions..."
                  className="form-input"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-festival-maroon hover:bg-festival-maroonDark text-white font-bold rounded-2xl text-base transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-[0.99] mt-6"
              >
                <ShoppingBag className="w-5 h-5" /> Book Ganesha via WhatsApp
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Success Screen / Instruction page */
        <div className="max-w-xl mx-auto bg-white border border-festival-creamDark rounded-3xl p-8 text-center space-y-6 shadow-md my-10">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-medium text-festival-maroon">Booking Request Prepared!</h2>
            <p className="text-sm text-festival-darkLight/70">
              Your details are ready to be sent. We use WhatsApp to finalize and confirm your Ganesha idol booking.
            </p>
          </div>

          {/* Form details overview */}
          <div className="bg-festival-cream/50 border border-festival-creamDark rounded-2xl p-5 text-left space-y-3 text-sm">
            <div className="flex justify-between border-b border-festival-creamDark/60 pb-2">
              <span className="text-festival-darkLight/60 font-medium">Ganesha Idol</span>
              <span className="font-bold text-festival-maroon">{idol.name} ({idol.height} ft)</span>
            </div>
            <div className="flex justify-between border-b border-festival-creamDark/60 pb-2">
              <span className="text-festival-darkLight/60 font-medium">Quantity / Total</span>
              <span className="font-bold">{formData.quantity} / {formattedTotalAmount}</span>
            </div>
            <div className="flex justify-between border-b border-festival-creamDark/60 pb-2">
              <span className="text-festival-darkLight/60 font-medium">Customer Name</span>
              <span className="font-bold">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-festival-darkLight/60 font-medium">Date Selected</span>
              <span className="font-bold">
                {new Date(formData.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800 leading-relaxed text-left flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-festival-saffron mt-0.5 shrink-0" />
            <p>
              <strong>Important Step:</strong> Clicking the button below opens WhatsApp with a pre-filled message. You <strong>MUST send the message</strong> inside WhatsApp. Your booking is NOT confirmed until we receive the message and reply with confirmation.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-base transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageSquare className="w-5 h-5" /> Open WhatsApp & Send Request
            </a>
            <Link
              to="/idols"
              className="block w-full text-center py-3 bg-festival-cream hover:bg-festival-creamDark text-festival-maroon border border-festival-maroon/20 font-bold rounded-xl text-sm transition-all"
            >
              Back to Ganesha Catalog
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
