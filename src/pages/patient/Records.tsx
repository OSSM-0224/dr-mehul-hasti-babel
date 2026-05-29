/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setPath, showToast } from '../../store';
import { FileText, Award, Layers, ShieldCheck, Download, Sparkles, Activity, FileCheck, LockKeyhole } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Records() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { list: records } = useSelector((state: RootState) => state.records);

  const [selectedTooth, setSelectedTooth] = useState<string | null>('#14');

  if (!user) {
    return (
      <div id="protected-records" className="bg-[#FAF9F5] py-24 px-4 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
            <LockKeyhole className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-emerald-950">Patient Authentication Required</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Verify your patient identifier and mobile logs to schedule treatment sessions or view dental records.
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

  // Interactive tooth list for styling clinical charts
  const upperTeeth = [
    { num: '#18', name: 'Upper Right 3rd Molar', status: 'healthy' },
    { num: '#16', name: 'Upper Right 1st Molar', status: 'healthy' },
    { num: '#14', name: 'Upper Right 1st Premolar', status: 'root-canal' },
    { num: '#11', name: 'Upper Right Restored Central Incisor', status: 'veneer-planning' },
    { num: '#21', name: 'Upper Left Restored Central Incisor', status: 'veneer-planning' },
    { num: '#24', name: 'Upper Left 1st Premolar', status: 'healthy' },
    { num: '#26', name: 'Upper Left 1st Molar', status: 'healthy' },
    { num: '#28', name: 'Upper Left 3rd Molar', status: 'healthy' }
  ];

  const getToothClass = (status: string, num: string) => {
    const isSelected = selectedTooth === num;
    let base = "p-3 font-mono text-xs font-bold rounded-xl border transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 ";
    
    if (isSelected) {
      base += "border-amber-800 bg-amber-50 shadow-inner scale-105 ring-2 ring-amber-700/10 ";
    } else {
      if (status === 'root-canal') {
        base += "border-rose-100 bg-rose-50/75 text-rose-800 hover:bg-rose-100 ";
      } else if (status === 'veneer-planning') {
        base += "border-amber-100 bg-amber-50/50 text-amber-800 hover:bg-amber-100 ";
      } else {
        base += "border-emerald-150 bg-emerald-50/30 text-emerald-900 hover:bg-emerald-50 ";
      }
    }
    return base;
  };

  const selectedToothReport = selectedTooth === '#14' 
    ? {
        tooth: '#14 Upper Molar/Premolar Area',
        diagnosis: "Completed Painless Single-Sitting Root Canal with automated apex sealing.",
        findings: "Operative sealing verified on dental X-Ray. Healthy bone surrounding dual canal routes.",
        nextSteps: "Secure with premium porcelain CAD/CAM dental crown custom milled at Lower Parel laboratory."
      }
    : selectedTooth === '#11' || selectedTooth === '#21'
    ? {
        tooth: `${selectedTooth} Incisor Smile Line`,
        diagnosis: "Diagnostic mapping processed for custom E.Max porcelain veneers fitting.",
        findings: "Sub-millimeter tooth enamel contour alignment. Symmetric proportions mapped to golden ratio algorithms.",
        nextSteps: "Prepare trial shade mockup layers on next clinical appointment."
      }
    : {
        tooth: `${selectedTooth} Tooth`,
        diagnosis: "Healthy clinical tooth structure.",
        findings: "Intraoral scan records normal enamel margins, clear decay margins.",
        nextSteps: "Routine digital scanning on scheduled 6-month hygiene recall sittings."
      };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      id="records-view-scroll" 
      className="bg-[#FAF9F5] text-emerald-950 font-sans antialiased py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner with patient info */}
        <div className="text-left space-y-2">
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded block w-fit">
            DIGITAL HEALTH RECORDS
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-emerald-950">
            Electronic Dental <span className="font-normal italic text-amber-800 font-serif">Diagnostic Chart</span>
          </h1>
        </div>

        {/* Inner subnav bar */}
        <div className="flex border-b border-gray-200 gap-6 text-sm">
          <button 
            onClick={() => dispatch(setPath('patient/dashboard'))}
            className="border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-emerald-900 pb-2.5 uppercase tracking-wider text-xs"
          >
            My Care Board
          </button>
          <button 
            onClick={() => dispatch(setPath('patient/appointments'))}
            className="border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-emerald-900 pb-2.5 uppercase tracking-wider text-xs"
          >
            Schedules ({recordsCount => 3})
          </button>
          <button 
            onClick={() => dispatch(setPath('patient/records'))}
            className="border-b-2 border-amber-800 font-bold pb-2.5 text-emerald-950 uppercase tracking-wider text-xs"
          >
            Diagnostics ({records.length})
          </button>
        </div>

        {/* 1. INTERACTIVE DIGITAL ARCH CHART MAPPING (True premium visual addition) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-left">
          <div className="space-y-1.5">
            <h3 className="font-serif text-lg font-bold text-emerald-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-700" /> Clinical Dental Arch Charting
            </h3>
            <p className="text-gray-500 text-xs font-light">
              Click individual teeth indexes to load active digital findings & diagnostic reports dynamically from clinical folders.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-4">
            {upperTeeth.map((t) => (
              <div 
                key={t.num}
                onClick={() => setSelectedTooth(t.num)}
                className={getToothClass(t.status, t.num)}
              >
                <span className="text-sm font-bold block">{t.num}</span>
                <span className="text-[9px] uppercase tracking-wider block font-medium opacity-80 truncate max-w-[100px]">
                  {t.status === 'root-canal' ? '📍 Root Canal' : t.status === 'veneer-planning' ? '✨ Veneer Plan' : 'Healthy'}
                </span>
              </div>
            ))}
          </div>

          {/* Tooth report details box */}
          <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-6 relative min-h-[160px] items-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedTooth}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="space-y-3 flex-1"
              >
                <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-amber-700">
                  ACTIVE REPORT FOR {selectedToothReport.tooth}
                </p>
                <h4 className="font-serif text-base font-bold text-emerald-950">
                  {selectedToothReport.diagnosis}
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light font-sans">
                  <strong>Observations:</strong> {selectedToothReport.findings}
                </p>
                <p className="text-xs text-emerald-900 font-mono">
                  <strong className="text-amber-800">Prognosis & next action:</strong> {selectedToothReport.nextSteps}
                </p>
              </motion.div>
            </AnimatePresence>
            
            <div className="shrink-0 flex items-end">
              <span className="text-[10px] font-mono text-gray-400 bg-white border px-3 py-1.5 rounded-lg flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Digital Twin Match
              </span>
            </div>
          </div>
        </div>

        {/* 2. HISTORY CLINICAL LOG CARDS */}
        <div className="space-y-6 text-left">
          <h3 className="font-serif text-lg font-bold text-emerald-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-700" /> Diagnostic History Logs ({records.length})
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {records.map((rec) => (
              <div 
                key={rec.id} 
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow relative text-left flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">{rec.id} | {rec.date}</span>
                      <h4 className="font-serif text-base font-bold text-emerald-950 mt-1">{rec.treatmentType}</h4>
                    </div>
                    <span className="text-sm font-mono text-emerald-700 font-bold bg-[#FAF9F5] px-3 py-1 rounded border border-gray-100">
                      ₹{rec.cost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">
                    {rec.notes}
                  </p>

                  <div className="text-[11px] font-mono text-gray-400">
                    Lead Clinician: <strong className="text-emerald-900">{rec.doctorName}</strong> | Indices: {rec.toothNumbers.join(', ')}
                  </div>
                </div>

                {/* Optional attachment files click */}
                {rec.attachment && (
                  <div className="border-t border-gray-50 pt-4 flex justify-between items-center text-xs">
                    <span className="text-gray-400 flex items-center gap-1.5 font-mono">
                      📎 {rec.attachment.name}
                    </span>
                    <button
                      onClick={() => {
                        dispatch(showToast({ message: `Initiating secure HIPAA extraction code for file: ${rec.attachment?.name}`, type: 'success' }));
                      }}
                      className="text-amber-800 hover:text-amber-900 font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Direct Download
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
