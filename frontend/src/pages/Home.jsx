import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Leaf, Heart, Calendar, MessageSquare, MapPin, Phone, Award, Clock, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import IdolCard from '../components/IdolCard';
import { CardSkeleton } from '../components/LoadingSkeleton';

const Home = () => {
  const { settings } = useSettings();
  const [featuredIdols, setFeaturedIdols] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get('/api/idols?featured=true&limit=4');
        if (response.data && response.data.success) {
          setFeaturedIdols(response.data.data);
        }
      } catch (error) {
        console.error('Error loading featured Ganeshas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const steps = [
    {
      icon: <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-festival-maroon" />,
      title: 'Choose Your Idol',
      desc: 'Browse our catalog of handcrafted eco-friendly Ganesha idols. Check heights, descriptions, and pricing.',
    },
    {
      icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-festival-maroon" />,
      title: 'Enter Booking Details',
      desc: 'Fill out a simple form specifying your name, address, quantity, and preferred pickup date.',
    },
    {
      icon: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-festival-maroon" />,
      title: 'Confirm via WhatsApp',
      desc: 'Submit the details to instantly open WhatsApp. Send the prepared message to confirm availability.',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 pb-16 font-sans">
      {/* 1. Hero Section - 100% Natural Photographic Immersion */}
      <section className="relative text-white min-h-145 sm:min-h-160 lg:min-h-170 flex items-center overflow-hidden bg-[#130306]">
        {/* Full-bleed Natural Photograph as Background */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-position-[82%_center] sm:bg-position-[80%_center] lg:bg-position-[right_center]"
          style={{ backgroundImage: `url('/divine_ganesha_hero.webp')` }}
        />

        {/* Mobile & Tablet Gradient Overlay: Smooth vertical blend so text is crisp on top and Ganesha radiates below */}
        <div
          className="absolute inset-0 lg:hidden pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(19, 3, 6, 0.95) 0%, rgba(19, 3, 6, 0.82) 45%, rgba(19, 3, 6, 0.35) 72%, rgba(19, 3, 6, 0.9) 100%)',
          }}
        />

        {/* Desktop Gradient Overlay: Smooth horizontal blend matching the natural dark bokeh on the left */}
        <div
          className="absolute inset-0 hidden lg:block pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(19, 3, 6, 0.97) 0%, rgba(19, 3, 6, 0.88) 42%, rgba(19, 3, 6, 0.3) 72%, transparent 100%)',
          }}
        />

        {/* Foreground Content */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
          <div className="max-w-2xl text-center lg:text-left space-y-5 sm:space-y-6">
            
            {/* Devotional Kicker Badge */}
            <div className="inline-flex items-center gap-2 bg-festival-gold/15 border border-festival-gold/35 text-festival-goldLight text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full shadow-inner backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-festival-saffron animate-pulse" />
              <span>Eco-Friendly Shadu Clay</span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-festival-cream leading-[1.15] sm:leading-[1.12]">
                Divine Handcrafted <br className="hidden sm:inline" />
                <span className="bg-linear-to-r from-festival-goldLight via-festival-saffron to-amber-400 bg-clip-text text-transparent font-normal">
                  Ganesh Idols
                </span>{' '}
                for Your Home
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-festival-cream/85 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed pt-1 sm:pt-2">
                Welcome Lord Ganesha with 100% natural, biodegradable clay statues hand-sculpted by hereditary artisans. Dissolves safely at home with zero harmful chemicals.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                to="/idols"
                className="px-8 py-4 bg-linear-to-r from-festival-goldLight via-festival-gold to-amber-500 hover:from-amber-400 hover:to-amber-600 text-festival-maroonDark font-black rounded-full shadow-[0_10px_25px_-5px_rgba(197,160,40,0.35)] hover:shadow-[0_15px_35px_-5px_rgba(197,160,40,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 text-center text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-festival-maroonDark" />
                <span>Explore Ganesh Idols</span>
              </Link>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=Hello,%20I%20am%20interested%20in%20booking%20a%20Ganesh%20idol.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 bg-black/40 hover:bg-black/60 text-festival-cream hover:text-white font-bold rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 active:scale-95 text-center text-sm sm:text-base flex items-center justify-center gap-2.5 backdrop-blur-md shadow-xs"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span>Book via WhatsApp</span>
              </a>
            </div>

            {/* Trust Minimalist Metric Strip */}
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-festival-cream/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-festival-gold" />
                <span>100% Pure Shadu Clay</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Dissolves at Home</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-festival-gold" />
                <span>Direct Artisan Pricing</span>
              </div>
            </div>

          </div>
        </div>

        {/* Elegant Bottom Gold Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-festival-gold/60 to-transparent pointer-events-none"></div>
      </section>

      {/* 2. Featured Ganesh Idols */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-festival-maroon">
            Featured Ganesh Idols
          </h2>
          <p className="text-festival-darkLight/70 text-xs sm:text-sm md:text-base">
            Take a look at some of our most popular and beautifully detailed models.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : featuredIdols.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {featuredIdols.map((idol) => (
              <IdolCard key={idol._id} idol={idol} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 sm:py-12 text-festival-darkLight/60 text-sm">
            No featured idols currently available. Visit the full catalog below.
          </div>
        )}

        <div className="text-center pt-2 sm:pt-4">
          <Link
            to="/idols"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-festival-maroon text-festival-maroon hover:bg-festival-maroon hover:text-white font-bold rounded-xl transition-all duration-300 text-sm"
          >
            View All Ganesh Idols
          </Link>
        </div>
      </section>

      {/* 3. Why Choose Our Idols */}
      <section id="about" className="bg-festival-creamDark py-12 sm:py-16 border-y border-festival-creamDark shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-festival-maroon">
              Why Choose Our Idols?
            </h2>
            <p className="text-festival-darkLight/70 text-xs sm:text-sm md:text-base">
              Crafting traditional idols with respect to scriptures and our environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xs border border-festival-creamDark text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-festival-maroon">100% Eco-Friendly</h3>
              <p className="text-xs sm:text-sm text-festival-darkLight/70 leading-relaxed">
                Made strictly with pure organic clay (Shadu Mati) and paper pulp. Dissolves within hours during Visarjan inside a bucket at home, returning to Mother Earth safely.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xs border border-festival-creamDark text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-festival-maroon">Handcrafted Devotion</h3>
              <p className="text-xs sm:text-sm text-festival-darkLight/70 leading-relaxed">
                Sculpted by hereditary clay sculptors. Every curve, posture, and facial expression is detailed by hand using traditional wooden instruments.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xs border border-festival-creamDark text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-festival-maroon">Natural Organic Colors</h3>
              <p className="text-xs sm:text-sm text-festival-darkLight/70 leading-relaxed">
                No chemical varnishes, lead, or toxic industrial paints. Painted with skin-safe natural watercolors and food-grade mineral colors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Simple Booking Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-festival-maroon">
            Simple 3-Step Booking
          </h2>
          <p className="text-festival-darkLight/70 text-xs sm:text-sm md:text-base">
            No advance payments, no wallets, no registration. Book in under two minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Decorative connector line on desktop */}
          <div className="hidden md:block absolute top-1/3 left-[15%] right-[15%] h-0.5 border-t border-dashed border-festival-gold/60 -z-10"></div>

          {steps.map((st, index) => (
            <div key={index} className="bg-white sm:bg-transparent p-5 sm:p-0 rounded-2xl border sm:border-0 border-festival-creamDark flex flex-col items-center text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-festival-cream border-2 border-festival-gold text-festival-maroon flex items-center justify-center font-bold text-base sm:text-lg shadow-xs shrink-0">
                {index + 1}
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-festival-maroon">{st.title}</h3>
              <p className="text-xs sm:text-sm text-festival-darkLight/70 leading-relaxed max-w-xs">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Trust / Local Business Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-festival-cream to-festival-creamDark border border-festival-gold/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8 shadow-xs">
          <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left">
            <span className="text-[10px] sm:text-xs font-extrabold text-festival-maroon uppercase tracking-wider bg-festival-gold/20 px-3 py-1 rounded">
              Support Local Artisans
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-festival-maroon">
              {settings.businessName}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-festival-darkLight leading-relaxed">
              We have been sculpting Ganesha idols for families in our locality for years. We prioritize quality clay work over cheap mass manufacture, making sure your festival is beautiful and auspicious.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 pt-1">
              <div className="flex items-center space-x-2 text-xs font-semibold text-festival-maroon bg-white border border-festival-creamDark px-3.5 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Quality Assured</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-festival-maroon bg-white border border-festival-creamDark px-3.5 py-2 rounded-xl">
                <Leaf className="w-4 h-4 text-emerald-500" />
                <span>100% Mud Clays</span>
              </div>
            </div>
          </div>
          <div className="w-full max-w-xs sm:max-w-sm md:w-80 aspect-4/3 rounded-2xl overflow-hidden border border-festival-creamDark shadow-md shrink-0">
            <img
              src="/artisan_clay_ganesha.webp"
              alt="Artisan sculpting Ganesha"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 6. Contact / Location Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-festival-maroon">
            Visit Our Workshop
          </h2>
          <p className="text-festival-darkLight/70 text-xs sm:text-sm md:text-base">
            Drop by to look at the idols in person. Feel free to contact us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Map */}
          {settings.mapsEmbedLink ? (
            <div className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden border border-festival-creamDark shadow-md">
              <iframe
                title="Business Maps Location"
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
            <div className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl sm:rounded-3xl bg-festival-creamDark flex items-center justify-center border border-dashed border-festival-gold/50">
              <span className="text-festival-darkLight/60 text-xs sm:text-sm">Google Maps embed not configured</span>
            </div>
          )}

          {/* Details Card */}
          <div className="bg-white border border-festival-creamDark rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-festival-maroon pb-3 border-b border-festival-creamDark">
              Contact Information
            </h3>

            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-festival-saffron mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-festival-maroon">Workshop Location</h4>
                  <p className="text-xs sm:text-sm text-festival-darkLight/80 leading-relaxed mt-0.5 sm:mt-1">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-festival-saffron mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-festival-maroon">Call/Phone</h4>
                  <p className="text-xs sm:text-sm text-festival-darkLight/80 mt-0.5 sm:mt-1">
                    {settings.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-festival-saffron mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-festival-maroon">Business Timings</h4>
                  <p className="text-xs sm:text-sm text-festival-darkLight/80 mt-0.5 sm:mt-1">
                    Daily: {settings.businessHours}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-festival-creamDark flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${settings.phoneNumber}`}
                className="flex-1 text-center py-3 bg-festival-cream text-festival-maroon border border-festival-maroon/20 hover:bg-festival-creamDark font-bold rounded-xl text-xs sm:text-sm transition-all"
              >
                Call Us Now
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" /> Message WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
