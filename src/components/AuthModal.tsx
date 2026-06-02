/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, loginThunk, toggleAuthModal, setPath, showToast } from '../store';
import { X, Lock, KeyRound, Mail, Sparkles, Phone, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function AuthModal() {
  const dispatch = useDispatch();
  const { authModalOpen, loading } = useSelector((state: RootState) => ({
    authModalOpen: state.ui.authModalOpen,
    loading: state.auth.loading
  }));

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleClose = () => {
    dispatch(toggleAuthModal(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) {
      dispatch(showToast({ message: 'Please enter both your email and phone number.', type: 'error' }));
      return;
    }

    try {
      // Dispatch async login thunk (Axios logic / thunk persistence simulation)
      const actionResult = await dispatch(loginThunk({ email, phone }) as any);
      if (loginThunk.fulfilled.match(actionResult)) {
        dispatch(toggleAuthModal(false));
        dispatch(setPath('patient/dashboard'));
        dispatch(showToast({ message: `Welcome back, ${actionResult.payload.fullName}! You are secure.`, type: 'success' }));
      } else {
        dispatch(showToast({ message: 'Login failed. Please check credentials.', type: 'error' }));
      }
    } catch (e) {
      dispatch(showToast({ message: 'An unexpected connection error occurred.', type: 'error' }));
    }
  };

  const handleDemoLogin = async () => {
    // autofill demo credentials
    const demoEmail = 'meera.deshmukh@gmail.com';
    const demoPhone = '+91 98200 12345';
    setEmail(demoEmail);
    setPhone(demoPhone);

    try {
      const actionResult = await dispatch(loginThunk({ email: demoEmail, phone: demoPhone }) as any);
      if (loginThunk.fulfilled.match(actionResult)) {
        dispatch(toggleAuthModal(false));
        dispatch(setPath('patient/dashboard'));
        dispatch(showToast({ message: 'Logged in as Meera Deshmukh (Demo Account)', type: 'success' }));
      }
    } catch (e) {
      dispatch(showToast({ message: 'Demo sign-in failed.', type: 'error' }));
    }
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <div id="auth-modal-wrapper" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            id="auth-backdrop" 
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-emerald-950/85 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div 
            id="auth-popup" 
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.12 }}
            className="relative bg-white max-w-md w-full rounded-2xl shadow-2xl border border-emerald-950/20 overflow-hidden z-10"
          >
            {/* Top Header Graphic */}
            <div className="bg-[#03231B] text-white px-6 py-6 relative">
              <button 
                id="btn-close-auth"
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-emerald-900/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">

              </div>
              <h2 className="font-serif text-xl font-bold tracking-tight">
                Patient Log In & Files
              </h2>
              <p className="text-emerald-300 text-xs mt-1.5 leading-relaxed">
                Access your custom smile design profile, diagnostic X-rays, treatment charts, and schedule sessions securely.
              </p>
            </div>

            {/* Form Body */}
            <div className="px-6 py-6 font-sans">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-emerald-950 mb-1.5">
                    Registered Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="auth-email-input"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900"
                    />
                  </div>
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-emerald-950 mb-1.5">
                    Registered Phone / Mobile
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      id="auth-phone-input"
                      type="tel"
                      required
                      placeholder="+91 98200 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900"
                    />
                  </div>
                </div>

                {/* Login button */}
                <motion.button
                  id="submit-auth"
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-serif tracking-wider uppercase text-xs py-3 rounded-lg shadow-md transition-shadow font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  {loading ? 'Authenticating...' : 'Enter Patient Portal'}
                </motion.button>
              </form>

              {/* Quick Demo Assist */}
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">Testing the Portal features?</span>
                  <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase font-bold">
                    EASY ACCESS
                  </span>
                </div>
                
                <motion.button
                  id="btn-demo-quick-login"
                  type="button"
                  onClick={handleDemoLogin}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  One-Click Demo Fill & Log In
                </motion.button>
              </div>

              <div className="mt-4 text-center">
                <span className="text-[10px] text-gray-400 font-mono flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 inline" /> Fully HIPAA & MUHS Certified clinical storage
                </span>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
