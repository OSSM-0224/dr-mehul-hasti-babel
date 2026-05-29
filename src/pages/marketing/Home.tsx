/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState, addLocalAppointment, setPath, showToast } from '../../store';
import { 
  Sparkles, Calendar, ArrowRight, ShieldCheck, CheckCircle2, 
  Smile, Activity, Stethoscope, ChevronDown, ChevronUp, Clock, Phone, Mail, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Appointment } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface AppointmentFormInputs {
  fullName: string;
  mobileNumber: string;
  treatment: string;
  message: string;
}

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // React Hook Form for seamless input validation
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AppointmentFormInputs>();

  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(0);
  const [galleryIdx, setGalleryIdx] = useState<number>(0);

  // Gallery items matching luxury clinical interior aesthetics from the image
  const galleryImages = [
    {
      title: 'Clinical Operatory Room',
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&auto=format&fit=crop&q=80',
      desc: 'Next-Gen premium dental setup with digital imagery scans and hospital-grade ergonomic chairs.'
    },
    {
      title: 'Consult Lounge Room',
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&auto=format&fit=crop&q=80',
      desc: 'Modern consultancy lounges with high-floor window views overlooking Lower Parel, Mumbai.'
    },
    {
      title: 'Serene Reception Foyer',
      url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1000&auto=format&fit=crop&q=80',
      desc: 'Plush velvet couches, ambient low-temperature wall sconces and welcoming climate-control.'
    }
  ];

  const faqItems = [
    {
      question: 'Is the treatment really painless?',
      answer: 'Yes, we utilize advanced computerized anesthesia systems and minimally invasive micro-dentistry techniques. Our focus is on absolute patient comfort, ensuring a relaxed experience for every procedure.'
    },
    {
      question: "What is 'Full Digital Dentistry'?",
      answer: 'It represents the removal of traditional uncomfortable paste impressions. We use high-precision intraoral 3D scanners, CAD/CAM computer rendering screens, and direct digital planning to print customized crowns and veneers with sub-millimeter precision on the same day.'
    },
    {
      question: 'How long does Smile Designing take?',
      answer: 'Typically, diagnostic digital scanning and mockups are completed in your single primary visit. The permanent placement of custom veneers or ceramic alignment overlays requires only 1 to 2 visits in our boutique environment.'
    }
  ];

  const onSubmit = (data: AppointmentFormInputs) => {
    // Construct a persistent appointment object
    const newApt: Appointment = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      patientName: data.fullName,
      mobileNumber: data.mobileNumber,
      treatment: data.treatment,
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
      time: '11:30 AM',
      status: 'pending',
      notes: data.message,
      doctorName: 'Dr. Mehul Hasti Babel'
    };

    // Add to global Redux state & triggers success toast
    dispatch(addLocalAppointment(newApt));
    dispatch(showToast({
      message: 'Consultation request received! Scheduled pending session in portal.',
      type: 'success'
    }));

    reset();

    // Redirect to patient appointments automatically if already logged in so they see it
    if (user) {
      dispatch(setPath('patient/appointments'));
    } else {
      // Suggest login to view/manage
      dispatch(showToast({
        message: 'Log in to the Patient Portal to manage or reschedule this appointment.',
        type: 'success'
      }));
    }
  };

  const nextSlide = () => {
    setGalleryIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setGalleryIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div id="home-view-scroll" className="bg-[#FAF9F5] text-emerald-950 font-sans antialiased overflow-x-hidden">
      
      {/* 1. HERO BANNER SECTION */}
      <section id="hero-banner" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-16 px-4 md:px-8 border-b border-gray-100 bg-gradient-to-br from-[#FAF9F5] via-[#F4F2EA] to-emerald-50/20">
        
        {/* Abstract Background Design Elements */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-[15%] right-[10%] w-96 h-96 rounded-full bg-amber-400/10 blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Hero Texts */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-950/5 border border-emerald-920/10 px-4 py-2 rounded-full shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-emerald-900">
                Dental Surgeon (BDS), MUHS Mumbai
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-emerald-950 leading-[1.12]">
              Creating Beautiful,<br />Healthy & <br />
              <span className="font-normal italic text-amber-800 font-serif">Confident Smiles</span>
            </h1>

            <p className="text-emerald-900/80 text-sm sm:text-base leading-relaxed max-w-xl font-light">
              Experience premium digital dental care with advanced technology, expert treatment, and a patient-first approach in a boutique environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                id="hero-primary-book"
                onClick={() => document.getElementById('book-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-emerald-950 text-white font-serif tracking-wider uppercase text-xs px-8 py-4 hover:bg-amber-900 shadow-lg hover:shadow-xl transition-all font-medium text-center flex items-center justify-center gap-2.5"
              >
                <Calendar className="w-4 h-4 text-amber-500" /> Book Appointment
              </button>
              
              <button
                id="hero-secondary-consult"
                onClick={() => dispatch(setPath('services'))}
                className="border border-emerald-950/20 text-emerald-950 font-serif tracking-wider uppercase text-xs px-8 py-4 hover:bg-emerald-900/5 transition-all text-center"
              >
                Consult Now
              </button>
            </div>

            {/* Features list exactly as pictured beneath headers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-emerald-950/10">
              <div className="flex items-center gap-3 py-2 bg-white/60 backdrop-blur-sm px-4 rounded-xl border border-gray-100">
                <Smile className="w-5 h-5 text-amber-700" />
                <span className="text-xs font-semibold tracking-tight font-mono text-emerald-950">Full Digital Clinic</span>
              </div>
              <div className="flex items-center gap-3 py-2 bg-white/60 backdrop-blur-sm px-4 rounded-xl border border-gray-100">
                <Activity className="w-5 h-5 text-amber-700" />
                <span className="text-xs font-semibold tracking-tight font-mono text-emerald-950">4 Dental Beds</span>
              </div>
              <div className="flex items-center gap-3 py-2 bg-white/60 backdrop-blur-sm px-4 rounded-xl border border-gray-100">
                <Stethoscope className="w-5 h-5 text-amber-700" />
                <span className="text-xs font-semibold tracking-tight font-mono text-emerald-950">MUHS Certified</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Wrapper (Luxury lobby interior mockup) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80" 
                alt="Luxury Dental Lounge at Dr. Babel Clinic" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/85 backdrop-blur-md rounded-2xl border border-emerald-900/10">
                <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  PREMIUM WELLNESS
                </span>
                <p className="font-serif text-sm text-emerald-950 leading-relaxed font-semibold">
                  "Step into an clinical environment where sterile precision meets hotel comfort."
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 2. PRECISION MEETS CARE SECTION */}
      <section id="about-intro" className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Doctor Portrait wrapper matching screenshot dimensions */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=650&auto=format&fit=crop&q=80" 
                alt="Dr. Mehul Hasti Babel Portrait" 
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent p-6 text-white text-left">
                <span className="text-2xl stats-number font-semibold text-amber-500">15+</span>
                <p className="text-xs font-mono text-gray-300 uppercase tracking-widest leading-normal">
                  Years of clinical excellence in Mumbai
                </p>
              </div>
            </div>
          </div>

          {/* Right Text details on credentials exactly as shown */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-emerald-950">
                Precision Meets <span className="font-normal italic text-amber-800">Care</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
                Dr. Mehul Hasti Babel, a distinguished graduate of MUHS Mumbai, brings a vision of luxury dentistry to the heart of the city. Our clinic is built on the pillars of transparency, advanced technology, and patient comfort. We specialize in digital dentistry, ensuring every treatment plan is precise, minimally invasive, and tailored to your unique smile.
              </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-950/5 text-left">
                <span className="block text-2xl stats-number font-black text-emerald-950">5000+</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold">
                  Happy Smiles Created
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-950/5 text-left">
                <span className="block text-2xl stats-number font-black text-emerald-950">4</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold">
                  Advanced Beds & Rooms
                </span>
              </div>
            </div>

            {/* Bullets with checklist checks */}
            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3 text-sm font-medium text-emerald-950">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0" />
                <span>MUHS Mumbai Accredited Education & Honors</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-emerald-950">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0" />
                <span>State-of-the-art Digital Intraoral Scanners & Milling</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-emerald-950">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0" />
                <span>Expert in Complex Cosmetic and Smile Rejuvenation Procedures</span>
              </li>
            </ul>
          </div>

        </div>
      </section>


      {/* 3. WORLD-CLASS DENTAL ARTISTRY (Bento Flex Board) */}
      <section id="services-summary" className="py-24 px-4 md:px-8 bg-[#EFEEEC]/50 border-t border-b border-[#FAF9F5]/40 text-center">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-emerald-950">
              World-Class Dental <span className="font-normal italic text-amber-800">Artistry</span>
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-light">
              From essential health to aesthetic perfection, we offer a comprehensive suite of digital dental services, executed with premium care parameters.
            </p>
          </div>

          {/* Bento grid layout mirroring the screenshot perfectly */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            
            {/* Dark green hero block (Smile Designing) */}
            <div className="lg:col-span-6 bg-[#03231B] rounded-3xl p-8 text-white flex flex-col justify-between overflow-hidden relative group min-h-[350px]">
              {/* Graphic tooth backdrop */}
              <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none w-[200px] h-full">
                <img 
                  src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&auto=format&fit=crop&q=80" 
                  alt="Aesthetics Teeth Scanning graphic" 
                  className="w-full h-full object-cover saturate-0"
                />
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/20 text-amber-400 w-fit rounded-2xl border border-amber-500/10">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-medium">Smile Designing</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm">
                  Harnessing artificial intelligence algorithms and ultra-modern digital tooth mapping to craft your perfect, personalized aesthetic smile profile.
                </p>
              </div>

              <button
                id="btn-explore-smiles"
                onClick={() => dispatch(setPath('services'))}
                className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-amber-400 hover:text-white transition-colors pt-6"
              >
                Explore Smiles <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Quad grid list block */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Implants Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                <div>
                  <div className="text-amber-700 font-bold font-mono text-lg mb-1 leading-none">🦷</div>
                  <h4 className="text-base font-serif font-bold text-emerald-950">Implants</h4>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                    Permanent, natural-looking restoration for missing teeth. Precision engineered with Grade-5 hospital titanium cores.
                  </p>
                </div>
              </div>

              {/* Whitening Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                <div>
                  <div className="text-amber-700 font-bold font-mono text-lg mb-1 leading-none">✨</div>
                  <h4 className="text-base font-serif font-bold text-emerald-950">Whitening</h4>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                    Advanced laser whitening technologies for a radiant, brighter aesthetic shade without surface sensitivity.
                  </p>
                </div>
              </div>

              {/* Root Canal Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                <div>
                  <div className="text-amber-700 font-bold font-mono text-lg mb-1 leading-none">⚡</div>
                  <h4 className="text-base font-serif font-bold text-emerald-950">Root Canal</h4>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                    Painless, single-sitting automated endodontics treatments supporting maximal survival of historic teeth.
                  </p>
                </div>
              </div>

              {/* Pediatric Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                <div>
                  <div className="text-amber-700 font-bold font-mono text-lg mb-1 leading-none">🧸</div>
                  <h4 className="text-base font-serif font-bold text-emerald-950">Pediatric</h4>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                    Gentle, friendly, and non-intimidating clinic layouts for our precious little junior-most dental patients.
                  </p>
                </div>
              </div>

            </div>

            {/* Full cosmetic block at bottom of standard screen structure */}
            <div className="lg:col-span-12 bg-[#E1DDD7]/60 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-950/5">
              <div className="flex items-center gap-4 text-left">
                <span className="p-3.5 bg-white rounded-2xl shadow-sm text-lg block">🎨</span>
                <div>
                  <h4 className="text-base font-serif font-bold text-emerald-950">Cosmetic Dentistry</h4>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    Full facial aesthetic assessments, non-surgical structural overlays, and customized veneers matching exact symmetry profiles.
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch(setPath('services'))}
                className="bg-[#03231B] text-white hover:bg-amber-900 border-none rounded-full px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-bold transition-colors"
              >
                Inquire Prophies
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* 4. THE BABEL ADVANTAGE SECTION */}
      <section id="why-us" className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          
          <div className="space-y-4 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-700 font-black block">
              The Babel Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-emerald-950">
              Why Discerning Patients Choose <span className="font-normal italic text-amber-800">Our Care</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                icon: '⚡',
                title: 'Full Digital Setup',
                desc: 'Digital intraoral scanning and CAD/CAM technology for instant, clean, radiation-safe digital dentistry.'
              },
              {
                icon: '😊',
                title: 'Painless Treatment',
                desc: 'Advanced computerized anesthesia and soft-tissue procedures focused in complete therapeutic comfort.'
              },
              {
                icon: '🧴',
                title: 'Hygiene Standards',
                desc: 'Strict dental six-step sterilization protocol ensuring absolute clinical hygiene of international grades.'
              },
              {
                icon: '🏥',
                title: 'Comfortable Space',
                desc: '4 state-of-the-art bed sections situated within a serene, welcoming interior resembling high-end hospitality.'
              }
            ].map((adv, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-3xl border border-gray-100 bg-[#FAF9F5] shadow-sm flex flex-col justify-between space-y-5 hover:translate-y-[-4px] transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">
                  {adv.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-serif font-semibold text-emerald-950">{adv.title}</h4>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 5. BEGIN YOUR JOURNEY: INTEGRATIVE BOOKING PANEL */}
      <section id="book-section" className="py-16 px-4 md:px-8 bg-[#FAF9F5]">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-emerald-950/10 grid grid-cols-1 lg:grid-cols-12 bg-white">
          
          {/* Left panel - emerald green brand representation */}
          <div className="lg:col-span-5 bg-[#03231B] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[20%] right-[-10%] w-72 h-72 rounded-full bg-amber-500/5 blur-[60px] pointer-events-none"></div>
            
            <div className="space-y-6 relative z-10 text-left">
              <h3 className="font-serif text-3xl md:text-4xl font-light tracking-tight leading-tight">
                Begin Your Journey <br />to a <span className="font-normal italic text-amber-400">Perfect Smile</span>
              </h3>
              <p className="text-emerald-300 text-sm leading-relaxed font-light">
                Schedule a personalized consultation with Dr. Mehul Hasti Babel today. Our triage desk will get back to you within 2 business hours to confirm your suite slot.
              </p>
            </div>

            <div className="space-y-4 pt-12 relative z-10 text-sm text-gray-300 border-t border-emerald-900 text-left">
              <p className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-500" />
                <span className="font-mono">+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500" />
                <span className="font-mono">care@drbabeldentistry.com</span>
              </p>
            </div>
          </div>

          {/* Right panel - White form body utilizing react-hook-form */}
          <div className="lg:col-span-7 p-8 md:p-12 text-left">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-emerald-950 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="book-fullName"
                    type="text"
                    placeholder="John Doe"
                    {...register("fullName", { required: "Name is parameter requirement" })}
                    className="block w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 bg-gray-50/50"
                  />
                  {errors.fullName && (
                    <span className="text-[10px] text-red-600 block mt-1 font-semibold">{errors.fullName.message}</span>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-emerald-950 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    id="book-mobileNumber"
                    type="tel"
                    placeholder="+91 00000 00000"
                    {...register("mobileNumber", { 
                      required: "Mobile requirement",
                      pattern: { value: /^\+?[0-9\s-]{10,15}$/, message: "Valid mobile phone requested" }
                    })}
                    className="block w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 bg-gray-50/50"
                  />
                  {errors.mobileNumber && (
                    <span className="text-[10px] text-red-600 block mt-1 font-semibold">{errors.mobileNumber.message}</span>
                  )}
                </div>
              </div>

              {/* Treatment Type dropdown selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-emerald-950 mb-1.5">
                  Select Treatment
                </label>
                <select
                  id="book-treatment"
                  {...register("treatment", { required: true })}
                  className="block w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 bg-gray-50/50 text-emerald-950 font-medium"
                >
                  <option value="Consultation">General Consultation & Diagnostic Scan</option>
                  <option value="Smile Designing">Interactive Smile Designing Prophies</option>
                  <option value="Implants">Dental Implants (Titanium Cores)</option>
                  <option value="Cosmetic">Cosmetic Assessment & Veneers</option>
                  <option value="Root Canal">Painless Single-Sitting Root Canal</option>
                </select>
              </div>

              {/* Message block */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-emerald-950 mb-1.5">
                  Your Message
                </label>
                <textarea
                  id="book-message"
                  rows={3}
                  placeholder="Tell us about your dental goals..."
                  {...register("message")}
                  className="block w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 bg-gray-50/50 resize-none"
                ></textarea>
              </div>

              {/* Submit btn */}
              <button
                id="submit-form-book"
                type="submit"
                className="w-full bg-amber-800 hover:bg-emerald-900 text-white font-serif tracking-widest uppercase text-xs py-3.5 px-4 rounded-lg shadow transition-colors font-medium text-center"
              >
                Confirm Appointment
              </button>

            </form>
          </div>

        </div>
      </section>


      {/* 6. A SPACE DESIGNED FOR SERENITY (GALLERY CAROUSEL) */}
      <section id="serenity-gallery" className="py-24 px-4 md:px-8 bg-white border-t border-b border-gray-50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-emerald-950">
                A Space Designed for <span className="font-normal italic text-amber-800">Serenity</span>
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xl font-light">
                Take a virtual tour of our Mumbai clinic, where high-tech clinical precision meets hospitality-driven comfort.
              </p>
            </div>
            
            {/* Nav Arrows */}
            <div className="flex gap-2">
              <button 
                id="btn-photo-prev"
                onClick={prevSlide}
                className="p-3 bg-[#FAF9F5] hover:bg-emerald-50 rounded-full border border-gray-100 text-emerald-950 hover:text-amber-800 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                id="btn-photo-next"
                onClick={nextSlide}
                className="p-3 bg-[#FAF9F5] hover:bg-emerald-50 rounded-full border border-gray-100 text-emerald-950 hover:text-amber-800 transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Carousel Sliding layout with full-bleed look */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF9F5] p-6 sm:p-10 rounded-3xl border border-gray-100">
            
            {/* Carousel Picture Left */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-lg aspect-video relative group border border-emerald-950/5">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={galleryIdx}
                  src={galleryImages[galleryIdx].url} 
                  alt={galleryImages[galleryIdx].title} 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent pointer-events-none"></div>
            </div>

            {/* Carousel Caption Right */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-[10px] uppercase tracking-widest font-mono text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded">
                Lounge View {galleryIdx + 1} of {galleryImages.length}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-emerald-950">
                {galleryImages[galleryIdx].title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-light">
                {galleryImages[galleryIdx].desc}
              </p>
              
              {/* Pagination Dots indicator */}
              <div className="flex gap-2.5 pt-4">
                {galleryImages.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setGalleryIdx(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      galleryIdx === idx ? 'w-8 bg-amber-800' : 'w-2.5 bg-gray-200 hover:bg-gray-400'
                    }`}
                  ></button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 7. FAQs: "YOUR QUESTIONS, ANSWERED" */}
      <section id="faqs" className="py-24 px-4 md:px-8 bg-[#FAF9F5]">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="space-y-4 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-emerald-950">
              Your Questions, <span className="font-normal italic text-amber-800 font-serif">Answered</span>
            </h2>
          </div>

          {/* FAQ Accordions matching picture specification */}
          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = faqOpenIdx === idx;
              return (
                <div 
                  key={idx} 
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen ? 'border-amber-800/20 shadow-md' : 'border-gray-100 hover:border-gray-300 shadow-sm'
                  }`}
                >
                  <button
                    id={`faq-btn-${idx}`}
                    onClick={() => setFaqOpenIdx(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left text-emerald-950 font-serif text-sm sm:text-base font-semibold"
                  >
                    <span>{item.question}</span>
                    <span className="ml-4 shrink-0 transition-transform text-amber-700">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {/* Expand panel layout */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div 
                        id={`faq-ans-${idx}`} 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-gray-50 bg-[#FCFAF7]"
                      >
                        <div className="px-6 pb-6 pt-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
