/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, HeartPulse, ShieldCheck, Zap, Scissors, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export default function Services() {
  const categories = [
    {
      title: 'Digital Smile Designing (DSD)',
      priceRange: '₹18,000 - ₹35,000 per arch',
      desc: 'Using AI tooth dimension libraries and facial scanners, we simulate and preview your perfect symmetry mockup prior to any treatment. We model tooth outlines, widths, and golden ratio fits tailored exactly to your eye-line.',
      tech: 'Intraoral 3D mapping, high-definition cosmetic photography, diagnostic modeling wax',
      icon: <Sparkles className="w-5 h-5 text-amber-700" />
    },
    {
      title: 'Titanium Dental Implants',
      priceRange: '₹35,000 - ₹65,000 per tooth',
      desc: 'Robust, lifelong biocompatible bone anchoring. We utilize computer-guided surgery software templates to secure high-grade implants with micrometric depth precision, avoiding surrounding sinuses and nerves.',
      tech: 'CBCT 3D Bone Scans, surgical guides, premium Nobel Biocare & Straumann implants',
      icon: <HeartPulse className="w-5 h-5 text-amber-700" />
    },
    {
      title: 'Painless Single-Sitting Root Canal',
      priceRange: '₹8,500 - ₹14,000 per tooth',
      desc: 'No more multi-visit pain cycles. Using computerized apex locators and dynamic torque-controlled cleaning engines, we safely empty inflamed canals, sanitize them with advanced laser washes, and obturate in a single hour.',
      tech: 'Rotary endodontics, medical hot-obturation systems, laser irrigation washes',
      icon: <Zap className="w-5 h-5 text-amber-700" />
    },
    {
      title: 'Cosmetic Ceramic Veneers & Crowns',
      priceRange: '₹15,000 - ₹28,000 per unit',
      desc: 'Ultra-thin custom ceramic facades that bond directly to teeth, fixing internal discolorations, micro-gaps, or chipped edges. Handcrafted by elite master ceramists for genuine premium tooth sheen.',
      tech: 'E.Max glass ceramic veneers, computerized milling machines',
      icon: <RefreshCw className="w-5 h-5 text-amber-700" />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 95, damping: 14 } }
  };

  return (
    <div id="services-scroll" className="bg-[#FAF9F5] text-emerald-950 font-sans antialiased py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-left">
        
        {/* Services banner */}
        <div className="space-y-4 max-w-2xl">
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded block w-fit">
            CLINICAL PORTFOLIO
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-emerald-950">
            Artistry Driven by <span className="font-normal italic text-amber-800">Next-Gen Science</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
            Every clinical outcome is optimized using computer simulation modeling, maximizing biological survival rates and delivering beautiful teeth.
          </p>
        </div>

        {/* Detailed items list */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {categories.map((serv, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="p-3 bg-amber-50 rounded-2xl w-fit">
                    {serv.icon}
                  </div>
                  <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2.5 py-1 rounded font-bold uppercase">
                    ESTIMATED GUIDE
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-emerald-950">{serv.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">{serv.desc}</p>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-5 space-y-2 text-xs font-mono">
                <p className="text-emerald-950">
                  <strong className="text-amber-800 font-bold">Standard Suite:</strong> {serv.tech}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
