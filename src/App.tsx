/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { FoodLead, NGO, ImpactStats } from "./types";
import { INITIAL_FOOD_LEADS, INITIAL_NGO_PARTNERS } from "./data/mockData";
import { servingsToKg, calculateCarbonOffset, formatFreshnessTimer } from "./utils/helpers";
import DonorPanel from "./components/DonorPanel";
import ReceiverPanel from "./components/ReceiverPanel";
import ImpactDashboard from "./components/ImpactDashboard";
import {
  Utensils,
  Heart,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  TrendingUp,
  Award,
  Globe,
  Clock,
  ExternalLink,
  BookOpen,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Flame,
  Leaf
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [role, setRole] = useState<"donor" | "receiver" | "admin">("receiver");
  const [leads, setLeads] = useState<FoodLead[]>([]);
  const [ngoPartners] = useState<NGO[]>(INITIAL_NGO_PARTNERS);

  // Load and initialize from local storage, or fallback to mock data
  useEffect(() => {
    const saved = localStorage.getItem("food_paradox_leads");
    if (saved) {
      try {
        setLeads(JSON.parse(saved));
      } catch (e) {
        setLeads(INITIAL_FOOD_LEADS);
      }
    } else {
      setLeads(INITIAL_FOOD_LEADS);
    }
  }, []);

  // Save to local storage on changes
  const saveLeads = (updatedLeads: FoodLead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem("food_paradox_leads", JSON.stringify(updatedLeads));
  };

  // 1. Action: Post Surplus Lead (called by DonorPanel)
  const handleAddLead = (
    newLeadData: Omit<FoodLead, "id" | "distance" | "status" | "claimedBy" | "claimedAt" | "createdAt">
  ) => {
    // Generate a new food lead
    const newLead: FoodLead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      distance: parseFloat((1.0 + Math.random() * 6).toFixed(1)), // random distance within geofence range
      status: "available",
      claimedBy: null,
      claimedAt: null,
      createdAt: new Date("2026-06-26T09:33:56-07:00").toISOString(),
    };

    const updated = [newLead, ...leads];
    saveLeads(updated);
  };

  // 2. Action: Claim Lead (called by ReceiverPanel or Map Tooltips)
  const handleClaimLead = (leadId: string) => {
    const updated = leads.map((l) => {
      if (l.id === leadId && l.status === "available") {
        return {
          ...l,
          status: "claimed" as const,
          claimedBy: INITIAL_NGO_PARTNERS[0].name, // Default to first verified NGO Chapter
          claimedAt: new Date("2026-06-26T09:33:56-07:00").toISOString(),
        };
      }
      return l;
    });
    saveLeads(updated);
  };

  // Calculate dynamic metrics based on claimed leads + historical baseline
  const derivedStats = useMemo<ImpactStats>(() => {
    // Base Baseline (representing past successful rescues)
    let totalKg = 2650;
    let totalMeals = 6625;

    // Filter leads claimed inside this active sandbox session
    leads.forEach((l) => {
      // If a lead was already in the mock data as claimed, let's count it or ignore.
      // To keep counters highly interactive, let's sum all claimed leads from state!
      if (l.status === "claimed") {
        totalKg += l.weightKg;
        totalMeals += l.servings;
      }
    });

    return {
      totalKgRescued: totalKg,
      totalMealsServed: totalMeals,
      totalCo2OffsetKg: calculateCarbonOffset(totalKg),
    };
  }, [leads]);

  // Clean-up/Reset demo state handler
  const handleResetSandbox = () => {
    localStorage.removeItem("food_paradox_leads");
    setLeads(INITIAL_FOOD_LEADS);
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-800 antialiased selection:bg-emerald-100 selection:text-emerald-900 pb-12">
      {/* Upper Navigation Ribbons / Environment Information */}
      <div className="bg-stone-900 text-stone-300 py-2.5 px-4 md:px-8 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center bg-emerald-800/80 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold tracking-wider">
            SANDBOX ENVIRONMENT
          </span>
          <span className="text-[11px] text-stone-400 font-medium">
            Active Hub ID: <span className="font-mono text-stone-300">HUB-BAN-560</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-stone-400 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            Live System Time: <strong className="text-stone-300 font-mono">2026-06-26 09:33:56 (UTC-7)</strong>
          </span>
          <span className="hidden sm:inline text-stone-600">|</span>
          <button
            onClick={handleResetSandbox}
            className="text-stone-400 hover:text-white underline decoration-stone-600 transition-all font-semibold"
          >
            Reset Database State
          </button>
        </div>
      </div>

      {/* Main Container Header */}
      <header className="bg-white border-b border-stone-200 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-800 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-center shrink-0">
              <Utensils className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="font-sans font-black text-stone-900 text-xl tracking-tight uppercase">
                  The Food Paradox Platform
                </h1>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  B2B Hub
                </span>
              </div>
              <p className="text-stone-500 text-xs md:text-sm max-w-xl font-medium leading-relaxed">
                Logistics & Freshness monitoring connecting College Canteens and Restaurants with verified NGO redistribution partners.
              </p>
            </div>
          </div>

          {/* Stat Ticker inside Header */}
          <div className="flex items-center gap-5 bg-stone-50 border border-stone-150 p-3 rounded-2xl">
            <div className="text-center px-2">
              <span className="text-stone-400 text-[9px] uppercase font-mono block mb-0.5 font-bold">
                Rescued Today
              </span>
              <span className="font-mono text-stone-800 font-extrabold text-sm">
                +{derivedStats.totalKgRescued - 2650} kg
              </span>
            </div>
            <div className="text-stone-200 text-xl font-light">|</div>
            <div className="text-center px-2">
              <span className="text-stone-400 text-[9px] uppercase font-mono block mb-0.5 font-bold">
                Carbon Offset
              </span>
              <span className="font-mono text-emerald-700 font-extrabold text-sm">
                {derivedStats.totalCo2OffsetKg} kg
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction Card: Explains the Paradox */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-emerald-700" />
              Understanding the "Food Paradox"
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed max-w-4xl font-medium">
              Over <strong className="text-emerald-950 font-bold">40% of institutional food is discarded</strong> in messes and banquets due to strict over-catering buffers. Simultaneously, <strong className="text-emerald-950 font-bold">millions suffer severe food scarcity</strong> just kilometers away. This platform acts as a secure cold-chain bridge, minimizing logistics latency down to under an hour.
            </p>
          </div>
          <div className="text-xs text-stone-500 font-medium shrink-0 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            FSSAI Gated Safety Hub
          </div>
        </div>
      </section>

      {/* Primary Navigation Tabs */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 space-y-6">
        <div className="flex border-b border-stone-200 pb-px">
          <div className="flex gap-2 p-1 bg-stone-200/60 rounded-xl border border-stone-200">
            {/* Tab 1: Receiver Radar (default) */}
            <button
              onClick={() => setRole("receiver")}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all flex items-center gap-2 ${
                role === "receiver"
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Compass className="w-4 h-4" />
              Volunteer Radar Portal
            </button>

            {/* Tab 2: Donor Portal */}
            <button
              onClick={() => setRole("donor")}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all flex items-center gap-2 ${
                role === "donor"
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Donor Surplus Entry
            </button>

            {/* Tab 3: Impact Admin */}
            <button
              onClick={() => setRole("admin")}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all flex items-center gap-2 ${
                role === "admin"
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Impact & Carbon Analytics
            </button>
          </div>
        </div>

        {/* Content Container with Motion Transitions */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {role === "donor" && <DonorPanel onAddLead={handleAddLead} />}

              {role === "receiver" && (
                <ReceiverPanel leads={leads} onClaim={handleClaimLead} ngoPartners={ngoPartners} />
              )}

              {role === "admin" && <ImpactDashboard stats={derivedStats} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Details */}
      <footer className="max-w-7xl mx-auto px-4 md:px-8 mt-12 border-t border-stone-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-medium">
        <div>
          <p>© 2026 The Food Paradox B2B Consortium.</p>
          <p className="text-stone-400 text-[10px] mt-0.5">
            Supported by municipal health departments and student volunteer networks nationwide.
          </p>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-stone-700 underline">
            FSSAI Directives
          </a>
          <a href="#" className="hover:text-stone-700 underline">
            Methane Prevention standards
          </a>
          <a href="#" className="hover:text-stone-700 underline">
            Contact Hub
          </a>
        </div>
      </footer>
    </div>
  );
}
