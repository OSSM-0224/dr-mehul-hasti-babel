/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setPath, toggleAuthModal, cancelAppointmentThunk, showToast } from '../../store';
import { 
  Calendar, Award, Activity, Heart, ShieldAlert, FileText, ClipboardList, 
  Trash2, BellRing, Sparkles, User, FileImage, Download, ChevronRight, LockKeyhole
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { list: appointments } = useSelector((state: RootState) => state.appointments);
  const { list: records } = useSelector((state: RootState) => state.records);

  const [activeXray, setActiveXray] = useState<{ name: string; url: string; notes: string } | null>(null);

  // Protected Route Check
  if (!user) {
    return (
      <div id="protected-block shadow-sm" className="bg-[#FAF9F5] py-24 px-4 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
            <LockKeyhole className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-emerald-950">Patient Portal Restructured</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              For HIPAA privacy alignment, you must authenticate to read treatment charts, scans, and download clinical prescriptions.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              id="btn-portal-unlocked-auth"
              onClick={() => dispatch(toggleAuthModal(true))}
              className="bg-emerald-950 text-white font-serif tracking-wider uppercase text-xs py-3.5 rounded-xl hover:bg-amber-800 transition-colors font-medium"
            >
              Log In securely
            </button>
            <button 
              onClick={() => dispatch(setPath('home'))}
              className="text-emerald-900 text-xs font-mono font-bold hover:underline"
            >
              Back to Clinic Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const pastAppointmentsCount = appointments.filter(a => a.status === 'completed').length;

  const handleCancelApt = async (id: string) => {
    if (confirm('Are you sure you would like to request cancellation of this booked slot?')) {
      await dispatch(cancelAppointmentThunk(id) as any);
      dispatch(showToast({ message: 'Appointment cancellation processed. Team notified.', type: 'error' }));
    }
  };

  // Treatment Progress tracker variables
  const currentPlan = "Smile Designing (6 Veneers Upper Arch)";
  const currentProgress = "Step 2 of 4 (Mockup Trial Completed)";

  return (
    <motion.div 
      id="dashboard-scroll" 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[#FAF9F5] text-emerald-950 font-sans antialiased py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome and Header stats summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#03231B] text-white p-6 sm:p-8 rounded-3xl border border-emerald-900 shadow-sm text-left relative overflow-hidden">
          <div className="absolute right-[-10%] top-0 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>
          
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400 font-bold bg-amber-500/20 px-2 rounded">
                PATIENT PORTAL
              </span>
              <span className="text-gray-400 text-xs font-mono">ID: {user.patientId}</span>
            </div>
            <h1 className="font-serif text-3xl font-light tracking-tight">
              Welcome back, <span className="font-normal italic text-amber-400">{user.fullName}</span>
            </h1>
            <p className="text-emerald-300 text-xs font-light max-w-md">
              Access your digital crown maps, dental prescriptions, and schedule adjustment slots.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 relative z-10">
            <button
              onClick={() => dispatch(setPath('patient/appointments'))}
              className="bg-amber-800 text-white hover:bg-amber-700 text-xs font-mono font-bold tracking-tight px-4 py-2.5 rounded-xl transition-all"
            >
              + Schedule Slots
            </button>
            <button
              onClick={() => {
                dispatch(showToast({ message: 'Pre-operative care pamphlet downloaded.', type: 'success' }));
              }}
              className="bg-emerald-900 hover:bg-emerald-800 border border-emerald-800 text-white text-xs font-mono font-bold tracking-tight px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Care Manual
            </button>
          </div>
        </div>

        {/* Inner Subnavigation portal for quick access */}
        <div className="flex border-b border-gray-200 gap-6 text-sm">
          <button 
            onClick={() => dispatch(setPath('patient/dashboard'))}
            className="border-b-2 border-amber-800 font-bold pb-2.5 text-emerald-950 uppercase tracking-wider text-xs"
          >
            My Care Board
          </button>
          <button 
            onClick={() => dispatch(setPath('patient/appointments'))}
            className="border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-emerald-900 pb-2.5 uppercase tracking-wider text-xs"
          >
            Schedules ({appointments.length})
          </button>
          <button 
            onClick={() => dispatch(setPath('patient/records'))}
            className="border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-emerald-900 pb-2.5 uppercase tracking-wider text-xs"
          >
            Diagnostics ({records.length})
          </button>
        </div>

        {/* Dashboard Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: General Health Stats and Diagnostic Items */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Treatment Progress widget */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
              <h3 className="font-serif text-lg font-bold text-emerald-950 flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-700" /> Current Care Plan
              </h3>
              
              <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-emerald-950/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Active Plan</p>
                  <p className="font-serif text-base font-bold text-emerald-950 mt-1">{currentPlan}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Status & Phase</p>
                  <p className="text-sm font-semibold text-amber-800 mt-1">{currentProgress}</p>
                </div>
              </div>

              {/* Progress Line Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-semibold font-mono">
                  <span className="text-emerald-950">Intraoral Scanning (Done)</span>
                  <span className="text-amber-800">Ceramic Veneer Fitting (Next Week)</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-900 rounded-full w-[65%]"></div>
                </div>
              </div>
            </div>

            {/* Diagnostic images panel */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
              <h3 className="font-serif text-lg font-bold text-emerald-950 flex items-center gap-2 mb-4">
                <FileImage className="w-5 h-5 text-amber-700" /> Digital Scans & X-Rays
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {records.filter(r => r.attachment).map((rec) => (
                  <div 
                    key={rec.id}
                    onClick={() => setActiveXray({
                      name: rec.treatmentType,
                      url: rec.attachment!.url,
                      notes: rec.notes
                    })}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 cursor-pointer hover:border-amber-700/40 hover:bg-amber-50/5 transition-all flex items-center gap-4 text-left group"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-emerald-950 shrink-0">
                      <img 
                        src={rec.attachment?.url} 
                        alt={rec.treatmentType} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{rec.attachment?.type}</p>
                      <h4 className="font-serif text-sm font-bold text-emerald-950 truncate">{rec.treatmentType}</h4>
                      <span className="text-[10px] text-emerald-900/60 font-semibold">{rec.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List of current prescription routines */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
              <h3 className="font-serif text-lg font-bold text-emerald-950 flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-amber-700" /> Clinical Prescriptions
              </h3>
              
              <div className="divide-y divide-gray-50">
                <div className="py-3.5 flex justify-between items-center text-sm gap-4">
                  <div>
                    <h4 className="font-semibold text-emerald-950">Amoxicillin (500mg)</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Post-root canal prophylaxis - 1 tablet every 12 hr</p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-bold uppercase">
                    5 Days remaining
                  </span>
                </div>
                <div className="py-3.5 flex justify-between items-center text-sm gap-4">
                  <div>
                    <h4 className="font-semibold text-emerald-950">Hexidine Antiseptic Mouthwash</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Rinse twice daily after meals - 10ml solution</p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-bold uppercase">
                    Continuous care
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: Scheduled/Pending appts widget and Billing breakdown */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Upcoming Appointments */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
              <h3 className="font-serif text-lg font-bold text-emerald-950 flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-amber-700" /> Booked Slots
              </h3>

              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-xs">No slot reservations found.</p>
                  <button
                    onClick={() => dispatch(setPath('patient/appointments'))}
                    className="mt-3 bg-emerald-50 text-emerald-900 border border-emerald-100 font-mono text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-100"
                  >
                    + Book Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <div 
                      key={apt.id} 
                      className="p-4 rounded-2xl border bg-[#FAF9F5] border-emerald-950/5 relative overflow-hidden text-left"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className={`text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded ${
                            apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {apt.status}
                          </span>
                          <h4 className="font-serif text-sm font-bold text-emerald-950 mt-2">{apt.treatment}</h4>
                          
                          <p className="text-xs text-gray-500 mt-2 font-mono flex items-center gap-1">
                            📅 {apt.date}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 font-mono flex items-center gap-1">
                            ⏰ {apt.time}
                          </p>
                        </div>

                        {/* Cancellation trigger */}
                        {apt.status !== 'cancelled' && (
                          <button
                            id={`cancel-apt-${apt.id}`}
                            onClick={() => handleCancelApt(apt.id)}
                            title="Cancel booked slot"
                            className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick summary invoice panel */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left text-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-emerald-950">Billing Statement</h3>
              
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between text-gray-500">
                  <span>Completed treatments cost:</span>
                  <span className="font-mono font-semibold">₹17,000</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Smile designing deposit:</span>
                  <span className="font-mono font-semibold">₹10,500</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-emerald-950">
                  <span>Total Paid (Tax Incl.):</span>
                  <span className="font-mono text-emerald-700">₹27,500</span>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-gray-400 font-mono block">
                  🛡️ Insured via Star Health | Direct Cashless Approved
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal-style detail light-box for Xrays */}
        <AnimatePresence>
          {activeXray && (
            <div id="xray-lightbox" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveXray(null)}
                className="absolute inset-0 bg-emerald-950/92 backdrop-blur-md cursor-pointer"
              />
              
              {/* Content box */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.38, bounce: 0.1 }}
                className="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl relative text-left z-10"
              >
                <div className="bg-gray-100 aspect-square sm:aspect-video w-full flex items-center justify-center relative bg-black">
                  <img 
                    src={activeXray.url} 
                    alt={activeXray.name} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-serif text-xl font-bold text-emerald-950">{activeXray.name}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">{activeXray.notes}</p>
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => setActiveXray(null)}
                      className="bg-emerald-950 hover:bg-emerald-900 text-white font-mono text-xs uppercase px-5 py-2.5 rounded-xl block font-bold transition-colors cursor-pointer"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
