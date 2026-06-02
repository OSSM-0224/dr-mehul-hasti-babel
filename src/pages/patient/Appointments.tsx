/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState, addLocalAppointment, cancelAppointmentThunk, showToast, setPath } from '../../store';
import { Calendar, Trash2, CheckCircle2, ChevronRight, LockKeyhole, Plus, HelpCircle, User } from 'lucide-react';
import { Appointment } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import CustomSelect from '../../components/CustomSelect';

interface BookSlotForm {
  treatment: string;
  date: string;
  timeSlot: string;
  notes: string;
}

export default function Appointments() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { list: appointments } = useSelector((state: RootState) => state.appointments);

  const { register, handleSubmit, reset, setValue, watch } = useForm<BookSlotForm>();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  if (!user) {
    return (
      <div id="protected-appointments" className="bg-[#FAF9F5] py-24 px-4 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
            <LockKeyhole className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-emerald-950">Patient Authentication Required</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Verify your patient identifier and mobile logs to schedule treatment sessions or modify booked slots.
            </p>
          </div>
          <button
            onClick={() => dispatch(setPath('home'))}
            className="w-full bg-emerald-950 text-white font-serif tracking-wider uppercase text-xs py-3.5 rounded-xl hover:bg-amber-800 transition-colors"
          >
            Go to Homepage & Register
          </button>
        </div>
      </div>
    );
  }

  const handleCancel = async (id: string) => {
    if (confirm('Cancel your dental appointment slot? Our team will release this hour.')) {
      await dispatch(cancelAppointmentThunk(id) as any);
      dispatch(showToast({ message: 'Appointment status updated to cancelled.', type: 'error' }));
    }
  };

  const handleBookSlot = (data: BookSlotForm) => {
    const newId = `APT-${Math.floor(100 + Math.random() * 900)}`;
    const newApt: Appointment = {
      id: newId,
      patientName: user.fullName,
      mobileNumber: user.phone,
      treatment: data.treatment,
      date: data.date,
      time: data.timeSlot,
      status: 'pending',
      notes: data.notes,
      doctorName: 'Dr. Mehul Hasti Babel'
    };

    dispatch(addLocalAppointment(newApt));
    dispatch(showToast({ message: `Successfully booked pending slot ${newId} for ${data.date}.`, type: 'success' }));
    reset();
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      id="appointments-panel-scroll" 
      className="bg-[#FAF9F5] text-emerald-950 font-sans antialiased py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="text-left space-y-2">
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded block w-fit">
            TREATMENT SCHEDULES
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-emerald-950">
            Secure Service <span className="font-normal italic text-amber-800">Booking Board</span>
          </h1>
        </div>

        {/* Inner page Subnav */}
        <div className="flex border-b border-gray-200 gap-6 text-sm">
          <button 
            onClick={() => dispatch(setPath('patient/dashboard'))}
            className="border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-emerald-900 pb-2.5 uppercase tracking-wider text-xs"
          >
            My Care Board
          </button>
          <button 
            onClick={() => dispatch(setPath('patient/appointments'))}
            className="border-b-2 border-amber-800 font-bold pb-2.5 text-emerald-950 uppercase tracking-wider text-xs"
          >
            Schedules ({appointments.length})
          </button>
          <button 
            onClick={() => dispatch(setPath('patient/records'))}
            className="border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-emerald-900 pb-2.5 uppercase tracking-wider text-xs"
          >
            Diagnostics ({recordsCount => 3})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Left Forms: 5 Columns */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-1.5">
              <h3 className="font-serif text-lg font-bold text-emerald-950 flex items-center gap-1.5">
                <Plus className="w-5 h-5 text-amber-700" /> Book Suite Hour
              </h3>
              <p className="text-gray-500 text-xs font-light">
                Secure an executive treatment slot with Dr. Mehul Hasti Babel in Mumbai.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleBookSlot)} className="space-y-4">
              
              {/* Treatment list */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                  Select Treatment
                </label>
                <input type="hidden" {...register("treatment", { required: true })} />
                <CustomSelect
                  value={watch("treatment") || ""}
                  onChange={(val) => setValue("treatment", val, { shouldValidate: true })}
                  placeholder="Choose treatment..."
                  options={[
                    { value: "Smile Designing", label: "Smile Designing Veneer Fitting" },
                    { value: "Implant Setup", label: "CBCT Guided Dental Implant" },
                    { value: "Hygiene Polish", label: "6 Step Cavitation Prophylaxis" },
                    { value: "Painless Root Canal", label: "Rotary Root Canal Sitting" }
                  ]}
                />
              </div>

              {/* Target Date selection */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                  Treatment Date
                </label>
                <input 
                  id="slot-date"
                  type="date"
                  required
                  {...register("date", { required: true })}
                  className="block w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50/50"
                />
              </div>

              {/* Time slot selection */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                  Hour Slot
                </label>
                <input type="hidden" {...register("timeSlot", { required: true })} />
                <CustomSelect
                  value={watch("timeSlot") || ""}
                  onChange={(val) => setValue("timeSlot", val, { shouldValidate: true })}
                  placeholder="Choose hour slot..."
                  options={[
                    { value: "10:00 AM", label: "10:00 AM - Premium Morning" },
                    { value: "11:30 AM", label: "11:30 AM - Clinical Midday" },
                    { value: "03:00 PM", label: "03:00 PM - Afternoon Slot" },
                    { value: "05:30 PM", label: "05:30 PM - High-Floor Sunset" }
                  ]}
                />
              </div>

              {/* Optional comments notes */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                  Diagnostic Remarks (Optional)
                </label>
                <textarea 
                  id="slot-notes"
                  rows={2}
                  placeholder="Sensitive tooth margins, local anesthetic remarks..."
                  {...register("notes")}
                  className="block w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50/50 resize-none animate-none"
                ></textarea>
              </div>

              <button
                id="btn-confirm-slot"
                type="submit"
                className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-serif tracking-wider uppercase text-xs py-3.5 rounded-xl font-bold transition-all shadow-md mt-6"
              >
                Schedule slot
              </button>

            </form>
          </div>

          {/* Right Schedules Listing Grid: 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Filters */}
            <div className="flex flex-wrap gap-1.5 bg-white p-2 border border-gray-100 rounded-xl w-fit">
              {[
                { id: 'all', label: 'All Booking' },
                { id: 'pending', label: 'Triage Pending' },
                { id: 'confirmed', label: 'Confirmed' },
                { id: 'cancelled', label: 'Cancelled' }
              ].map((btn) => (
                <button
                  id={`btn-filter-apt-${btn.id}`}
                  key={btn.id}
                  onClick={() => setFilter(btn.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                    filter === btn.id
                      ? 'bg-emerald-950 text-white shadow-sm'
                      : 'text-gray-500 hover:text-emerald-950'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 text-gray-400 text-sm">
                <p>No slot records found for this filter category.</p>
              </div>
            ) : (
              <motion.div layout className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.3 }}
                      key={item.id} 
                      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {/* Color sidebar strip indicators */}
                      <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                        item.status === 'confirmed' ? 'bg-emerald-600' : item.status === 'pending' ? 'bg-amber-600' : 'bg-red-500'
                      }`}></div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">{item.id}</span>
                          <span className={`text-[9px] font-mono tracking-wider uppercase font-bold px-2 py-0.5 rounded ${
                            item.status === 'confirmed' ? 'bg-emerald-55 text-emerald-800' : item.status === 'pending' ? 'bg-amber-55 text-[#8B6B00]' : 'bg-red-55 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        
                        <h4 className="font-serif text-base font-bold text-emerald-950">{item.treatment}</h4>
                        <p className="text-xs text-gray-500 font-mono">
                          Date: {item.date} | Hour: {item.time}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-gray-500 font-light mt-1.5 italic bg-[#FAF9F5] p-2.5 rounded-lg border border-[#FAF9F5]">
                            "{item.notes}"
                          </p>
                        )}
                      </div>

                      {/* Actions block to Cancel */}
                      {item.status !== 'cancelled' ? (
                        <button
                          id={`btn-cancel-action-${item.id}`}
                          onClick={() => handleCancel(item.id)}
                          className="text-white bg-red-800 hover:bg-red-900 border border-transparent font-mono text-[10px] font-bold px-3 py-2 rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Cancel Slot
                        </button>
                      ) : (
                        <div className="text-xs font-mono text-red-600 font-bold bg-red-50 px-2.5 py-1.5 rounded-xl border border-red-100 shrink-0 select-none">
                          Cancelled
                        </div>
                      )}

                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </motion.div>
  );
}
