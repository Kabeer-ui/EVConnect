import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, Activity, Zap, Milestone } from 'lucide-react';
import { ImpactStats } from '../../types';

interface ImpactPreviewProps {
  stats: ImpactStats;
}

export const ImpactPreview: React.FC = () => {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sustainability Overview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062D24] font-display">
              Your Environmental Impact
            </h2>
            <p className="text-sm text-neutral-500 mt-1 max-w-xl">
              Track how your clean driving habits translate into reduced tailpipe emissions and energy efficiency.
            </p>
          </div>

          <Link
            to="/impact"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <span>View My Impact</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Note stating mock values as explicitly requested */}
        <div className="mb-6 px-4 py-2 rounded-xl bg-neutral-100 border border-neutral-200/80 text-[11px] text-neutral-500 flex items-center justify-between">
          <span>* Demo / mock estimates based on average EPA electric-to-gasoline lifecycle baselines.</span>
          <span className="font-semibold text-neutral-600">Simulated Data</span>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-neutral-200/80">
            <div className="text-neutral-500 text-xs mb-1 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>Charging Sessions</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#062D24] tabular-nums font-display">
              34
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">Completed across all hubs</span>
          </div>

          {/* Metric 2 */}
          <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-neutral-200/80">
            <div className="text-neutral-500 text-xs mb-1 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-700" />
              <span>Estimated CO₂ Avoided</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#062D24] tabular-nums font-display">
              642 <span className="text-sm font-semibold text-neutral-500">kg</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">Vs. standard ICE vehicle</span>
          </div>

          {/* Metric 3 */}
          <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-neutral-200/80">
            <div className="text-neutral-500 text-xs mb-1 flex items-center gap-1.5">
              <Milestone className="w-4 h-4 text-emerald-700" />
              <span>Electric Kilometres</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#062D24] tabular-nums font-display">
              4,120 <span className="text-sm font-semibold text-neutral-500">km</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">Zero tailpipe emissions</span>
          </div>

          {/* Metric 4 */}
          <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-neutral-200/80">
            <div className="text-neutral-500 text-xs mb-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-700" />
              <span>Energy Consumed</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#062D24] tabular-nums font-display">
              765 <span className="text-sm font-semibold text-neutral-500">kWh</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">Delivered via public grid</span>
          </div>
        </div>
      </div>
    </section>
  );
};
