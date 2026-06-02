/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, setPath, showToast, RootState } from '../../store';
import { ShieldCheck, Mail, Lock, Sparkles, KeyRound, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginFormInputs {
  email: string;
  phone: string;
}

export default function AdminLogin() {
  const dispatch = useDispatch<any>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [showDemoTip, setShowDemoTip] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      phone: '',
    }
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const resultAction = await dispatch(loginThunk({ email: data.email, phone: data.phone }));
      if (loginThunk.fulfilled.match(resultAction)) {
        if (resultAction.payload.isAdmin) {
          dispatch(showToast({ message: `Welcome back, Dr. Babel. Command suite loaded safely.`, type: 'success' }));
          dispatch(setPath('admin/dashboard'));
        } else {
          dispatch(showToast({ message: `Access Denied: Standard patient accounts cannot enter the Clinician dashboard.`, type: 'error' }));
        }
      } else {
        dispatch(showToast({ message: `Authentication failure: Check credentials.`, type: 'error' }));
      }
    } catch (err) {
      dispatch(showToast({ message: `Server authentication error.`, type: 'error' }));
    }
  };

  const handleAutofill = () => {
    setValue('email', 'dr.babel@babeldental.com');
    setValue('phone', 'admin123');
    dispatch(showToast({ message: 'Autofilled Dr. Babel\'s credentials', type: 'success' }));
  };

  return (
    <div id="admin-login-screen" className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-emerald-950/5 relative overflow-hidden"
      >
        {/* Background accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-800 to-emerald-950" />

        <div className="text-center space-y-3">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-950">
            <KeyRound className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B6B00] bg-amber-50/70 border border-amber-100 px-3 py-1 rounded-full font-bold">
              Staff Portal ONLY
            </span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-emerald-950 tracking-tight">
            Studio Command Suite
          </h2>
          <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed">
            Authorized administrative & clinical access point for Dr. Babel's Dental Studio.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Email field */}
          <div className="space-y-1 text-left">
            <label className="block text-xs uppercase font-mono tracking-wider text-emerald-950 font-bold">
              Authorized Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="dr.babel@babeldental.com"
                className={`block w-full pl-10 pr-3 py-2.5 text-sm border bg-[#FCFAF7] rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                {...register('email', { 
                  required: 'Email is required', 
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } 
                })}
              />
            </div>
            {errors.email && (
              <span className="text-[10px] font-mono text-red-600">{errors.email.message}</span>
            )}
          </div>

          {/* Secure Pin/Access Code */}
          <div className="space-y-1 text-left">
            <label className="block text-xs uppercase font-mono tracking-wider text-emerald-950 font-bold">
              Access Code PIN
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className={`block w-full pl-10 pr-3 py-2.5 text-sm border bg-[#FCFAF7] rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                }`}
                {...register('phone', { 
                  required: 'Access code is required',
                  minLength: { value: 4, message: 'PIN should be at least 4 characters' }
                })}
              />
            </div>
            {errors.phone && (
              <span className="text-[10px] font-mono text-red-600">{errors.phone.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-emerald-950 hover:bg-emerald-900 text-white font-serif uppercase tracking-wider text-xs py-3.5 rounded-xl shadow-md transition-all font-bold flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
          >
            {loading ? (
              <span>Decrypting Studio Access...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Enter Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-emerald-300" />
              </>
            )}
          </button>
        </form>

        {/* Credentials demo pill */}
        {showDemoTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-left space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8B6B00] font-mono font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Clinical Sandbox Autofill
              </span>
              <button 
                onClick={() => setShowDemoTip(false)}
                className="text-[10px] font-mono text-gray-400 hover:text-gray-900"
              >
                Dismiss
              </button>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed font-light">
              Use the authorized developer credentials to unlock the clinic command center instantly:
            </p>
            <button
              onClick={handleAutofill}
              className="w-full bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 font-mono text-[11px] py-1.5 rounded-lg transition-colors font-bold flex items-center justify-center gap-1 cursor-pointer shadow-xs"
            >
              Autofill: dr.babel@babeldental.com
            </button>
          </motion.div>
        )}

        <div className="text-center pt-2">
          <span className="text-[10px] text-gray-400 font-mono flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Authorized clinical endpoint • HIPAA Compliant
          </span>
        </div>
      </motion.div>
    </div>
  );
}
