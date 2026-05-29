/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useDispatch } from "react-redux";
import { setPath } from "../store";
import { Globe, Share2, Instagram, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const dispatch = useDispatch();

  const handleLink = (path: string) => {
    dispatch(setPath(path));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="babel-footer"
      className="bg-[#021F17] text-white pt-20 pb-8 border-t border-emerald-950 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* BRAND */}
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl tracking-tight text-white font-semibold">
                Dr. Mehul Hasti Babel
              </h3>

              <p className="text-[11px] tracking-[0.25em] uppercase text-amber-500 mt-2 font-medium">
                Luxury Digital Dentistry
              </p>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Redefining the dental experience through luxury, technology, and
              clinical excellence in Mumbai. Experience premium boutique
              dentistry with complete patient comfort.
            </p>

            <div className="flex space-x-3">
              {[Globe, Share2, Instagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="group p-3 rounded-full border border-white/10 bg-white/[0.03] hover:bg-amber-700 transition-all duration-300 hover:scale-105"
                >
                  <Icon className="w-4 h-4 text-emerald-300 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* SERVICES */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-amber-500 font-semibold mb-6">
              Clinic Services
            </h4>

            <ul className="space-y-4 text-sm">
              {[
                { label: "Smile Designing", path: "services" },
                { label: "Dental Implants", path: "services" },
                { label: "Cosmetic Dentistry", path: "services" },
                { label: "Digital Orthodontics", path: "services" },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleLink(item.path)}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-amber-500 font-semibold mb-6">
              Quick Links
            </h4>

            <ul className="space-y-4 text-sm">
              {[
                { label: "About Dr. Babel", path: "about" },
                { label: "Patient Journey", path: "about" },
                { label: "Clinic Gallery", path: "gallery" },
                { label: "Privacy Policy", path: "about" },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleLink(item.path)}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* VISIT US */}
          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.25em] text-amber-500 font-semibold">
              Visit Us
            </h4>

            <div className="space-y-4 text-sm text-gray-400">
              <p className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>
                  Unique Dental Care, Shop No: 51,
                  <br />
                  Building No: 22,
                  <br />
                  Near Shiv Sena Shaka,
                  <br />
                  Mumbai, Maharashtra – 400043
                </span>
              </p>

              <p className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white">Working Hours</strong>
                  <br />
                  Mon - Sat: 10 AM – 8 PM
                  <br />
                  <span className="text-amber-400">Sunday: By Appointment</span>
                </span>
              </p>
            </div>

            {/* PREMIUM MAP EFFECT */}
            {/* PREMIUM MAP EFFECT */}
            <div className="group relative h-32 rounded-[24px] border border-white/10 bg-[#03231B] overflow-hidden hover:border-amber-700 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
              {/* GOOGLE MAP */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15084.582224310236!2d72.91516290110101!3d19.057336914291685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c73d9deb1b17%3A0xcabc7277a44a4c94!2sUNIQUE%20DENTAL%20CARE!5e0!3m2!1sen!2sin!4v1780072417199!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* DARK LUXURY OVERLAY */}
<div className="absolute inset-0 bg-[#021F17]/40 backdrop-blur-[1px] pointer-events-none" />

{/* Luxury Emerald Glow */}
<div className="absolute -top-12 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

{/* Premium Grid */}
<div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

              {/* Luxury Animated Map Lines */}
              <svg
                className="absolute inset-0 w-full h-full text-emerald-700/30 pointer-events-none"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <path
                  d="M10,20 L90,80
         M15,75 L85,20
         M50,0 L50,100
         M0,50 L100,50
         M20,10 C40,30 60,30 80,10"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                />

                {/* Animated Pulse Dot */}
                <circle
                  cx="52"
                  cy="48"
                  r="2"
                  className="fill-amber-500 animate-pulse"
                />
              </svg>

              {/* LOCATION LABEL */}
              <div className="absolute bottom-4 left-4 z-10 bg-[#03231B]/90 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />

                <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-semibold">
                  Govandi, Mumbai
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-emerald-950/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            © 2026 Dr. Mehul Hasti Babel Luxury Dentistry. All rights reserved.
          </p>

          <div className="flex items-center gap-4 divide-x divide-emerald-900/60 text-emerald-500">
            <span className="pl-4">MUHS Mumbai Certified</span>

            <span className="pl-4">ISO 9001:2015</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
