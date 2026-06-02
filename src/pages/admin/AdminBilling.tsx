/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState, addInvoice, payInvoiceAction, showToast } from '../../store';
import { 
  FileText, IndianRupee, Printer, Plus, ShieldCheck, User, Sparkles, 
  Trash2, Send, Download, Percent, AlertCircle, FileSpreadsheet, Layers, CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Invoice } from '../../types';

interface NewInvoiceInputs {
  patientId: string;
  itemDescription: string;
  itemCost: number;
  discount: number;
}

export default function AdminBilling() {
  const dispatch = useDispatch();
  const invoices = useSelector((state: RootState) => state.invoices.list);
  const patients = useSelector((state: RootState) => state.patients.list);

  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(invoices[0] || null);
  const [viewingHistoric, setViewingHistoric] = useState<boolean>(false);
  const [discountRate, setDiscountRate] = useState<number>(10); // Percent
  const [selectedPatId, setSelectedPatId] = useState<string>(patients[0]?.patientId || '');

  // Form setup using react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewInvoiceInputs>({
    defaultValues: {
      patientId: patients[0]?.patientId || '',
      itemDescription: 'Intraoral 3D Smile Mapping',
      itemCost: 15000,
      discount: 1500,
    }
  });

  const records = useSelector((state: RootState) => state.records.list);
  const watchedPatientId = watch('patientId');
  const watchedDescription = watch('itemDescription');

  React.useEffect(() => {
    if (watchedPatientId) {
      const patientRecords = records.filter(r => r.patientId === watchedPatientId);
      if (patientRecords.length > 0) {
        const latestRecord = patientRecords[0];
        const teethPart = latestRecord.toothNumbers && latestRecord.toothNumbers.length > 0
          ? `(Associated Teeth: ${latestRecord.toothNumbers.join(', ')})`
          : '';
        setValue('itemDescription', `${latestRecord.treatmentType} ${teethPart}`.trim());
        setValue('itemCost', latestRecord.cost);
        setValue('discount', Math.round(latestRecord.cost * 0.1));
      }
    }
  }, [watchedPatientId, records, setValue]);

  // Watch itemCost for live calculations
  const watchedCost = watch('itemCost') || 0;
  const watchedDiscount = watch('discount') || 0;

  // Real-time tax calculator
  const taxRate = 0.18; // 18% GST general dental tax
  const subtotalLive = Number(watchedCost);
  const taxLive = Math.round(subtotalLive * taxRate);
  const totalLive = Math.max(0, subtotalLive + taxLive - Number(watchedDiscount));

  // Whenever user interacts with form inputs, automatically focus preview towards the live compilation draft
  React.useEffect(() => {
    setViewingHistoric(false);
  }, [watchedPatientId, watchedDescription, watchedCost, watchedDiscount]);

  const liveDraftInvoice = React.useMemo(() => {
    const selectedPatient = patients.find(p => p.patientId === watchedPatientId);
    const sub = Number(watchedCost) || 0;
    const taxVal = Math.round(sub * taxRate);
    const disc = Number(watchedDiscount) || 0;
    const tot = Math.max(0, sub + taxVal - disc);

    return {
      id: 'DRAFT-NEW',
      patientId: watchedPatientId || 'N/A',
      patientName: selectedPatient?.fullName || 'Select Patient',
      date: new Date().toISOString().split('T')[0],
      items: [
        { description: watchedDescription || 'Treatment procedure', cost: sub }
      ],
      subtotal: sub,
      tax: taxVal,
      discount: disc,
      total: tot,
      status: 'pending' as const
    } as Invoice;
  }, [watchedPatientId, watchedDescription, watchedCost, watchedDiscount, patients]);

  const previewInvoice = viewingHistoric && activeInvoice ? activeInvoice : liveDraftInvoice;

  const handleSelectHistoric = (inv: Invoice) => {
    setActiveInvoice(inv);
    setViewingHistoric(true);
  };

  const onSubmit = (data: NewInvoiceInputs) => {
    const selectedPatient = patients.find(p => p.patientId === data.patientId);
    if (!selectedPatient) return;

    const newId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const sub = Number(data.itemCost);
    const taxValue = Math.round(sub * taxRate);
    const disc = Number(data.discount);
    const tot = Math.max(0, sub + taxValue - disc);

    const newInv: Invoice = {
      id: newId,
      patientId: data.patientId,
      patientName: selectedPatient.fullName,
      date: new Date().toISOString().split('T')[0],
      items: [
        { description: data.itemDescription, cost: sub }
      ],
      subtotal: sub,
      tax: taxValue,
      discount: disc,
      total: tot,
      status: 'pending'
    };

    dispatch(addInvoice(newInv));
    dispatch(showToast({ message: `Invoice ${newId} compiled. Grand Total: ₹${tot.toLocaleString('en-IN')}`, type: 'success' }));
    setActiveInvoice(newInv);
    setViewingHistoric(true);
    reset();
  };

  const handleMarkPaid = (id: string) => {
    dispatch(payInvoiceAction(id));
    dispatch(showToast({ message: `Ledger ${id} cleared as PAID. Invoice successfully reconciled.`, type: 'success' }));
    // Update active view if it's the current one
    if (activeInvoice && activeInvoice.id === id) {
      setActiveInvoice({ ...activeInvoice, status: 'paid' });
    }
  };

  return (
    <div id="admin-billing-workspace" className="bg-[#FAF9F5] text-emerald-950 font-sans antialiased py-8 text-left space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-bold">
              Ledger Operations & Reconciliation
            </span>
            <h1 className="text-3xl font-serif font-bold text-emerald-950">Billing & Invoices Suite</h1>
            <p className="text-gray-400 text-xs font-light">Generate procedural bills, handle clinical taxes, configure discounts, and reconcile receipts.</p>
          </div>
          <span className="text-xs font-mono text-gray-400 bg-gray-50 px-3.5 py-2 border rounded-xl flex items-center gap-1.5 select-none font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> GST Register: 27AABCB8149K1ZX
          </span>
        </div>

        {/* Unified content screen layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column left (5 span): Invoice List and Invoice Builder */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Compile Invoice card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="space-y-1 border-b pb-3">
                <h3 className="font-serif text-base font-bold text-emerald-950 flex items-center gap-1.5">
                  <Plus className="w-5 h-5 text-amber-700" /> Compile Surgical Bill
                </h3>
                <p className="text-gray-400 text-xs font-light">Structure procedural dental invoice ledger entries dynamically</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Patient */}
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                      Select Patient
                    </label>
                    <select
                      className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                      {...register('patientId', { required: 'Patient file association required' })}
                    >
                      {patients.map(p => (
                        <option key={p.patientId} value={p.patientId}>{p.fullName} ({p.patientId})</option>
                      ))}
                    </select>
                  </div>

                  {/* Item Description */}
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                      Standard Therapy Category (Customizable)
                    </label>
                    <input
                      type="text"
                      list="clinical-therapy-presets"
                      className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50/50 focus:outline-none"
                      placeholder="Enter or select treatment..."
                      {...register('itemDescription', { required: 'Description is required' })}
                    />
                    <datalist id="clinical-therapy-presets">
                      <option value="Intraoral 3D Smile Mapping" />
                      <option value="Painless Single-Sitting Root Canal" />
                      <option value="Cosmetic Dental Veneer Bonding" />
                      <option value="Full Arch Hygiene & Dental Polish" />
                      <option value="Laser Bleaching / Whitening" />
                      <option value="Zirconia Crown Fitting Operations" />
                      <option value="Advanced Implant Osteotomy" />
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Base Cost */}
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                      Base Procedure Fee (₹)
                    </label>
                    <input
                      type="number"
                      className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50/50 focus:outline-none"
                      {...register('itemCost', { required: true, min: 0 })}
                    />
                  </div>

                  {/* Applied Discount */}
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-950">
                      Sponsor Care Discount (₹)
                    </label>
                    <input
                      type="number"
                      className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50/50 focus:outline-none"
                      {...register('discount', { min: 0 })}
                    />
                  </div>
                </div>

                {/* Live pricing estimation tray */}
                <div className="p-4 bg-emerald-950 text-white rounded-2xl flex items-center justify-between font-mono text-xs shadow-inner">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] uppercase text-emerald-300 block font-bold">Real-time dynamic checkout preview</span>
                    <span className="block font-light text-neutral-300">Base: ₹{subtotalLive.toLocaleString('en-IN')} | GST(18%): ₹{taxLive.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-amber-400 block font-bold">Grand sum</span>
                    <span className="text-lg font-bold font-serif text-white">₹{totalLive.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-mono text-[10px] font-bold uppercase py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Authorize & Issue Invoice Code
                </button>
              </form>
            </div>

            {/* 2. Historic Invoice ledger */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div>
                <h3 className="font-serif text-base font-bold text-emerald-950">Clinical General Ledger</h3>
                <p className="text-gray-400 text-xs">Browse clinical ledger records generated under Dr. Babel’s clinical license</p>
              </div>

              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {invoices.map(inv => (
                  <div
                    key={inv.id}
                    onClick={() => handleSelectHistoric(inv)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      previewInvoice?.id === inv.id
                        ? 'bg-emerald-50/40 border-emerald-400 shadow-xs'
                        : 'border-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-mono font-bold text-gray-400">{inv.id}</span>
                        <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          inv.status === 'paid' ? 'bg-emerald-55 text-emerald-800' : 'bg-amber-55 text-[#8B6B00]'
                        }`}>
                          {inv.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{inv.date}</span>
                      </div>
                      <h4 className="font-serif text-xs font-bold text-emerald-950">{inv.patientName}</h4>
                      <p className="text-[11px] text-gray-500 font-sans font-light truncate max-w-[200px]">
                        {inv.items[0]?.description || 'Treatment procedure'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-mono">
                      <div className="text-right">
                        <span className="text-[9px] block text-gray-400 uppercase font-medium">Reconciled Sum</span>
                        <span className="text-xs font-bold text-emerald-900">₹{inv.total.toLocaleString('en-IN')}</span>
                      </div>
                      
                      {inv.status === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkPaid(inv.id);
                          }}
                          className="bg-emerald-800 hover:bg-emerald-900 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors uppercase font-mono"
                        >
                          Collect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column right (5 span): Printable Elegant Clinical Paper mockup receipt preview */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs text-left relative overflow-hidden">
            
            <div className="border-b pb-4 mb-4 space-y-1">
              <div className="flex items-center gap-1 justify-between">
                <span className="font-serif text-sm font-bold text-emerald-950 flex items-center gap-1">
                  <Printer className="w-4 h-4 text-emerald-800 font-bold" /> Invoice Preview Pane
                </span>
                {previewInvoice?.id === 'DRAFT-NEW' ? (
                  <span className="text-[8px] font-mono text-[#8B6B00] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50 uppercase font-bold animate-pulse">
                    ● Real-time Draft
                  </span>
                ) : (
                  <span className="text-[8px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50 uppercase font-bold">
                    ● Authorized Record
                  </span>
                )}
              </div>
              <p className="text-gray-405 text-xs font-light">Render HIPAA valid receipt and ledger copies in real-time ready for distribution.</p>
            </div>

            <AnimatePresence mode="wait">
              {previewInvoice ? (
                <motion.div
                  key={previewInvoice.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  className="p-6 bg-amber-50/20 border border-[#8B6B00]/10 rounded-2xl relative shadow-inner space-y-6"
                >
                  {/* Watermark logo */}
                  <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center pointer-events-none select-none">
                    <span className="font-serif text-[100px] font-bold text-emerald-950 italic">Unique</span>
                  </div>

                  {/* Header stamp */}
                  <div className="flex justify-between items-start border-b pb-4 gap-4">
                    <div className="space-y-1.5 text-left">
                      <span className="font-serif text-base font-bold text-emerald-950 block">Unique Dental Care</span>
                      <p className="text-[9px] font-mono text-gray-400 leading-tight">
                        Shop No:-51, Building No:22,<br />
                        near Shiv Sena Shaka, Mankhurd (W),<br />
                        PMG COLONY, Mumbai - 400043
                      </p>
                    </div>
                    <div className="text-right font-mono shrink-0">
                      <span className="block text-[8px] uppercase text-gray-400">Statement Reference</span>
                      <span className="text-xs font-bold text-emerald-950 font-mono uppercase">{previewInvoice.id}</span>
                    </div>
                  </div>

                  {/* Metadata coordinates */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b pb-4">
                    <div className="space-y-1 text-left">
                      <span className="block text-[8px] uppercase text-gray-400 font-bold">Prepped For:</span>
                      <span className="block font-serif font-bold text-emerald-950">{previewInvoice.patientName}</span>
                      <span className="block text-[10px] text-gray-400">{previewInvoice.patientId}</span>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="block text-[8px] uppercase text-gray-400 font-bold">Billing Date</span>
                      <span className="block text-emerald-950">{previewInvoice.date}</span>
                      <span className={`inline-block text-[8px] uppercase font-bold px-2 py-0.5 rounded ${
                        previewInvoice.status === 'paid' ? 'bg-emerald-55 text-emerald-800' : 'bg-amber-55 text-[#8B6B00]'
                      }`}>
                        {previewInvoice.status}
                      </span>
                    </div>
                  </div>

                  {/* Items block */}
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold border-b pb-1.5">
                      <span>PROCEDURE LOGS</span>
                      <span>CHARGES (₹)</span>
                    </div>
                    
                    {previewInvoice.items.map((item, idx) => {
                      let mainDescription = item.description;
                      let teethInfo = '';
                      
                      const matchDesc = item.description.match(/^(.*?)\s*\(Associated Teeth:\s*(.*?)\)$/i);
                      if (matchDesc) {
                        mainDescription = matchDesc[1];
                        teethInfo = matchDesc[2];
                      }

                      return (
                        <div key={idx} className="py-2.5 border-b border-gray-100 last:border-0">
                          <div className="flex justify-between items-baseline gap-2 w-full min-w-0">
                            <div className="flex-1 min-w-0 text-left">
                              <span className="font-serif text-[13px] sm:text-sm font-bold text-emerald-950 block whitespace-normal break-words leading-tight">
                                {mainDescription}
                              </span>
                              {teethInfo && (
                                <span className="font-mono text-[9px] text-[#8B6B00] bg-amber-50/80 border border-[#8B6B00]/10 px-2 rounded mt-1.5 inline-block font-extrabold">
                                  Teeth: {teethInfo}
                                </span>
                              )}
                            </div>
                            <div className="hidden sm:block flex-grow border-b border-dotted border-gray-300 mx-2 self-end mb-1" />
                            <span className="font-mono text-xs sm:text-sm font-bold text-emerald-950 shrink-0">
                              ₹{item.cost.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Calculations ledger strip */}
                  <div className="border-t pt-4 space-y-2 font-mono text-xs text-left">
                    <div className="flex justify-between text-gray-500">
                      <span>Procedure Subtotal</span>
                      <span>₹{previewInvoice.subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-gray-500">
                      <span>Integrated Clinical GST (18%)</span>
                      <span>+₹{previewInvoice.tax.toLocaleString('en-IN')}</span>
                    </div>

                    {previewInvoice.discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Aesthetics Sponsor Waiver</span>
                        <span>-₹{previewInvoice.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-bold text-emerald-950 pt-2 border-t font-serif">
                      <span>RECONCILED GRAND SUM:</span>
                      <span className="font-serif text-[#064e3b] text-base font-extrabold">₹{previewInvoice.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Footer message / Print trig */}
                  <div className="pt-4 border-t border-dashed border-gray-200 text-center space-y-4">
                    <p className="text-[10px] font-mono text-gray-400 leading-relaxed font-light">
                      This is a real-time digital sandbox receipt copy generated safely under HIPAA and CDSCO clinical records parameters for licensing reference.
                    </p>
                    
                    <button
                      onClick={() => alert(`Starting print transmission routine for invoice copy: ${previewInvoice.id}`)}
                      className="w-full bg-[#FAF9F5] hover:bg-neutral-100 border border-neutral-200 text-emerald-950 font-mono text-[10px] font-bold uppercase py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-800" /> Print Mockup Specimen
                    </button>
                  </div>

                </motion.div>
              ) : (
                <div className="py-20 border border-dashed rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                  <AlertCircle className="w-8 h-8 text-neutral-300 mb-2" />
                  <span className="text-xs font-mono font-bold uppercase">No Invoice Rendered</span>
                  <p className="text-[11px] text-gray-400 font-light mt-0.5">Click any statement from the ledger index to preview active receipts.</p>
                </div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}
