/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState, addPatient, addClinicalRecord, addInvoice, showToast } from '../../store';
import { 
  Users, Search, Clipboard, FileText, Plus, ShieldCheck, User, Sparkles, 
  Settings, CheckCircle, Activity, Layout, Layers, Lock, Phone, Mail, Award, MapPin,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DentalRecord, UserProfile, Invoice } from '../../types';
import Dental3DReference from '../../components/Dental3DReference';
import CustomSelect from '../../components/CustomSelect';
import Dental3DViewer from '@/src/components/Dental3DViewer';

const TREATMENT_PRICES: Record<string, number> = {
  'Intraoral 3D Smile Mapping': 15000,
  'Painless Single-Sitting Root Canal': 12500,
  'Cosmetic Dental Veneer Bonding': 18000,
  'Full Arch Hygiene & Dental Polish': 4500,
  'Laser Bleaching / Whitening': 14000,
  'Zirconia Crown Fitting Operations': 16000,
  'Advanced Implant Osteotomy': 35000
};

interface NewPatientInputs {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
}

interface NewRecordInputs {
  treatmentType: string;
  notes: string;
  cost: number;
  attachmentName: string;
  attachmentType: 'X-Ray' | '3D Scan' | 'Photo';
}

export default function AdminPatients() {
  const dispatch = useDispatch();
  const patients = useSelector((state: RootState) => state.patients.list);
  const records = useSelector((state: RootState) => state.records.list);

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.patientId || '');
  const [patientSearch, setPatientSearch] = useState('');
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);

  // React Hook Form for New Patient Register
  const {
    register: registerPatient,
    handleSubmit: handlePatientSubmit,
    reset: resetPatient,
    setValue: setPatientValue,
    watch: watchPatient,
    formState: { errors: patientErrors }
  } = useForm<NewPatientInputs>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      age: 30,
      gender: 'Female'
    }
  });

  // React Hook Form for Add Clinical Entry
  const {
    register: registerRecord,
    handleSubmit: handleRecordSubmit,
    reset: resetRecord,
    setValue: setRecordValue,
    watch: watchRecord,
    formState: { errors: recordErrors }
  } = useForm<NewRecordInputs>({
    defaultValues: {
      treatmentType: 'Intraoral 3D Smile Mapping',
      notes: '',
      cost: 15000,
      attachmentName: 'clinical_radiograph_v4.jpg',
      attachmentType: 'X-Ray'
    }
  });

  const watchedTreatmentType = watchRecord('treatmentType');
  React.useEffect(() => {
    if (watchedTreatmentType && TREATMENT_PRICES[watchedTreatmentType] !== undefined) {
      setRecordValue('cost', TREATMENT_PRICES[watchedTreatmentType]);
    }
  }, [watchedTreatmentType, setRecordValue]);

  const activePatient = patients.find(p => p.patientId === selectedPatientId);
  const activePatientRecords = records.filter(r => r.patientId === selectedPatientId);

  // Filter patients by search
  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.patientId.toLowerCase().includes(patientSearch.toLowerCase())
  );

  // Handle registering new patient profile
  const onNewPatientSubmit = (data: NewPatientInputs) => {
    const newPatId = `BABEL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProfile: UserProfile = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      age: Number(data.age),
      gender: data.gender,
      patientId: newPatId,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    dispatch(addPatient(newProfile));
    dispatch(showToast({ message: `Successfully registered clinical file for ${data.fullName}`, type: 'success' }));
    setSelectedPatientId(newPatId);
    setIsNewPatientOpen(false);
    resetPatient();
  };

  // Handle building clinical diagnostic record
  const onRecordSubmit = (data: NewRecordInputs) => {
    if (selectedTeeth.length === 0) {
      dispatch(showToast({ message: `Critical Alert: You must select at least one tooth from the visual dental chart.`, type: 'error' }));
      return;
    }

    const newId = `REC-${Math.floor(100 + Math.random() * 900)}`;
    const costValue = Number(data.cost);
    
    // Unsplash simulation assets matching medical parameters
    const attachmentUrls = {
      '3D Scan': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=60',
      'X-Ray': 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?w=600&auto=format&fit=crop&q=60',
      'Photo': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=60'
    };

    const newRecord: DentalRecord = {
      id: newId,
      patientId: selectedPatientId,
      date: new Date().toISOString().split('T')[0],
      treatmentType: data.treatmentType,
      toothNumbers: selectedTeeth,
      notes: data.notes || 'No notes specified.',
      attachment: data.attachmentName ? {
        name: data.attachmentName,
        type: data.attachmentType,
        url: attachmentUrls[data.attachmentType]
      } : undefined,
      doctorName: 'Dr. Mehul Hasti Babel',
      cost: costValue
    };

    dispatch(addClinicalRecord(newRecord));

    // Also auto-generate fully synchronized invoice real-time
    if (activePatient) {
      const invId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      const sub = costValue;
      const taxRate = 0.18; // 18% standard dental GST
      const taxValue = Math.round(sub * taxRate);
      const discount = 0; // standard zero base
      const tot = sub + taxValue - discount;

      const newInv: Invoice = {
        id: invId,
        patientId: selectedPatientId,
        patientName: activePatient.fullName,
        date: new Date().toISOString().split('T')[0],
        items: [
          {
            description: `${data.treatmentType} (Associated Teeth: ${selectedTeeth.join(', ')})`,
            cost: sub
          }
        ],
        subtotal: sub,
        tax: taxValue,
        discount: discount,
        total: tot,
        status: 'pending'
      };

      dispatch(addInvoice(newInv));
    }

    dispatch(showToast({ message: `Appended diagnostic report ${newId} with tooth indices: ${selectedTeeth.join(', ')}`, type: 'success' }));
    setSelectedTeeth([]);
    resetRecord();
  };

  // Click tooth index handler
  const handleToggleTooth = (idx: string) => {
    if (selectedTeeth.includes(idx)) {
      setSelectedTeeth(selectedTeeth.filter(t => t !== idx));
    } else {
      setSelectedTeeth([...selectedTeeth, idx]);
    }
  };

  const treatmentOptions = [
    'Intraoral 3D Smile Mapping',
    'Painless Single-Sitting Root Canal',
    'Cosmetic Dental Veneer Bonding',
    'Full Arch Hygiene & Dental Polish',
    'Laser Bleaching / Whitening',
    'Zirconia Crown Fitting Operations',
    'Advanced Implant Osteotomy'
  ];

  // Visual schematic tooth groups (Classic ISO notation)
  const upperTeeth = Array.from({ length: 16 }, (_, i) => `#${i + 1}`);
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => `#${32 - i}`);

  return (
    <div id="admin-patients-registry" className="bg-[#FAF9F5] text-emerald-950 font-sans antialiased py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title workspace banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase bg-[#8B6B00]/10 text-amber-800 px-3 py-1 rounded-full font-bold">
              Patient Management Hub & Medical Charts
            </span>
            <h1 className="text-3xl font-serif font-bold text-emerald-950">Dental Patient Registry</h1>
            <p className="text-gray-400 text-xs font-light">Structure diagnostic procedures, edit dental anatomical layouts, and append clinical portfolios.</p>
          </div>
          <button
            onClick={() => setIsNewPatientOpen(true)}
            className="bg-emerald-950 hover:bg-emerald-900 text-white font-mono text-xs uppercase px-5 py-3 rounded-xl transition-all font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register Patient
          </button>
        </div>

        {/* Master Details Split Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar: Patients list */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="font-serif text-sm font-bold text-emerald-950">Active Patient Records</h3>
              <p className="text-gray-400 text-[11px] leading-snug">Click a patient record to load active diagnostics.</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search patient database..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none"
              />
            </div>

            {/* Scrollable checklist */}
            <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
              {filteredPatients.map(p => (
                <button
                  key={p.patientId}
                  onClick={() => setSelectedPatientId(p.patientId)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedPatientId === p.patientId
                      ? 'bg-emerald-50/50 border-emerald-500 shadow-xs'
                      : 'border-transparent hover:bg-neutral-50'
                  }`}
                >
                  <div className="space-y-1">
                    <h5 className="font-serif text-xs font-bold text-emerald-950">{p.fullName}</h5>
                    <p className="text-[10px] font-mono text-gray-400">{p.patientId} • {p.age}y/o • {p.gender}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${
                    selectedPatientId === p.patientId ? 'text-emerald-800 translate-x-1' : ''
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Interactive dental charts panel */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {activePatient ? (
                <motion.div
                  key={activePatient.patientId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  {/* Selected patient personal summary */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-[#FCFAF7] border border-amber-100 flex items-center justify-center text-amber-800 relative shadow-inner">
                        <User className="w-7 h-7" />
                        <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 text-[8px] font-mono font-bold bg-amber-500 text-white rounded">
                          H-A
                        </span>
                      </div>
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <h2 className="font-serif text-xl font-bold text-emerald-950">{activePatient.fullName}</h2>
                          <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded uppercase">
                            Active
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono">
                          Patient File Index: {activePatient.patientId} | Registered {activePatient.registeredAt}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-left border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                      <div>
                        <span className="block text-[9px] font-mono uppercase text-gray-400">Biological Age</span>
                        <span className="text-sm font-semibold font-serif text-emerald-950">{activePatient.age} Years</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-mono uppercase text-gray-400 font-bold">Gender</span>
                        <span className="text-sm font-semibold text-emerald-950">{activePatient.gender}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-mono uppercase text-gray-400 font-bold">Diagnoses</span>
                        <span className="text-sm font-mono font-bold text-amber-700">{activePatientRecords.length} files</span>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL INTERACTIVE DENTAL CHART */}
                  <div className="flex justify-center mb-8">
                    <div className="w-full max-w-2xl">
                      <Dental3DViewer 
                        selectedTeeth={selectedTeeth} 
                        onToggleTooth={handleToggleTooth} 
                      />
                    </div>
                  </div>

                  {/* DOUBLE COLLATERAL FORM: ADD RECORD */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Diagnostic record compiler form */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-left">
                      <div className="space-y-1">
                        <h3 className="font-serif text-base font-bold text-emerald-950">Compile Procedure Entry</h3>
                        <p className="text-gray-400 text-[11px]">Append visual digital attachment and treatment cost ledger.</p>
                      </div>

                      <form onSubmit={handleRecordSubmit(onRecordSubmit)} className="space-y-4">
                        <div className="space-y-1">
                          <div className="space-y-1">
                            <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                              Procedure Type
                            </label>
                            <input type="hidden" {...registerRecord('treatmentType')} />
                            <CustomSelect
                              value={watchRecord('treatmentType') || 'Intraoral 3D Smile Mapping'}
                              onChange={(val) => setRecordValue('treatmentType', val, { shouldValidate: true })}
                              placeholder="Choose procedure..."
                              options={treatmentOptions}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                            Pre-calculated Procedure Fee (₹)
                          </label>
                          <input
                            type="number"
                            placeholder="Cost in INR..."
                            className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50/50 focus:outline-none"
                            {...registerRecord('cost', { required: 'Cost is required', min: 0 })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                              Attachment label
                            </label>
                            <input
                              type="text"
                              className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50/50 focus:outline-none"
                              {...registerRecord('attachmentName')}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                              Attachment Type
                            </label>
                            <input type="hidden" {...registerRecord('attachmentType')} />
                            <CustomSelect
                              value={watchRecord('attachmentType') || 'X-Ray'}
                              onChange={(val) => setRecordValue('attachmentType', val as 'X-Ray' | '3D Scan' | 'Photo', { shouldValidate: true })}
                              placeholder="Choose attachment..."
                              options={[
                                { value: "X-Ray", label: "Radiograph X-Ray" },
                                { value: "3D Scan", label: "Intraoral 3D Scan" },
                                { value: "Photo", label: "Aesthetic Photo" }
                              ]}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                            Diagnostic Observations
                          </label>
                          <textarea
                            placeholder="Observations, prognosis, & surgical parameters..."
                            className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50/50 h-20 resize-none focus:outline-none"
                            {...registerRecord('notes', { required: 'Observations are required' })}
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-mono text-[10px] font-bold uppercase py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                          Push Record to file
                        </button>
                      </form>
                    </div>

                    {/* Historical Clinical Records list */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="font-serif text-base font-bold text-emerald-950">Diagnostic Treatment History</h3>
                        <p className="text-gray-400 text-[11px]">Historical cases cataloged under HIPAA criteria.</p>
                      </div>

                      <div className="space-y-3 flex-grow mt-3 overflow-y-auto max-h-[350px] pr-1">
                        {activePatientRecords.length === 0 ? (
                          <div className="py-12 border border-dashed rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                            <FileCheck className="w-8 h-8 text-amber-600 mb-1" />
                            <span className="text-[10px] font-mono font-bold uppercase">No database records</span>
                            <span className="text-[10px] text-gray-400 font-light mt-0.5">Push a new procedure on the left.</span>
                          </div>
                        ) : (
                          activePatientRecords.map(rec => (
                            <div key={rec.id} className="p-3.5 bg-gray-50/50 border rounded-2xl space-y-2 text-xs text-left">
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-emerald-700 uppercase bg-amber-500/10 px-2 py-0.5 rounded text-[9px]">
                                  {rec.treatmentType}
                                </span>
                                <span className="text-[9px] text-gray-400 font-mono">{rec.date}</span>
                              </div>
                              <p className="font-sans text-gray-500 font-light text-[11px] leading-relaxed">
                                {rec.notes}
                              </p>
                              <div className="text-[10px] font-mono text-emerald-950/70">
                                <strong>Teeth coordinated:</strong> {rec.toothNumbers.join(', ')}
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t font-mono text-[9px] text-gray-400">
                                <span>Fee: ₹{rec.cost.toLocaleString('en-IN')}</span>
                                {rec.attachment && (
                                  <span className="text-[#8B6B00]">📎 {rec.attachment.name}</span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                </motion.div>
              ) : (
                <div className="text-center py-20 bg-white border rounded-3xl text-gray-400">
                  <span className="text-sm font-mono uppercase bg-red-50 text-red-700 px-3 py-1.5 rounded-full font-bold">
                    Database empty
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Modal Window: Register Patient */}
        <AnimatePresence>
          {isNewPatientOpen && (
            <div id="new-patient-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNewPatientOpen(false)}
                className="absolute inset-0 bg-emerald-950/70 backdrop-blur-sm cursor-pointer"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ type: "spring", duration: 0.35 }}
                className="bg-white max-w-md w-full rounded-3xl overflow-hidden shadow-2xl relative text-left z-10 p-6 md:p-8 space-y-4 border"
              >
                <div className="border-b pb-3 space-y-1">
                  <h3 className="font-serif text-xl font-bold text-emerald-950 flex items-center gap-1.5">
                    <Users className="w-5 h-5 text-amber-600" />
                    Register Dental File
                  </h3>
                  <p className="text-gray-450 text-xs">Create standard HIPAA ledger coordinates for the patient</p>
                </div>

                <form onSubmit={handlePatientSubmit(onNewPatientSubmit)} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      className={`block w-full border ${patientErrors.fullName ? 'border-red-500' : 'border-gray-200'} rounded-xl px-3 py-2 text-xs focus:outline-none bg-gray-50/50`}
                      {...registerPatient('fullName', { required: 'Name is required' })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. sharma.rahul@gmail.com"
                      className={`block w-full border ${patientErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl px-3 py-2 text-xs focus:outline-none bg-gray-50/50`}
                      {...registerPatient('email', { required: 'Email is required' })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                        Phone Contact
                      </label>
                      <input
                        type="text"
                        placeholder="+91 98200..."
                        className={`block w-full border ${patientErrors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl px-3 py-2 text-xs focus:outline-none bg-gray-50/50`}
                        {...registerPatient('phone', { required: 'Phone is required' })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                        Biological Age
                      </label>
                      <input
                        type="number"
                        className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none bg-gray-50/50"
                        {...registerPatient('age', { required: 'Age is required' })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                      Gender Identity
                    </label>
                    <input type="hidden" {...registerPatient('gender')} />
                    <CustomSelect
                      value={watchPatient('gender') || 'Female'}
                      onChange={(val) => setPatientValue('gender', val)}
                      placeholder="Choose gender..."
                      options={[
                        { value: 'Female', label: 'Female' },
                        { value: 'Male', label: 'Male' },
                        { value: 'Other', label: 'Other' }
                      ]}
                    />
                  </div>

                  <div className="pt-2 border-t flex justify-end gap-3 font-mono">
                    <button
                      type="button"
                      onClick={() => setIsNewPatientOpen(false)}
                      className="bg-gray-150 hover:bg-gray-200 text-gray-600 text-[11px] uppercase font-bold px-4 py-2.5 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-950 hover:bg-emerald-900 text-white text-[11px] uppercase font-bold px-4 py-2.5 rounded-lg cursor-pointer"
                    >
                      Authorize file
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

// Simple Helper mock inline icon
function FileCheck(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}
