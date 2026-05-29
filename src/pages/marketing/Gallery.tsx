/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Gallery() {
  const [filter, setFilter] = useState<
    'all' | 'rooms' | 'lounge' | 'tech'
  >('all');

  const [selectedImage, setSelectedImage] = useState<any>(null);

  const photos = [
    {
      title: 'Luxury Clinical Operatory',
      category: 'rooms',
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop&q=80',
      caption:
        'Precision-crafted treatment suite with premium ergonomic comfort and advanced digital instrumentation.',
    },
    {
      title: 'Serene Consultation Lounge',
      category: 'lounge',
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&auto=format&fit=crop&q=80',
      caption:
        'Elegant patient consultation environment designed to feel warm, private and reassuring.',
    },
    {
      title: 'Boutique Reception Experience',
      category: 'lounge',
      url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1600&auto=format&fit=crop&q=80',
      caption:
        'A hospitality-inspired reception space blending calmness with luxury healthcare aesthetics.',
    },
    {
      title: 'Digital Smile Technology',
      category: 'tech',
      url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?w=1600&auto=format&fit=crop&q=80',
      caption:
        'State-of-the-art digital scanning systems enabling precision diagnostics and same-day planning.',
    },
    {
      title: 'Premium Sterilization Suite',
      category: 'tech',
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1600&auto=format&fit=crop&q=80',
      caption:
        'European-standard sterilization ensuring complete patient safety and clinical confidence.',
    },
    {
      title: 'Advanced Treatment Bay',
      category: 'rooms',
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop&q=80',
      caption:
        'Digitally equipped dental operatory for seamless and minimally invasive care.',
    },
  ];

  const filteredPhotos =
    filter === 'all'
      ? photos
      : photos.filter((p) => p.category === filter);

  return (
    <div className="bg-[#F8F6F1] text-emerald-950 overflow-hidden">

      {/* HERO */}
      <section className="relative py-24 border-b border-[#E7E2D8] overflow-hidden">

        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-900/5 blur-[100px]" />

        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-flex px-4 py-2 rounded-full bg-white border border-[#E8E2D6] text-[11px] tracking-[0.3em] uppercase font-semibold text-amber-700 shadow-sm">
              Clinic Virtual Tour
            </span>

            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight text-emerald-950 mt-8">
              Experience Our
              <span className="italic text-amber-800">
                {' '}Luxury Clinical Space
              </span>
            </h1>

            <p className="mt-6 text-emerald-900/70 text-base md:text-lg leading-relaxed max-w-2xl">
              Explore our boutique dental environment where
              cutting-edge technology meets luxury hospitality.
              Every corner is designed for calmness, comfort,
              and world-class precision.
            </p>
          </motion.div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3 mt-12">

            {[
              { id: 'all', label: 'All Spaces' },
              { id: 'rooms', label: 'Treatment Suites' },
              { id: 'lounge', label: 'Luxury Lounge' },
              { id: 'tech', label: 'Digital Technology' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={`px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] transition-all duration-300 font-semibold border ${
                  filter === btn.id
                    ? 'bg-emerald-950 text-white border-emerald-950 shadow-xl'
                    : 'bg-white text-emerald-900 border-[#E8E2D6] hover:shadow-md'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CINEMATIC GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">

          <motion.div
            layout
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((item, index) => (
                <motion.div
                  key={item.title}
                  layout
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedImage(item)}
                  className={`group cursor-pointer overflow-hidden rounded-[36px] bg-white border border-[#EAE4D9] shadow-sm hover:shadow-2xl transition-all duration-500 ${
                    index % 3 === 0
                      ? 'lg:col-span-8'
                      : 'lg:col-span-4'
                  }`}
                >
                  <div className="relative overflow-hidden h-[300px] lg:h-[460px]">

                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <div className="absolute top-5 left-5">
                      <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] px-4 py-2 rounded-full uppercase tracking-[0.2em]">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-0 p-8 text-white">
                      <h3 className="font-serif text-2xl md:text-3xl">
                        {item.title}
                      </h3>

                      <p className="text-sm text-white/80 leading-relaxed mt-3 max-w-lg">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* FULLSCREEN MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-5"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-16 right-0 text-white hover:text-amber-400 transition-colors"
              >
                <X size={34} />
              </button>

              <div className="overflow-hidden rounded-[40px] shadow-2xl bg-[#111]">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-[80vh] object-cover"
                />
              </div>

              <div className="text-center mt-8 text-white">
                <h3 className="font-serif text-3xl">
                  {selectedImage.title}
                </h3>

                <p className="mt-3 text-white/70 max-w-2xl mx-auto leading-relaxed">
                  {selectedImage.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}