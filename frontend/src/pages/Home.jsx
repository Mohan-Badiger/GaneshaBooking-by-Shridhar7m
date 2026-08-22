import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Leaf, Heart, Calendar, MessageSquare, MapPin, Phone, Award, Clock } from 'lucide-react';
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
      icon: <Leaf className="w-6 h-6 text-festival-maroon" />,
      title: 'Choose Your Idol',
      desc: 'Browse our catalog of handcrafted eco-friendly Ganesha idols. Check heights, descriptions, and pricing.',
    },
    {
      icon: <Calendar className="w-6 h-6 text-festival-maroon" />,
      title: 'Enter Booking Details',
      desc: 'Fill out a simple form specifying your name, address, quantity, and preferred pickup date.',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-festival-maroon" />,
      title: 'Confirm via WhatsApp',
      desc: 'Submit the details to instantly open WhatsApp. Send the prepared message to confirm availability.',
    },
  ];

  return (
    <div className="space-y-20 pb-16 font-sans">
      {/* 1. Hero Section */}
      <section
        className="relative bg-cover bg-center text-white pt-24 pb-28 px-4 overflow-hidden border-b-8 border-festival-gold flex items-center min-h-130"
        style={{ backgroundImage: `linear-gradient(to right, rgba(28, 6, 9, 0.95) 30%, rgba(28, 6, 9, 0.4) 75%, rgba(28, 6, 9, 0.1) 100%), url('/divine_ganesha_hero.webp')` }}
      >
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-block bg-festival-saffron/20 border border-festival-saffron/30 text-festival-saffron text-sm font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
              Eco-Friendly Clay Idols
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-wide leading-tight text-festival-cream">
              Divine Handcrafted Ganesh Idols for Your Home
            </h1>
            <p className="text-base md:text-lg text-festival-cream/80 max-w-xl font-light leading-relaxed">
              Bring home blessings this festival with our 100% biodegradable, beautifully painted clay Ganesha idols. Handcrafted with devotion by local artisans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/idols"
                className="px-8 py-4 bg-festival-saffron hover:bg-amber-600 text-festival-dark font-extrabold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-center text-sm md:text-base border-2 border-festival-gold"
              >
                Explore Ganesh Idols
              </Link>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=Hello,%20I%20am%20interested%20in%20booking%20a%20Ganesh%20idol.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold rounded-2xl border-2 border-white/40 transition-all duration-300 active:scale-95 text-center text-sm md:text-base flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" /> Book via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Ganesh Idols */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-festival-maroon">
            Featured Ganesh Idols
          </h2>
          <p className="text-festival-darkLight/70 text-sm md:text-base">
            Take a look at some of our most popular and beautifully detailed models.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : featuredIdols.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredIdols.map((idol) => (
              <IdolCard key={idol._id} idol={idol} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-festival-darkLight/60">
            No featured idols currently available. Visit the full catalog below.
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            to="/idols"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-festival-maroon text-festival-maroon hover:bg-festival-maroon hover:text-white font-bold rounded-xl transition-all duration-300"
          >
            View All Ganesh Idols
          </Link>
        </div>
      </section>

      {/* 3. Why Choose Our Idols */}
      <section id="about" className="bg-festival-creamDark py-16 border-y border-festival-creamDark shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-serif font-medium text-festival-maroon">
              Why Choose Our Idols?
            </h2>
            <p className="text-festival-darkLight/70 text-sm md:text-base">
              Crafting traditional idols with respect to scriptures and our environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-festival-creamDark text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-festival-maroon">100% Eco-Friendly</h3>
              <p className="text-sm text-festival-darkLight/70 leading-relaxed">
                Made strictly with pure organic clay (Shadu Mati) and paper pulp. Dissolves within hours during Visarjan inside a bucket at home, returning to Mother Earth safely.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-festival-creamDark text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-festival-maroon">Handcrafted Devotion</h3>
              <p className="text-sm text-festival-darkLight/70 leading-relaxed">
                Sculpted by local hereditary clay sculptors. Every curve, posture, and facial expression is detailed by hand using traditional instruments.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-festival-creamDark text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-festival-maroon">Natural Organic Colors</h3>
              <p className="text-sm text-festival-darkLight/70 leading-relaxed">
                No chemical varnishes, lead, or toxic industrial paints. Painted with skin-safe natural watercolors and food-grade mineral colors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Simple Booking Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-serif font-medium text-festival-maroon">
            Simple 3-Step Booking
          </h2>
          <p className="text-festival-darkLight/70 text-sm md:text-base">
            No payments, no wallets, no registration. Book in under two minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Decorative connector line on desktop */}
          <div className="hidden md:block absolute top-1/3 left-[15%] right-[15%] h-0.5 border-t border-dashed border-festival-gold/60 -z-10"></div>

          {steps.map((st, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-festival-cream border-2 border-festival-gold text-festival-maroon flex items-center justify-center font-bold text-lg shadow-sm">
                {index + 1}
              </div>
              <h3 className="text-lg font-serif font-bold text-festival-maroon">{st.title}</h3>
              <p className="text-xs text-festival-darkLight/70 leading-relaxed max-w-xs">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Trust / Local Business Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-festival-cream to-festival-creamDark border border-festival-gold/30 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <span className="text-xs font-extrabold text-festival-maroon uppercase tracking-wider bg-festival-gold/20 px-3 py-1 rounded">
              Support Local Artisans
            </span>
            <h2 className="text-3xl font-serif font-medium text-festival-maroon">
              {settings.businessName}
            </h2>
            <p className="text-sm md:text-base text-festival-darkLight leading-relaxed">
              We have been sculpting Ganesha idols for families in our locality for years. We prioritize quality clay work over cheap mass manufacture, making sure your festival is beautiful and auspicious.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-festival-maroon bg-white border border-festival-creamDark px-4 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Quality Assured</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-festival-maroon bg-white border border-festival-creamDark px-4 py-2 rounded-xl">
                <Leaf className="w-4 h-4 text-emerald-500" />
                <span>100% Mud Clays</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-80 aspect-4/3 rounded-2xl overflow-hidden border border-festival-creamDark shadow-md">
            <img
              src="/artisan_clay_ganesha.webp"
              alt="Artisan sculpting Ganesha"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. Contact / Location Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-serif font-medium text-festival-maroon">
            Visit Our Workshop
          </h2>
          <p className="text-festival-darkLight/70 text-sm md:text-base">
            Drop by to look at the idols in person. Feel free to contact us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Map */}
          {settings.mapsEmbedLink ? (
            <div className="w-full h-96 rounded-3xl overflow-hidden border border-festival-creamDark shadow-md">
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
            <div className="w-full h-96 rounded-3xl bg-festival-creamDark flex items-center justify-center border border-dashed border-festival-gold/50">
              <span className="text-festival-darkLight/60 text-sm">Google Maps embed not configured</span>
            </div>
          )}

          {/* Details Card */}
          <div className="bg-white border border-festival-creamDark rounded-3xl p-8 shadow-sm space-y-6">
            <h3 className="text-2xl font-serif font-medium text-festival-maroon pb-4 border-b border-festival-creamDark">
              Contact Information
            </h3>

            <div className="space-y-5">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-festival-saffron mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-festival-maroon">Workshop Location</h4>
                  <p className="text-sm text-festival-darkLight/80 leading-relaxed mt-1">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-festival-saffron mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-festival-maroon">Call/Phone</h4>
                  <p className="text-sm text-festival-darkLight/80 mt-1">
                    {settings.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-festival-saffron mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-festival-maroon">Business Timings</h4>
                  <p className="text-sm text-festival-darkLight/80 mt-1">
                    Daily: {settings.businessHours}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-festival-creamDark flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${settings.phoneNumber}`}
                className="flex-1 text-center py-3 bg-festival-cream text-festival-maroon border border-festival-maroon/20 hover:bg-festival-creamDark font-bold rounded-xl text-sm transition-all"
              >
                Call Us Now
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
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
