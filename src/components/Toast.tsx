/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, clearToast } from '../store';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function Toast() {
  const dispatch = useDispatch();
  const { toastMessage, toastType } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div 
          id="toast-wrapper" 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full font-sans"
        >
          <div 
            id="toast-inner"
            className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 bg-white ${
              toastType === 'success' ? 'border-emerald-500' : 'border-red-500'
            }`}
          >
            <span className="shrink-0 mt-0.5">
              {toastType === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </span>
            <div className="flex-1">
              <p className="text-xs uppercase font-mono tracking-wider font-bold text-gray-500">
                {toastType === 'success' ? 'Clinical Action' : 'Alert'}
              </p>
              <p className="text-sm font-medium text-emerald-950 mt-0.5 leading-relaxed">
                {toastMessage}
              </p>
            </div>
            <button
              onClick={() => dispatch(clearToast())}
              className="shrink-0 text-gray-400 hover:text-gray-900 rounded-lg p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
