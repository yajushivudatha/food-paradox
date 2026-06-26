/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FoodLead, LatLng } from "../types";
import { CENTER_COORDS } from "../data/mockData";
import { MapPin, Utensils, Info, ShieldCheck, Clock, CheckCircle2, ChevronRight, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatFreshnessTimer } from "../utils/helpers";

interface InteractiveMapProps {
  leads: FoodLead[];
  onClaim: (id: string) => void;
  selectedLeadId: string | null;
  onSelectLead: (id: string | null) => void;
  geofenceRadius: number; // in km
}

export default function InteractiveMap({
  leads,
  onClaim,
  selectedLeadId,
  onSelectLead,
  geofenceRadius,
}: InteractiveMapProps) {
  const [hoveredLeadId, setHoveredLeadId] = useState<string | null>(null);

  // SVG grid dimensions
  const width = 600;
  const height = 450;

  // Convert lat/lng coordinates to SVG x/y points
  // Map center is placed at center of SVG (300, 225)
  // Scaling: 1 degree latitude is ~111km. For a 10km grid, let's map coordinates.
  const latRange = 0.06; // height represents approx 6.6km (100px = 1.1km)
  const lngRange = 0.08; // width represents approx 8.8km

  const getCoordinates = (coords: LatLng) => {
    const latDiff = coords.lat - CENTER_COORDS.lat;
    const lngDiff = coords.lng - CENTER_COORDS.lng;

    // x increases to the right, y increases downwards
    const x = width / 2 + (lngDiff / lngRange) * width;
    const y = height / 2 - (latDiff / latRange) * height; // subtract because higher lat is up

    return { x, y };
  };

  const centerPos = getCoordinates(CENTER_COORDS);

  // Convert geofenceRadius (in km) to SVG pixels
  // Let's calculate the horizontal pixel radius for the geofence circle
  // 1 degree lng is ~111km * cos(lat). At Bangalore (12.97 N), cos is ~0.97, so ~108km.
  // Radius in degrees = geofenceRadius / 108
  // SVG radius = (Radius in degrees / lngRange) * width
  const svgRadius = (geofenceRadius / 108 / lngRange) * width;

  // Filter leads by geofence range
  const filteredLeads = leads.map((lead) => {
    const isInside = lead.distance <= geofenceRadius;
    const pos = getCoordinates(lead.location);
    const timeData = formatFreshnessTimer(lead.bestBefore);
    return { ...lead, ...pos, isInside, timeData };
  });

  const activeSelectedLead = filteredLeads.find((l) => l.id === selectedLeadId);

  return (
    <div className="relative bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Map Header / Control overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-sm border border-stone-100 flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-xs font-semibold text-stone-700 tracking-tight">
          LIVE LOGISTICS CANVAS
        </span>
        <span className="text-stone-300">|</span>
        <span className="text-[11px] font-medium text-stone-500">
          Geofence: <strong className="text-emerald-700 font-bold">{geofenceRadius} km</strong>
        </span>
      </div>

      {/* SVG Canvas Map */}
      <div className="w-full h-[450px] relative overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full bg-[#fcfbfa]"
          style={{ backgroundImage: "radial-gradient(#e5e5e0 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        >
          {/* Simulated Roads/Grid lines */}
          <g opacity="0.35" stroke="#d6d3d1" strokeWidth="1.5" strokeDasharray="4 2">
            {/* Roads */}
            <line x1="50" y1="0" x2="150" y2="450" />
            <line x1="0" y1="120" x2="600" y2="120" />
            <line x1="0" y1="300" x2="600" y2="350" />
            <line x1="450" y1="0" x2="380" y2="450" />
          </g>

          <g opacity="0.4" stroke="#e7e5e4" strokeWidth="6" strokeLinecap="round">
            {/* Main Transit Arteries */}
            <path d="M 0 225 Q 300 210 600 240" fill="none" />
            <path d="M 300 0 Q 310 225 280 450" fill="none" />
          </g>

          {/* Central NGO Volunteer Hub Icon representation */}
          <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
            {/* Signal waves */}
            <circle r="22" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.4" className="animate-ping" style={{ transformOrigin: "center" }} />
            <circle r="12" fill="#10b981" opacity="0.15" />
            <circle r="6" fill="#047857" />
          </g>

          {/* Geofencing Boundary Circle */}
          <circle
            cx={centerPos.x}
            cy={centerPos.y}
            r={svgRadius}
            fill="rgba(16, 185, 129, 0.025)"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            className="transition-all duration-300"
          />

          {/* Map labels */}
          <text x={centerPos.x + 10} y={centerPos.y - 10} className="font-sans font-bold text-[10px] fill-stone-600 tracking-wider">
            NGO HUB
          </text>
          <text x="35" y="110" className="font-mono text-[9px] fill-stone-400 tracking-wider font-semibold">
            NORTH SECTOR
          </text>
          <text x="470" y="390" className="font-mono text-[9px] fill-stone-400 tracking-wider font-semibold">
            SOUTH METRO GRID
          </text>

          {/* Render Food Leads as Interactive Nodes */}
          {filteredLeads.map((lead) => {
            const isSelected = selectedLeadId === lead.id;
            const isHovered = hoveredLeadId === lead.id;
            const hasExpired = lead.timeData.isExpired;

            // Determine colors and styling
            let markerColor = lead.foodType === "veg" ? "#10b981" : "#ef4444"; // Emerald vs Rose
            let markerBg = lead.foodType === "veg" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)";
            
            if (lead.status === "claimed") {
              markerColor = "#78716c"; // Gray for claimed
              markerBg = "rgba(120, 113, 108, 0.15)";
            } else if (hasExpired) {
              markerColor = "#a8a29e"; // Muted for expired
              markerBg = "rgba(168, 162, 158, 0.1)";
            }

            // Animate pulses if within geofence and available
            const shouldPulse = lead.isInside && lead.status === "available" && !hasExpired;

            return (
              <g
                key={lead.id}
                transform={`translate(${lead.x}, ${lead.y})`}
                className={`cursor-pointer transition-all duration-200 ${
                  lead.isInside ? "opacity-100" : "opacity-35 pointer-events-none"
                }`}
                onClick={() => lead.isInside && onSelectLead(isSelected ? null : lead.id)}
                onMouseEnter={() => lead.isInside && setHoveredLeadId(lead.id)}
                onMouseLeave={() => setHoveredLeadId(null)}
              >
                {/* Geofence Check Ripple */}
                {shouldPulse && (
                  <circle
                    r={isSelected ? "18" : "12"}
                    fill="none"
                    stroke={markerColor}
                    strokeWidth="1.5"
                    opacity="0.5"
                    className="animate-pulse"
                  />
                )}

                {/* Main Marker Background */}
                <circle
                  r={isSelected ? "12" : "8"}
                  fill={markerBg}
                  stroke={isSelected ? "#78350f" : markerColor}
                  strokeWidth={isSelected ? "2.5" : "2"}
                  className="transition-all duration-200"
                />

                {/* Marker Inner Point or Veg/Non-Veg icon indicator */}
                <circle
                  r={isSelected ? "4.5" : "3"}
                  fill={markerColor}
                  className="transition-all duration-200"
                />

                {/* Expiring / Urgent Flashing Ring */}
                {lead.status === "available" && lead.timeData.urgency === "critical" && !hasExpired && (
                  <circle
                    r="15"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    className="animate-spin"
                    style={{ transformOrigin: "center" }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay inside Map */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-sm border border-stone-100 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] font-medium text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Veg Lead</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Non-Veg Lead</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-500" />
            <span>Claimed / Delisted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 inline-flex items-center justify-center rounded-full border border-rose-500 animate-pulse text-[8px] font-bold text-rose-500">!</span>
            <span>Urgent (⏱️ &lt; 90m)</span>
          </div>
        </div>

        {/* Interactive Detail Drawer/Overlay when a marker is clicked */}
        <AnimatePresence>
          {activeSelectedLead && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 right-4 left-4 md:left-auto md:w-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-20"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        activeSelectedLead.foodType === "veg"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}
                    >
                      {activeSelectedLead.foodType}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 font-medium">
                      📍 {activeSelectedLead.distance} km away
                    </span>
                  </div>
                  <h4 className="font-sans font-bold text-stone-900 text-sm tracking-tight">
                    {activeSelectedLead.foodName}
                  </h4>
                </div>
                <button
                  onClick={() => onSelectLead(null)}
                  className="text-stone-400 hover:text-stone-600 hover:bg-stone-100 p-1 rounded-full transition-all"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-xs text-stone-500 mb-3 flex items-center gap-1.5">
                <span className="font-semibold text-stone-700">{activeSelectedLead.donorName}</span>
              </p>

              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-150 text-xs mb-3">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-mono block">Servings</span>
                  <span className="font-bold text-stone-800 text-sm">
                    {activeSelectedLead.servings} portions
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-mono block">Freshness Timer</span>
                  <span
                    className={`font-mono font-bold text-sm flex items-center gap-1 ${
                      activeSelectedLead.timeData.urgency === "critical"
                        ? "text-rose-600 animate-pulse"
                        : activeSelectedLead.timeData.urgency === "warning"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {activeSelectedLead.timeData.timeString}
                  </span>
                </div>
              </div>

              {/* Quality Checklist verification */}
              <div className="mb-4 bg-stone-50/50 p-2.5 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[10px] font-semibold tracking-wider uppercase block mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Digital Hygiene Certified
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-stone-500 font-medium">
                  <span className="flex items-center gap-1 text-emerald-700">✓ Cold Storage &lt;5°C</span>
                  <span className="flex items-center gap-1 text-emerald-700">✓ Spoilage Free</span>
                  <span className="flex items-center gap-1 text-emerald-700">✓ Food-Grade Pack</span>
                  <span className="flex items-center gap-1 text-emerald-700">✓ Hygienic Staff</span>
                </div>
              </div>

              {activeSelectedLead.status === "available" && !activeSelectedLead.timeData.isExpired ? (
                <button
                  onClick={() => {
                    onClaim(activeSelectedLead.id);
                    onSelectLead(null);
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-700/10 active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Claim for Pick-up
                </button>
              ) : activeSelectedLead.status === "claimed" ? (
                <div className="w-full bg-stone-100 text-stone-500 text-center py-2 px-4 rounded-xl text-xs font-bold border border-stone-200 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-stone-500" />
                  Already Claimed
                </div>
              ) : (
                <div className="w-full bg-stone-100 text-stone-400 text-center py-2 px-4 rounded-xl text-xs font-bold border border-stone-200">
                  Delisted (Safety Cutoff)
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating marker summary for fast coordinate verification */}
        {hoveredLeadId && !selectedLeadId && (
          <div
            className="absolute z-30 bg-stone-900/95 backdrop-blur-md text-white text-[11px] p-2 rounded-lg pointer-events-none shadow-md border border-stone-800"
            style={{
              left: `${getCoordinates(filteredLeads.find((l) => l.id === hoveredLeadId)!.location).x + 15}px`,
              top: `${getCoordinates(filteredLeads.find((l) => l.id === hoveredLeadId)!.location).y - 20}px`,
            }}
          >
            <p className="font-bold">{filteredLeads.find((l) => l.id === hoveredLeadId)!.foodName}</p>
            <p className="text-stone-300 text-[10px]">
              {filteredLeads.find((l) => l.id === hoveredLeadId)!.donorName} ({filteredLeads.find((l) => l.id === hoveredLeadId)!.distance}km)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
