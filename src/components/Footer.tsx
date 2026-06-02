/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { setPath } from '../store';
import { Globe, Share2, Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';
import ClinicLogo from './ClinicLogo';

export default function Footer() {
  const dispatch = useDispatch();

  const handleLink = (path: string) => {
    dispatch(setPath(path));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="babel-footer" className="bg-[#021F17] text-white pt-16 pb-8 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1 - Brand Summary */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-emerald-950 rounded-lg border border-emerald-900">
                <ClinicLogo size={32} className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="font-serif text-xl tracking-tight text-white font-semibold">
                Dr. Mehul Hasti Babel
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Redefining the dental experience through luxury, technology, and clinical excellence in Mumbai. Experience the pinnacle of boutique dental wellness.
            </p>
            <div className="flex space-x-3 text-emerald-400">
              <a href="#globe" className="p-2 rounded-full border border-emerald-950 bg-emerald-950/20 hover:bg-amber-800 hover:text-white transition-colors" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#share" className="p-2 rounded-full border border-emerald-950 bg-emerald-950/20 hover:bg-amber-800 hover:text-white transition-colors" aria-label="Share">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-emerald-950 bg-emerald-950/20 hover:bg-amber-800 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-mono text-amber-500 font-bold mb-6">
              Clinic Services
            </h4>
            <ul className="space-y-3.5 text-sm">
              {[
                { label: 'Smile Designing', path: 'services' },
                { label: 'Dental Implants', path: 'services' },
                { label: 'Cosmetic Dentistry', path: 'services' },
                { label: 'Digital Orthodontics', path: 'services' }
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleLink(item.path)}
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 duration-150 text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-mono text-amber-500 font-bold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-sm">
              {[
                { label: 'About Dr. Babel', path: 'about' },
                { label: 'Patient Journey', path: 'about' },
                { label: 'Clinic Gallery', path: 'gallery' },
                { label: 'Privacy Policy', path: 'about' }
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleLink(item.path)}
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 duration-150 text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleLink('admin/login')}
                  className="text-amber-500 hover:text-amber-400 font-mono text-[11px] uppercase font-bold tracking-wider transition-colors hover:translate-x-1 duration-150 text-left"
                >
                  🔐 Staff Console Port
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4 - Visit and Minimal Abstract Map */}
          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest font-mono text-amber-500 font-bold mb-1">
              Visit Us
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>
                  Unique Dental Care, Shop No:-51, Building No:22,<br />
                  near Shiv Sena Shaka, Mankhurd (W),<br />
                  PMG COLONY, Mumbai, Maharashtra 400043
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Hours:</strong><br />
                  Tue - Sun: 10:00 AM - 8:00 PM<br />
                  <span className="text-amber-600 font-medium">Mon: By Appointment Only</span>
                </span>
              </p>
            </div>
            
            {/* Responsive and Premium Embedded Real Google Map */}
            <div className="space-y-2">
              <div className="relative w-full h-32 rounded-xl border border-emerald-900/65 bg-emerald-950/20 overflow-hidden shadow-inner group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d120681.16804000596!2d72.931934!3d19.051137!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c73d9deb1b17%3A0xcabc7277a44a4c94!2sUNIQUE%20DENTAL%20CARE!5e0!3m2!1sen!2sin!4v1780401355164!5m2!1sen!2sin"
                  className="w-full h-full grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Unique Dental Care Clinic Location Map"
                ></iframe>
              </div>
              <a 
                href="https://maps.google.com/?q=UNIQUE+DENTAL+CARE+Mumbai" 
                target="_blank" 
                rel="noreferrer" 
                className="w-full block text-center text-[10px] font-mono tracking-wider text-amber-400 hover:text-amber-300 font-bold bg-[#03231B] border border-emerald-900 px-3 py-2 rounded-lg transition-colors hover:bg-emerald-900/40"
              >
                🗺️ Open Directions on Maps
              </a>
            </div>
          </div>

        </div>

        {/* Divider and Accreditations */}
        <div className="border-t border-emerald-950/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-500">
          <p>© 2026 Dr. Mehul Hasti Babel Luxury Dentistry. All rights reserved.</p>
          <div className="flex items-center gap-4 divide-x divide-emerald-900/60 text-emerald-500">
            <span className="pl-4">MUHS Mumbai Certified</span>
            <span className="pl-4">ISO 9001:2015</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
