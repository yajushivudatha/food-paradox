/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FoodType = "veg" | "non-veg";
export type LeadStatus = "available" | "claimed" | "delivered";
export type DonorType = "canteen" | "mess" | "restaurant" | "hotel";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface FoodLead {
  id: string;
  donorName: string;
  donorType: DonorType;
  foodType: FoodType;
  foodName: string; // e.g., "Mixed Veg Curry & Roti", "Chicken Biryani"
  servings: number;
  weightKg: number; // For admin carbon offset tracking (approx servings * 0.4kg)
  prepTime: string; // e.g., "2026-06-26T08:00:00-07:00"
  bestBefore: string; // e.g., "2026-06-26T14:00:00-07:00" for Freshness Timer
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  hygieneChecks: {
    tempControl: boolean; // Food stored under 5C or over 60C
    noSpoilage: boolean;  // Checked for smell, texture, and appearance
    cleanContainers: boolean; // Packaged in clean, food-grade containers
    hygieneStaff: boolean;    // Handled by staff wearing masks/gloves
  };
  status: LeadStatus;
  claimedBy: string | null;
  claimedAt: string | null;
  distance: number; // Simulated distance in km from receiver
  createdAt: string;
}

export interface NGO {
  id: string;
  name: string;
  verified: boolean;
  contactName: string;
  phone: string;
}

export interface ImpactStats {
  totalKgRescued: number;
  totalMealsServed: number;
  totalCo2OffsetKg: number; // Methane/CO2 equivalent
}

export interface MonthlyImpactData {
  month: string;
  rescuedKg: number;
  hungerGapReduction: number; // percentage, e.g. 45%
}
