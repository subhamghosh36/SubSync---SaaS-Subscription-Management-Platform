'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Activity, BarChart2, TrendingUp } from 'lucide-react';

const mockHourlyData = [
  { time: '00:00', requests: 1240, latency: 42, bandwidth: 12 },
  { time: '03:00', requests: 890, latency: 38, bandwidth: 8 },
  { time: '06:00', requests: 1560, latency: 45, bandwidth: 18 },
  { time: '09:00', requests: 4890, latency: 68, bandwidth: 45 },
  { time: '12:00', requests: 7200, latency: 82, bandwidth: 78 },
  { time: '15:00', requests: 8450, latency: 74, bandwidth: 92 },
  { time: '18:00', requests: 6100, latency: 55, bandwidth: 64 },
  { time: '21:00', requests: 3400, latency: 46, bandwidth: 35 },
];

const mockMonthlyData = [
  { name: 'Week 1', calls: 85000, bandwidth: 120 },
  { name: 'Week 2', calls: 142000, bandwidth: 180 },
  { name: 'Week 3', calls: 198000, bandwidth: 240 },
  { name: 'Week 4', calls: 245000, bandwidth: 310 },
];

export default function UsageChart() {
  const [metricType, setMetricType] = useState<'requests' | 'bandwidth'>('requests');

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            Live Ingestion & Traffic Throughput
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry measuring edge API requests and data transfer.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setMetricType('requests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              metricType === 'requests'
                ? 'bg-brand-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            API Requests
          </button>
          <button
            onClick={() => setMetricType('bandwidth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              metricType === 'bandwidth'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bandwidth (GB)
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockHourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              }}
            />
            <Area
              type="monotone"
              dataKey={metricType}
              stroke={metricType === 'requests' ? '#6366F1' : '#06B6D4'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={metricType === 'requests' ? 'url(#brandGradient)' : 'url(#cyanGradient)'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
