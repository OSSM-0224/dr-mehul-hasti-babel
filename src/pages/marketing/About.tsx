/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Award, Shield, CheckCircle2, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 14 } }
  };

  return (
    <motion.div 
      id="about-scroll" 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="bg-[#FAF9F5] text-emerald-950 font-sans antialiased py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 text-left">
        
        {/* Banner header title */}
        <motion.div variants={itemVariants} className="space-y-4 max-w-3xl">
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded block w-fit">
            Our Founder & Vision
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-emerald-950 leading-tight">
            Redefining boutique dentistry with <span className="font-normal italic text-amber-800">surgical precision</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
            Founded by MUHS Mumbai alumnus Dr. Mehul Hasti Babel, Babel Dental Studio operates at the boundary of health and clinical art, prioritizing comfort, absolute transparency and next-generation dentistry in Lower Parel, Mumbai.
          </p>
        </motion.div>

        {/* Credentials and Bio Block Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div variants={itemVariants} className="lg:col-span-5">
            <div className="relative aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80" 
                alt="Dr Mehul Hasti Babel" 
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021F17]/85 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <p className="font-serif text-lg font-bold">Dr. Mehul Hasti Babel</p>
                <p className="text-[10px] uppercase font-mono tracking-widest text-amber-400">Chief Dental Implantologist</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-emerald-950">Academic Integrity & Clinical Honors</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-light">
              Graduating as a ranking scholar from the esteemed Maharashtra University of Health Sciences (MUHS), Mumbai, Dr. Babel pioneered computerized crown integrations early. Over fifteen years of constant practice, he has completed multiple international cosmetic accreditations across Germany and aesthetic modules in advanced crown/veneer setups.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="p-2 bg-amber-50 rounded-xl text-lg block text-amber-700">🎓</span>
                <div>
                  <h4 className="text-sm font-bold font-serif text-emerald-950">MUHS Clinical Graduate</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">Rigorous medical honors and continuous dental surgical practice.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="p-2 bg-amber-50 rounded-xl text-lg block text-amber-700">🔬</span>
                <div>
                  <h4 className="text-sm font-bold font-serif text-emerald-950">Micro-Dentistry Leader</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">Specialized in minimally invasive techniques with high-zoom clinical loops.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sterile protocol panel standard - 6 step sanitation setup */}
        <motion.div 
          variants={itemVariants}
          className="bg-[#03231B] text-white p-8 md:p-12 rounded-3xl border border-emerald-900 overflow-hidden relative shadow-lg"
        >
          <div className="absolute right-0 top-0 opacity-[0.03] text-white pointer-events-none w-1/3">
            <CheckCircle2 className="w-96 h-96" />
          </div>
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <h3 className="font-serif text-3xl font-light tracking-tight">The Six-Step Sterilization Gold Standard</h3>
            <p className="text-emerald-300 text-xs sm:text-sm leading-relaxed font-light">
              Hygiene is not an option; it is our strictest code. We adhere to clinical protocols matching the highest international safety levels, involving strict chemical pre-clean, ultrasonic cavitation, pressurized dry-steam autoclaves, vacuum-sealed germic shielding packages, and continuous ambient clean-air UV circulation.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
              {[
                { step: '01', title: 'Sonic Disinfect' },
                { step: '02', title: 'Pressurized Steam' },
                { step: '03', title: 'Sealed Barrier pack' },
                { step: '04', title: 'UV Clean Ventilation' }
              ].map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-800">
                  <span className="block text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">Step {s.step}</span>
                  <span className="block font-serif text-xs font-semibold text-white mt-1.5">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
