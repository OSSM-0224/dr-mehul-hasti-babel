/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setPath, updateAppointmentStatus, showToast } from '../../store';
import { 
  Users, Calendar, IndianRupee, TrendingUp, Sparkles, CheckCircle2, 
  Clock, ShieldAlert, Award, FileSpreadsheet, ArrowRight, Activity, Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import * as echarts from 'echarts';

interface EChartProps {
  option: echarts.EChartsOption;
  style?: React.CSSProperties;
  className?: string;
}

function EChart({ option, style, className }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = echarts.init(containerRef.current);
    chartInstanceRef.current = chart;
    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.setOption(option, true);
    }
  }, [option]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', ...style }} className={className} />;
}

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const appointments = useSelector((state: RootState) => state.appointments.list);
  const patients = useSelector((state: RootState) => state.patients.list);
  const records = useSelector((state: RootState) => state.records.list);
  const invoices = useSelector((state: RootState) => state.invoices.list);

  // Derive core clinic statistics
  const totalPatients = patients.length;
  const activeAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
  const grossBillings = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const pendingCollections = invoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);
  const collectionPercentage = Math.round(((grossBillings - pendingCollections) / (grossBillings || 1)) * 100);

  // Format charts data (Revenue over time)
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 45000, visits: 22 },
    { month: 'Feb', revenue: 68000, visits: 31 },
    { month: 'Mar', revenue: 95000, visits: 40 },
    { month: 'Apr', revenue: 110000, visits: 52 },
    { month: 'May', revenue: grossBillings, visits: totalPatients * 4 },
  ];

  // Treatment frequency distribution matching state
  const treatmentDistribution = [
    { name: 'Smile Designing', value: appointments.filter(a => a.treatment.includes('Smile')).length },
    { name: 'Root Canals', value: appointments.filter(a => a.treatment.includes('Root') || a.treatment.includes('RCT')).length },
    { name: 'Routine / Hygiene', value: appointments.filter(a => a.treatment.includes('Checkup') || a.treatment.includes('Therapy') || a.treatment.includes('Hygiene')).length },
  ].filter(t => t.value > 0);

  const PIE_COLORS = ['#047857', '#F59E0B', '#3B82F6', '#8B5CF6'];

  const pendingApts = appointments.filter(a => a.status === 'pending').slice(0, 4);

  const areaChartOption: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#022c22', fontSize: 12, fontFamily: 'Inter, sans-serif' },
      formatter: (params: any) => {
        const item = params[0];
        return `<strong>${item.name}</strong><br/>Billing Revenue: ₹${item.value.toLocaleString('en-IN')}`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: monthlyRevenueData.map(d => d.month),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9CA3AF', fontSize: 11, fontFamily: 'Inter, sans-serif' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
        formatter: (value: number) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`
      }
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        smooth: true,
        data: monthlyRevenueData.map(d => d.revenue),
        symbolSize: 6,
        itemStyle: { color: '#059669' },
        lineStyle: { width: 2.5 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(5, 150, 105, 0.2)' },
              { offset: 1, color: 'rgba(5, 150, 105, 0)' }
            ]
          }
        }
      }
    ]
  };

  const pieChartOption: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#022c22', fontSize: 12, fontFamily: 'Inter, sans-serif' },
      formatter: (params: any) => {
        return `<strong>${params.name}</strong><br/>${params.value} cases (${params.percent}%)`;
      }
    },
    series: [
      {
        name: 'Treatments',
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#ffffff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: false
          }
        },
        data: treatmentDistribution,
        color: PIE_COLORS
      }
    ]
  };

  const handleUpdateStatus = (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    dispatch(updateAppointmentStatus({ id, status }));
    dispatch(showToast({ message: `Slot status updated to ${status} successfully.`, type: 'success' }));
  };

  return (
    <div id="admin-admin-dashboard" className="bg-[#FAF9F5] text-emerald-950 font-sans antialiased py-8 space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* welcome banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold">
                Live Clinic Control Portal
              </span>
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
            </div>
            <h1 className="text-3xl font-serif font-bold">Dr. Mehul H. Babel's Console</h1>
            <p className="text-neutral-300 text-sm max-w-xl font-light">
              Oversee high-fidelity smile transformations, coordinate appointments, structure surgical invoices, and browse clinical records in real time.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3 z-10">
            <button
              onClick={() => dispatch(setPath('admin/patients'))}
              className="bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs uppercase px-4 py-3 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add Diagnostics
            </button>
            <button
              onClick={() => dispatch(setPath('admin/billing'))}
              className="bg-white hover:bg-neutral-100 text-emerald-950 font-mono text-xs uppercase px-4 py-3 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1.5 shadow"
            >
              <IndianRupee className="w-4 h-4" /> Create Bill
            </button>
          </div>
          {/* Subtle logo vector outline behind */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none flex items-center justify-center">
            <Award className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* KPIs cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-mono uppercase text-gray-400 font-bold">Tracked Patients</p>
              <p className="text-3xl font-serif font-bold text-emerald-950">{totalPatients}</p>
              <p className="text-[11px] text-emerald-700 font-mono flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +100% active database
              </p>
            </div>
            <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-mono uppercase text-gray-400 font-bold">Upcoming Bookings</p>
              <p className="text-3xl font-serif font-bold text-emerald-950">{activeAppointments}</p>
              <p className="text-[11px] text-[#8B6B00] font-mono">
                {appointments.filter(a => a.status === 'pending').length} pending review
              </p>
            </div>
            <div className="bg-amber-50 text-amber-800 p-3.5 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-mono uppercase text-gray-400 font-bold">Gross Invoice Volume</p>
              <p className="text-3xl font-serif font-bold text-emerald-950">₹{grossBillings.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-emerald-800 font-mono font-bold">
                18% GST audit ready
              </p>
            </div>
            <div className="bg-green-50 text-green-700 p-3.5 rounded-2xl">
              <IndianRupee className="w-6 h-6" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-mono uppercase text-gray-400 font-bold">Collection Efficiency</p>
              <p className="text-3xl font-serif font-bold text-emerald-950">{collectionPercentage}%</p>
              <p className="text-[11px] text-rose-700 font-mono">
                ₹{pendingCollections.toLocaleString('en-IN')} outstanding
              </p>
            </div>
            <div className="bg-blue-50 text-blue-700 p-3.5 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Area Chart */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4 text-left">
            <div>
              <h3 className="font-serif text-lg font-bold text-emerald-950">Financial Performance Trajectory</h3>
              <p className="text-gray-400 text-xs">Overview of monthly revenue accruals & clinic hygiene visit velocity</p>
            </div>
            <div className="h-64 sm:h-80 w-full">
              <EChart option={areaChartOption} />
            </div>
          </div>

          {/* Treatment Distribution Chart */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-left flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-emerald-950">Treatment Distribution</h3>
              <p className="text-gray-400 text-xs">Aggregated statistics by diagnosis fields</p>
            </div>
            
            <div className="h-44 sm:h-52 w-full flex items-center justify-center">
              {treatmentDistribution.length === 0 ? (
                <div className="text-gray-400 text-xs font-mono">No active therapy segments tracked.</div>
              ) : (
                <EChart option={pieChartOption} />
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-50">
              {treatmentDistribution.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                    <span className="text-gray-600 font-light">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-950">{item.value} bookings</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Active Requests Feed & Studio Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active requests feed */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 text-left space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-emerald-950">Pending Requests Queue</h3>
                <p className="text-gray-400 text-xs">Require clinician validation, slot check and state approvals</p>
              </div>
              <button
                onClick={() => dispatch(setPath('admin/appointments'))}
                className="text-amber-800 hover:text-amber-900 font-mono text-[11px] font-bold uppercase flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 flex-grow mt-3">
              {pendingApts.length === 0 ? (
                <div className="py-12 border border-dashed rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
                  <p className="text-xs font-mono font-bold uppercase">All queues clear</p>
                  <p className="text-[11px] text-gray-400 font-light mt-0.5">No client appointment requests require action.</p>
                </div>
              ) : (
                pendingApts.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 bg-gray-50/50 hover:bg-neutral-50 border border-gray-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">{item.id}</span>
                        <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 uppercase px-2 py-0.5 rounded">
                          {item.treatment}
                        </span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-emerald-950">{item.patientName}</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 font-mono">
                        <span>Date: {item.date}</span>
                        <span>Time: {item.time}</span>
                        <span>Contact: {item.mobileNumber}</span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-gray-500 italic font-light mt-1">"{item.notes}"</p>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'confirmed')}
                        className="flex-1 sm:w-28 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-[10px] font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors"
                      >
                        Accept Slot
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'cancelled')}
                        className="flex-1 sm:w-28 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 font-mono text-[10px] font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Access Portal links */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-emerald-950">Administrative Index</h3>
              <p className="text-gray-400 text-xs text-left">Quickly access other staff system sections</p>
            </div>

            <div className="space-y-3 mt-4 flex-1">
              <button
                onClick={() => dispatch(setPath('admin/appointments'))}
                className="w-full text-left p-4 rounded-2xl border border-gray-50 bg-[#FAF9F5]/60 hover:bg-emerald-50/50 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-white shadow-xs rounded-xl text-emerald-800">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-emerald-950 mb-0.5">Appointment Matrix</h5>
                    <p className="text-[11px] text-gray-400 font-light">List, schedule, and filter clinic loads</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-800 transition-colors" />
              </button>

              <button
                onClick={() => dispatch(setPath('admin/patients'))}
                className="w-full text-left p-4 rounded-2xl border border-gray-50 bg-[#FAF9F5]/60 hover:bg-emerald-50/50 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-white shadow-xs rounded-xl text-amber-700">
                    <Users className="w-5 h-5" />
                  </span>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-emerald-950 mb-0.5">Dental Registry</h5>
                    <p className="text-[11px] text-gray-400 font-light">Profile manager & visual dental charts</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-800 transition-colors" />
              </button>

              <button
                onClick={() => dispatch(setPath('admin/billing'))}
                className="w-full text-left p-4 rounded-2xl border border-gray-50 bg-[#FAF9F5]/60 hover:bg-emerald-50/50 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-white shadow-xs rounded-xl text-green-700">
                    <IndianRupee className="w-5 h-5" />
                  </span>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-emerald-950 mb-0.5">Billing & Ledger</h5>
                    <p className="text-[11px] text-gray-400 font-light">Invoice builder, taxes, discounts</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-800 transition-colors" />
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-400">
              <span>Security level: Clinical Admin</span>
              <span>v1.8.0-Stable</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
