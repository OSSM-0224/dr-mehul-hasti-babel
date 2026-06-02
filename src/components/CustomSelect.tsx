import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (Option | string)[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: Option[] = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[40px] sm:h-[42px] flex items-center justify-between border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 hover:bg-white text-emerald-950 font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer text-left"
      >
        <span className={selectedOption ? 'text-emerald-950 truncate pr-2' : 'text-gray-400 font-normal truncate pr-2'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-gray-400 font-bold ml-2 shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-emerald-900" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-50 overflow-hidden bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto"
          >
            <div className="p-1.5 space-y-0.5">
              {normalizedOptions.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm rounded-xl transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-950 font-bold'
                        : 'text-gray-700 hover:bg-neutral-50 hover:text-emerald-950'
                    }`}
                  >
                    <span className="truncate pr-4 leading-tight">{opt.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-800 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
