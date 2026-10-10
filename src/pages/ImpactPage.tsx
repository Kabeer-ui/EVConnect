import React, { useEffect, useState } from 'react';
import { impactService } from '../services/impactService';
import { ImpactStats } from '../types';
import { Leaf, Activity, Zap, Milestone, TrendingUp, Info, DollarSign, Trees } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ImpactPage: React.FC = () => {
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function load() {
      try {
        const data = await impactService.getUserImpact();
        setStats(data);
      } catch (err) {
        console.error('Failed to load impact stats', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !stats) {
    return <div className="py-20 text-center text-xs text-neutral-400">Loading sustainability report...</div>;
  }

  // Calculate maximum for bar charts
  const maxKm = Math.max(...stats.monthlyBreakdown.map((m) => m.km));
  const maxCo2 = Math.max(...stats.monthlyBreakdown.map((m) => m.co2Kg));

  return (
    <div className="w-full min-h-screen bg-[#F8FAF9] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase mb-1 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Sustainability Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#062D24] font-display">
              Environmental Impact
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Cumulative emissions displaced by driving electric and utilizing clean charging hubs.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-600 font-medium">
            Status: Demonstration / Mock Values
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Transparent methodology banner */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-3">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Emissions displacement methodology:</span> Estimates compare electric kWh consumption against standard 28 MPG internal-combustion vehicles (assuming ~180g CO₂ emitted per km of gasoline driving). When backend integration is complete, this ledger will reflect your real MySQL session logs.
          </div>
        </div>

        {/* 4 Primary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1 */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span>CO₂ Avoided</span>
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-[#062D24] font-display tabular-nums">
              {stats.estimatedCo2AvoidedKg} <span className="text-base font-semibold text-neutral-500">kg</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Net tailpipe emissions prevented</p>
          </div>

          {/* 2 */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span>Electric Distance</span>
              <Milestone className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-[#062D24] font-display tabular-nums">
              {stats.electricKmDriven.toLocaleString()} <span className="text-base font-semibold text-neutral-500">km</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Zero-emission propulsion</p>
          </div>

          {/* 3 */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span>Energy Delivered</span>
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-[#062D24] font-display tabular-nums">
              {stats.energyConsumedKwh} <span className="text-base font-semibold text-neutral-500">kWh</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Across {stats.chargingSessions} charging sessions</p>
          </div>

          {/* 4 */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span>Est. Fuel Savings</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-[#062D24] font-display tabular-nums">
              ${stats.fuelCostSaved}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Versus equivalent gasoline cost</p>
          </div>
        </div>

        {/* Visual Monthly Trends Breakdown Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#062D24] font-display">
                Monthly Kilometres &amp; Emissions Displaced
              </h3>
              <p className="text-xs text-neutral-500">
                5-month historical trend since joining the EVConnect network.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-neutral-600">
                <span className="w-3 h-3 rounded-md bg-emerald-600" />
                Electric km
              </span>
              <span className="flex items-center gap-1.5 text-neutral-600">
                <span className="w-3 h-3 rounded-md bg-teal-400" />
                CO₂ Avoided (kg)
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-4 pt-2">
            {stats.monthlyBreakdown.map((m) => {
              const kmPct = Math.round((m.km / maxKm) * 100);
              const co2Pct = Math.round((m.co2Kg / maxCo2) * 100);

              return (
                <div key={m.month} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-800">{m.month}</span>
                    <span className="text-neutral-500 tabular-nums">
                      {m.km} km · {m.co2Kg} kg CO₂ avoided
                    </span>
                  </div>

                  <div className="h-6 w-full bg-neutral-100 rounded-xl overflow-hidden flex gap-1 p-0.5">
                    <div
                      style={{ width: `${kmPct}%` }}
                      className="h-full bg-[#062D24] rounded-lg transition-all duration-500"
                    />
                    <div
                      style={{ width: `${co2Pct * 0.4}%` }}
                      className="h-full bg-emerald-400 rounded-lg transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tree Equivalence Callout */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#062D24] to-[#0A3D31] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Trees className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-display">
                Equivalent to planting ~{stats.treesEquivalent} urban trees
              </h4>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Calculated by carbon sequestration potential of mature trees over a one-year cycle.
              </p>
            </div>
          </div>

          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-emerald-400 text-[#062D24] font-bold text-xs hover:bg-emerald-300 transition-colors whitespace-nowrap"
          >
            Find Next Charger
          </Link>
        </div>

      </div>
    </div>
  );
};
