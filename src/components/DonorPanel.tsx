/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FoodType, DonorType, FoodLead } from "../types";
import { servingsToKg, getRelativeTime } from "../utils/helpers";
import { ShieldCheck, Plus, Leaf, Flame, AlertCircle, Sparkles, PlusCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DonorPanelProps {
  onAddLead: (lead: Omit<FoodLead, "id" | "distance" | "status" | "claimedBy" | "claimedAt" | "createdAt">) => void;
}

export default function DonorPanel({ onAddLead }: DonorPanelProps) {
  // Form State
  const [donorName, setDonorName] = useState("Main Campus Canteen - Block A");
  const [donorType, setDonorType] = useState<DonorType>("canteen");
  const [foodType, setFoodType] = useState<FoodType>("veg");
  const [foodName, setFoodName] = useState("");
  const [servings, setServings] = useState(30);
  const [prepHoursAgo, setPrepHoursAgo] = useState(0); // 0 means just prepared
  const [bestBeforeHours, setBestBeforeHours] = useState(4); // default 4 hours safe window
  const [address, setAddress] = useState("North Campus Main Canteen, Gate 2");

  // Hygiene ledger checks
  const [checks, setChecks] = useState({
    tempControl: false,
    noSpoilage: false,
    cleanContainers: false,
    hygieneStaff: false,
  });

  // Success indicator
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleToggleCheck = (key: keyof typeof checks) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isHygieneLedgerComplete = Object.values(checks).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodName.trim()) {
      setErrorMsg("Please enter the name of the surplus food item.");
      return;
    }

    if (!isHygieneLedgerComplete) {
      setErrorMsg("The FSSAI Digital Hygiene Ledger is mandatory. All safety checks must be verified.");
      return;
    }

    setErrorMsg("");

    // Calculate dates relative to local mock time anchor
    const prepTime = getRelativeTime(-prepHoursAgo);
    const bestBefore = getRelativeTime(-prepHoursAgo + bestBeforeHours);

    onAddLead({
      donorName,
      donorType,
      foodType,
      foodName: foodName.trim(),
      servings,
      weightKg: servingsToKg(servings),
      prepTime,
      bestBefore,
      location: {
        address: address.trim() || "Main Campus, Gate 2",
        // Give a slightly randomized location offset within Bangalore area
        lat: 12.9716 + (Math.random() - 0.5) * 0.04,
        lng: 77.5946 + (Math.random() - 0.5) * 0.04,
      },
      hygieneChecks: { ...checks },
    });

    // Reset form states
    setFoodName("");
    setChecks({
      tempControl: false,
      noSpoilage: false,
      cleanContainers: false,
      hygieneStaff: false,
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm relative overflow-hidden">
      {/* Decorative gradient background element */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full filter blur-xl pointer-events-none" />

      <h2 className="font-sans font-bold text-stone-900 text-lg mb-1 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-emerald-600" />
        Donor Surplus Portal
      </h2>
      <p className="text-xs text-stone-500 mb-6">
        Log excess institutional food instantly to alert volunteers in your geofence.
      </p>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Surplus Rescued Successfully!</p>
              <p className="text-emerald-600 mt-0.5">
                Your entry has been listed on the Live Logistics Canvas. Verified NGOs in your 5-10km radius have been notified.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Donor Profile presets for ease of simulation */}
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Donor Facility Name
            </label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Facility Type
            </label>
            <select
              value={donorType}
              onChange={(e) => setDonorType(e.target.value as DonorType)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="canteen">College Canteen</option>
              <option value="mess">Hostel Mess</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Star Hotel</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Dispatch Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            required
          />
        </div>

        <hr className="border-stone-100" />

        {/* Food specific properties */}
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Surplus Food Name / Items
            </label>
            <input
              type="text"
              placeholder="e.g., Dal Chawal, Vegetable Pulao & Roti (Packaged)"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Classification
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFoodType("veg")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    foodType === "veg"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Veg
                </button>
                <button
                  type="button"
                  onClick={() => setFoodType("non-veg")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    foodType === "non-veg"
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  Non-Veg
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Portions (Est. Servings)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={servings}
                  onChange={(e) => setServings(Math.max(5, parseInt(e.target.value) || 5))}
                  className="w-20 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-600 text-center"
                />
                <span className="text-[10px] text-stone-400 font-mono">
                  ~{servingsToKg(servings)} kg saved
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Prepared When?
              </label>
              <select
                value={prepHoursAgo}
                onChange={(e) => setPrepHoursAgo(parseFloat(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="0">Just prepared (Now)</option>
                <option value="0.5">30 mins ago</option>
                <option value="1">1 hour ago</option>
                <option value="2">2 hours ago</option>
                <option value="3">3 hours ago</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                FSSAI Shelf-Life
              </label>
              <select
                value={bestBeforeHours}
                onChange={(e) => setBestBeforeHours(parseInt(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="3">3 hours remaining</option>
                <option value="4">4 hours remaining (Std)</option>
                <option value="5">5 hours remaining</option>
                <option value="6">6 hours remaining</option>
              </select>
            </div>
          </div>
        </div>

        {/* Digital Hygiene Ledger Form Section */}
        <div className="bg-stone-50 border border-stone-150 rounded-2xl p-4.5 space-y-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-mono text-xs font-bold text-stone-700 tracking-tight">
              FSSAI DIGITAL HYGIENE LEDGER
            </span>
            <span className="ml-auto text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-emerald-150 text-emerald-800 border border-emerald-200">
              MANDATORY
            </span>
          </div>

          <p className="text-[10px] text-stone-500 leading-relaxed mb-2">
            These parameters verify strict cold-chain or hot-holding food hygiene guidelines prior to NGO pickup dispatch.
          </p>

          <div className="space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={checks.tempControl}
                onChange={() => handleToggleCheck("tempControl")}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 mt-0.5"
              />
              <span className="text-[11px] text-stone-600 font-medium">
                Food kept in controlled temp storage (<strong className="text-stone-800">Cold &lt; 5°C</strong> or <strong className="text-stone-800">Hot &gt; 60°C</strong>)
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={checks.noSpoilage}
                onChange={() => handleToggleCheck("noSpoilage")}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 mt-0.5"
              />
              <span className="text-[11px] text-stone-600 font-medium">
                Inspected sensory parameters (no acidic odor, discoloration, or signs of mold)
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={checks.cleanContainers}
                onChange={() => handleToggleCheck("cleanContainers")}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 mt-0.5"
              />
              <span className="text-[11px] text-stone-600 font-medium">
                Securely packed in sanitized food-grade aluminum or virgin-poly containers
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={checks.hygieneStaff}
                onChange={() => handleToggleCheck("hygieneStaff")}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 mt-0.5"
              />
              <span className="text-[11px] text-stone-600 font-medium">
                Handled by staff dressed in clean aprons, hair nets, and protective gloves
              </span>
            </label>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
            isHygieneLedgerComplete
              ? "bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer shadow-emerald-700/10 active:scale-[0.99]"
              : "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed shadow-none"
          }`}
        >
          <Plus className="w-4 h-4" />
          Authorize & Post Surplus
        </button>
      </form>
    </div>
  );
}
