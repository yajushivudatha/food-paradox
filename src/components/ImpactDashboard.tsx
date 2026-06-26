/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ImpactStats, MonthlyImpactData } from "../types";
import { HISTORICAL_IMPACT_DATA } from "../data/mockData";
import { servingsToKg, calculateCarbonOffset } from "../utils/helpers";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from "recharts";
import { Award, ShieldCheck, Globe, Users, TrendingUp, Info, HelpCircle, Sparkles, CheckCircle2 } from "lucide-react";

interface ImpactDashboardProps {
  stats: ImpactStats;
}

export default function ImpactDashboard({ stats }: ImpactDashboardProps) {
  const [activeScenario, setActiveScenario] = useState<"standard" | "campus" | "hotel" | "monsoon">("standard");

  // Dynamic simulation multipliers
  const scenarioConfig = {
    standard: {
      title: "Current Operational Baseline",
      descr: "Reflects standard ongoing university canteen and restaurant contributions.",
      multKg: 1.0,
      multGap: 1.0
    },
    campus: {
      title: "Hostel & Canteen Drive (+30%)",
      descr: "Simulates full mobilization of campus mess halls and catering services.",
      multKg: 1.3,
      multGap: 1.45
    },
    hotel: {
      title: "Luxury Hotel Coalition (+60%)",
      descr: "Incorporates Star Hotels and high-volume banquet halls.",
      multKg: 1.6,
      multGap: 1.8
    },
    monsoon: {
      title: "Monsoon Student Push (+90%)",
      descr: "Expands student volunteer squads by 2x, bringing logistics latency down to under 15 mins.",
      multKg: 1.9,
      multGap: 2.3
    }
  };

  const activeConf = scenarioConfig[activeScenario];

  // Apply scenario multipliers to current real-time stats
  const simulatedKg = Math.round(stats.totalKgRescued * activeConf.multKg);
  const simulatedMeals = Math.round(stats.totalMealsServed * activeConf.multKg);
  const simulatedOffset = parseFloat(calculateCarbonOffset(simulatedKg).toFixed(1));

  // Compute dynamic chart data based on scenario
  const chartData = HISTORICAL_IMPACT_DATA.map((item, idx) => {
    // Ramp up coordinates towards the end of the month based on selected push
    const isCurrentMonth = idx === HISTORICAL_IMPACT_DATA.length - 1;
    const multKg = isCurrentMonth ? activeConf.multKg : 1.0 + (idx * 0.05);
    const multGap = isCurrentMonth ? activeConf.multGap : 1.0 + (idx * 0.04);

    return {
      month: item.month,
      "Food Rescued (kg)": Math.round(item.rescuedKg * multKg),
      "Hunger Gap Reduction (%)": Math.min(95, Math.round(item.hungerGapReduction * multGap))
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Cards: Core Institutional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Kilograms */}
        <div className="bg-emerald-800 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full filter blur-lg" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-85">
              TOTAL BIOMASS RESCUED
            </span>
            <Award className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black tracking-tight">{simulatedKg}</span>
            <span className="text-sm font-bold ml-1.5">kg</span>
          </div>
          <p className="text-[11px] text-emerald-100/80 font-medium mt-3 leading-relaxed">
            Directly intercepted from landfill routing and converted to nutritious sustenance.
          </p>
        </div>

        {/* Card 2: Meals Served */}
        <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full filter blur-lg" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-85">
              ESTIMATED MEALS DISTRIBUTED
            </span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black tracking-tight">{simulatedMeals}</span>
            <span className="text-sm font-bold ml-1.5">meals</span>
          </div>
          <p className="text-[11px] text-stone-300/85 font-medium mt-3 leading-relaxed">
            Responded to local underfunded shelters, orphanage kitchens, and student volunteer networks.
          </p>
        </div>

        {/* Card 3: Carbon Offset */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-lg" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-stone-500 font-semibold">
              CARBON EMISSION AVOIDANCE
            </span>
            <Globe className="w-5 h-5 text-emerald-600 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-stone-900 tracking-tight">{simulatedOffset}</span>
            <span className="text-sm font-bold text-stone-500 ml-1.5">kg CO₂e</span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium mt-3 leading-relaxed">
            Equivalent to preventing anaerobic decomposition that breeds volatile methane in landfill sites.
          </p>
        </div>
      </div>

      {/* Main Row: Chart & Interactive Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Correlation Chart (7 Cols) */}
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-sans font-bold text-stone-900 text-sm tracking-tight flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                Rescued Food vs Hunger Gap Correlation
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Evaluates institutional food recovery directly against the municipality Hunger Gap reduction index.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-stone-50 border border-stone-150 px-2.5 py-1 rounded-xl text-[10px] text-stone-500 font-mono font-semibold">
              <Info className="w-3.5 h-3.5 text-stone-400" />
              Dual-Y-Axis Analytics Enabled
            </div>
          </div>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: -5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f0ee" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#78716c", fontWeight: 500 }} stroke="#e7e5e4" />
                {/* Left Y Axis (Biomass rescued in Kg) */}
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10, fill: "#047857" }}
                  stroke="#e7e5e4"
                  label={{ value: "Food Rescued (kg)", angle: -90, position: "insideLeft", offset: -5, style: { fontSize: 10, fill: "#047857", fontWeight: 600 } }}
                />
                {/* Right Y Axis (Hunger Gap reduction %) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#b45309" }}
                  stroke="#e7e5e4"
                  label={{ value: "Hunger Gap Reduction (%)", angle: 90, position: "insideRight", offset: -5, style: { fontSize: 10, fill: "#b45309", fontWeight: 600 } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "12px",
                    border: "1px solid #e7e5e4",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    fontSize: "11px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar yAxisId="left" dataKey="Food Rescued (kg)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
                <Line yAxisId="right" type="monotone" dataKey="Hunger Gap Reduction (%)" stroke="#d97706" strokeWidth={2.5} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Interactive Scenarios & Calculations Detail (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-stone-900 text-sm tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Community Impact Simulator
            </h3>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Toggle specific institutional campaign scenarios to simulate and forecast biomass recovery potential and local starvation gap reduction.
            </p>

            <div className="space-y-2">
              {(["standard", "campus", "hotel", "monsoon"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveScenario(key)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${
                    activeScenario === key
                      ? "bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300"
                      : "bg-stone-50/50 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      activeScenario === key ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300"
                    }`}
                  >
                    {activeScenario === key && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div>
                    <span className="font-bold text-stone-800 block">
                      {scenarioConfig[key].title}
                    </span>
                    {activeScenario === key && (
                      <span className="text-[10px] text-stone-600 block mt-0.5 leading-relaxed">
                        {scenarioConfig[key].descr}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Formulas Disclosure Box */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5">
            <h4 className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
              Methodology & Standards
            </h4>
            <div className="space-y-2 text-[10px] text-stone-500 leading-relaxed font-medium">
              <p>
                🌍 <strong className="text-stone-700">Carbon offset multiplier:</strong> 1kg of diverted food waste = 2.5kg CO₂e saved. This model conforms to standard EPA WARM guidelines on methane avoidance.
              </p>
              <p>
                🥣 <strong className="text-stone-700">Portion weights:</strong> Calculated at a standard 400g institutional serving volume containing raw cooked proteins and dense starches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
