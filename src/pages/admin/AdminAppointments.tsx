/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState, addLocalAppointment, updateAppointmentStatus, showToast } from '../../store';
import { 
  Calendar, Trash2, CheckCircle2, ChevronRight, Search, Filter, Plus, 
  HelpCircle, User, Phone, Clipboard, Clock, X, CheckSquare, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Appointment } from '../../types';
import CustomSelect from '../../components/CustomSelect';

interface NewSlotInputs {
  patientName: string;
  mobileNumber: string;
  treatment: string;
  date: string;
  time: string;
  notes: string;
}

export default function AdminAppointments() {
  const dispatch = useDispatch();
  const appointments = useSelector((state: RootState) => state.appointments.list);
  const patients = useSelector((state: RootState) => state.patients.list);

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewSlotInputs>({
    defaultValues: {
      patientName: '',
      mobileNumber: '',
      treatment: 'Smile Designing Suite',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
      notes: ''
    }
  });

  // Filter and Search logic
  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = activeFilter === 'all' || apt.status === activeFilter;
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = (id: string, status: Appointment['status']) => {
    dispatch(updateAppointmentStatus({ id, status }));
    dispatch(showToast({ message: `Slot status updated to ${status} successfully.`, type: 'success' }));
  };

  const onSubmit = (data: NewSlotInputs) => {
    const newId = `APT-${Math.floor(100 + Math.random() * 900)}`;
    const newApt: Appointment = {
      id: newId,
      patientName: data.patientName,
      mobileNumber: data.mobileNumber,
      treatment: data.treatment,
      date: data.date,
      time: data.time,
      status: 'confirmed', // Admin direct scheduling can default to confirmed
      notes: data.notes,
      doctorName: 'Dr. Mehul Hasti Custom'
    };

    dispatch(addLocalAppointment(newApt));
    dispatch(showToast({ message: `Scheduled & confirmed slot ${newId} for ${data.patientName}`, type: 'success' }));
    setIsAddOpen(false);
    reset();
  };

  const fillPatientDetails = (patId: string) => {
    const pat = patients.find(p => p.patientId === patId);
    if (pat) {
      setValue('patientName', pat.fullName);
      setValue('mobileNumber', pat.phone);
      dispatch(showToast({ message: `Autofilled details for: ${pat.fullName}`, type: 'success' }));
    }
  };

  const treatmentOptions = [
    'Smile Designing Suite',
    'Laser Root Canal Therapy',
    'Ultrasonic Scaling & Clean',
    'Nobel Dental Implant Suite',
    '3D Veneer Fitting',
    'Consultation & Radiograph'
  ];

  return (
    <div id="admin-appointments-screen" className="bg-[#FAF9F5] text-emerald-950 font-sans antialiased py-8 space-y-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-bold">
              Scheduler Workspace
            </span>
            <h1 className="text-3xl font-serif font-bold text-emerald-950">Appointments Matrix</h1>
            <p className="text-gray-400 text-xs font-light">Control, register, search, and validate clinical appointments.</p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-emerald-950 hover:bg-emerald-900 text-white font-mono text-xs uppercase px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Schedule Visit
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Filters */}
          <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((filterOpt) => (
              <button
                key={filterOpt}
                onClick={() => setActiveFilter(filterOpt)}
                className={`flex-1 md:flex-none uppercase font-mono text-[10px] font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeFilter === filterOpt 
                    ? 'bg-emerald-950 text-white shadow-xs' 
                    : 'text-gray-500 hover:text-emerald-950'
                }`}
              >
                {filterOpt}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by ID or Patient Name..."
              className="block w-full pl-10 pr-3 py-2 text-xs border border-gray-100 bg-white shadow-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid or list of appointments */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed rounded-3xl text-gray-400">
              <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="font-mono text-sm uppercase font-bold text-gray-500">No scheduled slots found</p>
              <p className="text-xs text-gray-400 font-light mt-0.5">Try altering the search query or status filter.</p>
            </div>
          ) : (
            <motion.div layout className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredAppointments.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -12 }}
                    transition={{ duration: 0.28 }}
                    key={item.id}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
                  >
                    {/* Status side indicators */}
                    <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                      item.status === 'confirmed' ? 'bg-emerald-600' :
                      item.status === 'completed' ? 'bg-blue-600' :
                      item.status === 'pending' ? 'bg-amber-600' : 'bg-red-500'
                    }`}></div>

                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">{item.id}</span>
                        <span className={`text-[9px] font-mono tracking-wider uppercase font-bold px-2 py-0.5 rounded ${
                          item.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800' :
                          item.status === 'completed' ? 'bg-blue-50 text-blue-800' :
                          item.status === 'pending' ? 'bg-amber-50 text-[#8B6B00]' : 'bg-red-50 text-red-850'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          Registered via direct clinic portal
                        </span>
                      </div>

                      <h4 className="font-serif text-lg font-bold text-emerald-950">{item.patientName}</h4>
                      <p className="text-xs text-gray-500 font-mono">
                        Treatment: {item.treatment} | Primary Operator: {item.doctorName}
                      </p>
                      
                      <div className="flex gap-4 items-center text-xs text-emerald-900 font-mono">
                        <span className="bg-[#FAF9F5] px-2.5 py-1 rounded-lg border">📅 {item.date}</span>
                        <span className="bg-[#FAF9F5] px-2.5 py-1 rounded-lg border">⏰ {item.time}</span>
                        <span>📞 {item.mobileNumber}</span>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-gray-500 font-light italic mt-1 bg-[#FAF9F5] p-3 rounded-xl border border-gray-100">
                          "{item.notes}"
                        </p>
                      )}
                    </div>

                    {/* Admin Action commands */}
                    <div className="flex flex-wrap md:flex-col gap-2 shrink-0 justify-end">
                      {item.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'confirmed')}
                          className="bg-emerald-800 hover:bg-emerald-900 border text-white font-mono text-[10px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                        >
                          Confirm
                        </button>
                      )}
                      
                      {item.status !== 'completed' && item.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'completed')}
                          className="bg-blue-800 hover:bg-blue-950 text-white font-mono text-[10px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                        >
                          Mark Complete
                        </button>
                      )}

                      {item.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'cancelled')}
                          className="bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 font-mono text-[10px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                        >
                          Cancel Slot
                        </button>
                      )}

                      {item.status === 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'confirmed')}
                          className="bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Direct Restore
                        </button>
                      )}
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Modal-style detail light-box for scheduling appointments */}
        <AnimatePresence>
          {isAddOpen && (
            <div id="scheduler-drawer-backdrop" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddOpen(false)}
                className="absolute inset-0 bg-emerald-950/70 backdrop-blur-sm cursor-pointer"
              />
              
              {/* Box */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ type: "spring", duration: 0.35 }}
                className="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl relative text-left z-10 p-6 md:p-8 space-y-4 border border-[#8B6B00]/10"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-emerald-950 flex items-center gap-1.5">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      Studio Schedule Suite
                    </h3>
                    <p className="text-gray-400 text-xs">Direct clinician scheduling endpoint</p>
                  </div>
                  <button 
                    onClick={() => setIsAddOpen(false)}
                    className="p-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Pre-fill database helpers */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-amber-800 font-bold tracking-wider">
                    Select & Autofill Registered Client details
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {patients.map(p => (
                      <button
                        key={p.patientId}
                        type="button"
                        onClick={() => fillPatientDetails(p.patientId)}
                        className="bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/50 text-[10px] font-mono px-2.5 py-1.5 rounded-lg text-emerald-800 font-bold transition-all cursor-pointer"
                      >
                        ⚡ {p.fullName}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Patient Name */}
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        placeholder="Type full name..."
                        className={`block w-full border ${errors.patientName ? 'border-red-500' : 'border-gray-200'} rounded-xl px-3 py-2 text-sm bg-gray-50/50 focus:outline-none`}
                        {...register('patientName', { required: 'Name is required' })}
                      />
                    </div>

                    {/* Patient Phone */}
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        placeholder="+91 90000 00000"
                        className={`block w-full border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl px-3 py-2 text-sm bg-gray-50/50 focus:outline-none`}
                        {...register('mobileNumber', { required: 'Mobile is required' })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date */}
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                        Date Picker
                      </label>
                      <input
                        type="date"
                        className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50/50 focus:outline-none"
                        {...register('date', { required: 'Date is required' })}
                      />
                    </div>

                     {/* Time */}
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                        Hour slot
                      </label>
                      <input type="hidden" {...register('time')} />
                      <CustomSelect
                        value={watch('time') || '11:00 AM'}
                        onChange={(val) => setValue('time', val, { shouldValidate: true })}
                        placeholder="Choose time..."
                        options={[
                          '10:00 AM',
                          '11:00 AM',
                          '12:30 PM',
                          '02:00 PM',
                          '03:30 PM',
                          '04:30 PM',
                          '05:00 PM'
                        ]}
                      />
                    </div>
                  </div>

                  {/* Treatment */}
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                      Primary treatment target
                    </label>
                    <input type="hidden" {...register('treatment')} />
                    <CustomSelect
                      value={watch('treatment') || 'Smile Designing Suite'}
                      onChange={(val) => setValue('treatment', val, { shouldValidate: true })}
                      placeholder="Choose treatment..."
                      options={treatmentOptions}
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                      Surgical/Clinical Notes
                    </label>
                    <textarea
                      placeholder="Add anatomical parameters, aesthetic notes, etc."
                      className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50/50 h-20 resize-none focus:outline-none"
                      {...register('notes')}
                    />
                  </div>

                  <div className="pt-2 border-t flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddOpen(false)}
                      className="bg-gray-100 hover:bg-gray-200 font-mono text-xs uppercase px-4 py-3 rounded-xl block font-bold transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-950 hover:bg-emerald-900 text-white font-mono text-xs uppercase px-5 py-3 rounded-xl block font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Confirm Schedule
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
