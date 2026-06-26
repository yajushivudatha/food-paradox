/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { FoodLead, NGO } from "../types";
import { formatFreshnessTimer } from "../utils/helpers";
import { MapPin, Search, Filter, Sliders, Clock, Compass, Check, AlertTriangle, ShieldAlert } from "lucide-react";
import InteractiveMap from "./InteractiveMap";

interface ReceiverPanelProps {
  leads: FoodLead[];
  onClaim: (id: string) => void;
  ngoPartners: NGO[];
}

export default function ReceiverPanel({ leads, onClaim, ngoPartners }: ReceiverPanelProps) {
  // Filters & Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [foodTypeFilter, setFoodTypeFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [geofenceRadius, setGeofenceRadius] = useState(8); // default 8km radius
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedNgo, setSelectedNgo] = useState(ngoPartners[0]?.name || "Robin Hood Army");

  // Timer Ticker state to force React update every second for live countdowns
  const [timeTicker, setTimeTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTicker((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter leads list based on criteria
  const processedLeads = leads.map((lead) => {
    return {
      ...lead,
      timer: formatFreshnessTimer(lead.bestBefore),
    };
  });

  const filteredLeads = processedLeads.filter((lead) => {
    // 1. Radius check
    if (lead.distance > geofenceRadius) return false;

    // 2. Search query check (name or donor)
    const matchesSearch =
      lead.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 3. Veg/Non-Veg filter
    if (foodTypeFilter !== "all" && lead.foodType !== foodTypeFilter) return false;

    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left side: Interactive Map & Live Geofencing Coordinates (7 cols) */}
      <div className="lg:col-span-7 space-y-5">
        <InteractiveMap
          leads={leads}
          onClaim={(id) => onClaim(id)}
          selectedLeadId={selectedLeadId}
          onSelectLead={setSelectedLeadId}
          geofenceRadius={geofenceRadius}
        />

        {/* Real-time geofence radar data display */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2.5 rounded-xl border border-emerald-200">
              <Compass className="w-5 h-5 text-emerald-800 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div>
              <h4 className="font-sans font-bold text-stone-800 text-xs uppercase tracking-wider">
                Geofence Radar Syncing
              </h4>
              <p className="text-[11px] text-stone-500 font-medium">
                Scanning coordinates relative to <strong className="text-stone-700">NGO Hub</strong> (Bangalore Center).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-stone-400 text-xs">Claiming NGO Identity:</span>
            <select
              value={selectedNgo}
              onChange={(e) => setSelectedNgo(e.target.value)}
              className="bg-white border border-stone-200 text-xs font-semibold px-2.5 py-1.5 rounded-xl text-stone-700 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            >
              {ngoPartners.map((ngo) => (
                <option key={ngo.id} value={ngo.name}>
                  {ngo.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Right side: Leads listings & Radius Filters (5 cols) */}
      <div className="lg:col-span-5 space-y-5">
        {/* Search, Filter, and Radius Configuration Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4.5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-stone-900 text-sm tracking-tight flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-700" />
              Filter Food Leads
            </h3>
            <span className="text-[10px] font-mono text-stone-400 font-bold">
              {filteredLeads.length} leads found
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search donor facility or food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Veg/Non-Veg Segmented Control */}
          <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1 rounded-xl">
            {(["all", "veg", "non-veg"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFoodTypeFilter(type)}
                className={`py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all ${
                  foodTypeFilter === type
                    ? "bg-white text-stone-800 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Radius Geofence Slider */}
          <div className="pt-2">
            <div className="flex justify-between text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              <span>Geo-fencing Radius</span>
              <span className="text-emerald-700 font-bold">{geofenceRadius} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              step="1"
              value={geofenceRadius}
              onChange={(e) => setGeofenceRadius(parseInt(e.target.value))}
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-stone-400 font-mono mt-1">
              <span>2 km</span>
              <span>8 km</span>
              <span>15 km</span>
            </div>
          </div>
        </div>

        {/* Leads List Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 h-[290px] overflow-y-auto space-y-3">
          {filteredLeads.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <MapPin className="w-8 h-8 text-stone-300 stroke-[1.5] mb-2" />
              <p className="text-xs font-semibold text-stone-500">No active surplus inside geofence</p>
              <p className="text-[10px] text-stone-400 mt-1">
                Try expanding your radius or clear search filters.
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const hasExpired = lead.timer.isExpired;
              const isSelected = selectedLeadId === lead.id;

              return (
                <div
                  key={lead.id}
                  onClick={() => !hasExpired && setSelectedLeadId(isSelected ? null : lead.id)}
                  className={`bg-white border rounded-xl p-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? "ring-1.5 ring-emerald-700 border-emerald-300 shadow-sm"
                      : "border-stone-150 hover:border-stone-300 shadow-sm"
                  } ${hasExpired ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2.5 mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`text-[8px] uppercase font-extrabold tracking-wider px-1.5 py-0.2 rounded-md ${
                            lead.foodType === "veg"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                              : "bg-rose-50 text-rose-800 border border-rose-100"
                          }`}
                        >
                          {lead.foodType}
                        </span>
                        <span className="text-[9px] font-mono text-stone-400 font-semibold">
                          📍 {lead.distance} km away
                        </span>
                      </div>
                      <h4 className="font-sans font-bold text-stone-900 text-xs tracking-tight">
                        {lead.foodName}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 shrink-0">
                      ⏱️ {lead.timer.timeString.split(":")[0]}h {lead.timer.timeString.split(":")[1]}m remaining
                    </span>
                  </div>

                  <p className="text-[10px] text-stone-500 mb-2.5">
                    Donor: <span className="font-semibold text-stone-700">{lead.donorName}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-500 border-t border-stone-100 pt-2.5 mb-2.5">
                    <div>
                      <span className="text-stone-400 block uppercase text-[8px] tracking-wider font-semibold">
                        Estimated Servings
                      </span>
                      <span className="font-bold text-stone-800 text-[11px]">{lead.servings} portions</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block uppercase text-[8px] tracking-wider font-semibold">
                        FSSAI Status
                      </span>
                      <span
                        className={`font-bold text-[11px] uppercase ${
                          lead.timer.urgency === "critical"
                            ? "text-rose-600 animate-pulse"
                            : lead.timer.urgency === "warning"
                            ? "text-amber-600"
                            : "text-emerald-700"
                        }`}
                      >
                        {lead.timer.urgency === "critical" ? "Critical Freshness" : "Safe Shelf-Life"}
                      </span>
                    </div>
                  </div>

                  {/* Operational Claim Button */}
                  {lead.status === "available" && !hasExpired ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClaim(lead.id);
                      }}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Claim Food Lead
                    </button>
                  ) : lead.status === "claimed" ? (
                    <div className="w-full bg-stone-100 text-stone-500 border border-stone-200 text-center py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Claimed by: {lead.claimedBy}
                    </div>
                  ) : (
                    <div className="w-full bg-stone-150 text-stone-400 border border-stone-200 text-center py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
                      Expired safety cutoff
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
