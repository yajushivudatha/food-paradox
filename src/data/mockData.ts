/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FoodLead, NGO, MonthlyImpactData } from "../types";
import { getRelativeTime } from "../utils/helpers";

// Base coordinate representing the Volunteer/NGO Center
export const CENTER_COORDS = { lat: 12.9716, lng: 77.5946 }; // Bangalore-ish / default grid

export const INITIAL_NGO_PARTNERS: NGO[] = [
  {
    id: "ngo-1",
    name: "Robin Hood Army - Bangalore Student Chapter",
    verified: true,
    contactName: "Arjun Mehta",
    phone: "+91 98765 43210"
  },
  {
    id: "ngo-2",
    name: "Feed the Hungry Foundation",
    verified: true,
    contactName: "Priya Sharma",
    phone: "+91 98123 45678"
  },
  {
    id: "ngo-3",
    name: "Youth Against Hunger Club",
    verified: true,
    contactName: "Rahul Das",
    phone: "+91 97654 32109"
  }
];

export const INITIAL_FOOD_LEADS: FoodLead[] = [
  {
    id: "lead-1",
    donorName: "Main Campus Canteen - Block A",
    donorType: "canteen",
    foodType: "veg",
    foodName: "Steamed Rice, Dal Tadka & Roti",
    servings: 45,
    weightKg: 18.0,
    prepTime: getRelativeTime(-1.5), // Prepared 1.5 hrs ago
    bestBefore: getRelativeTime(2.5), // 2.5 hours remaining
    location: {
      address: "North Campus Main Canteen, Gate 2",
      lat: CENTER_COORDS.lat + 0.012,
      lng: CENTER_COORDS.lng - 0.008
    },
    hygieneChecks: {
      tempControl: true,
      noSpoilage: true,
      cleanContainers: true,
      hygieneStaff: true
    },
    status: "available",
    claimedBy: null,
    claimedAt: null,
    distance: 1.8,
    createdAt: getRelativeTime(-1.5)
  },
  {
    id: "lead-2",
    donorName: "Grand Palace Hotel & Restaurant",
    donorType: "hotel",
    foodType: "non-veg",
    foodName: "Chicken Dum Biryani & Raita",
    servings: 80,
    weightKg: 32.0,
    prepTime: getRelativeTime(-2.0),
    bestBefore: getRelativeTime(1.0), // 1 hour remaining - critical!
    location: {
      address: "M.G. Road, Opp Metro Pillar 140",
      lat: CENTER_COORDS.lat - 0.015,
      lng: CENTER_COORDS.lng + 0.018
    },
    hygieneChecks: {
      tempControl: true,
      noSpoilage: true,
      cleanContainers: true,
      hygieneStaff: true
    },
    status: "available",
    claimedBy: null,
    claimedAt: null,
    distance: 3.2,
    createdAt: getRelativeTime(-2.0)
  },
  {
    id: "lead-3",
    donorName: "Royal Treat Bistro",
    donorType: "restaurant",
    foodType: "veg",
    foodName: "Paneer Butter Masala & Garlic Naan",
    servings: 25,
    weightKg: 10.0,
    prepTime: getRelativeTime(-0.5),
    bestBefore: getRelativeTime(4.5), // 4.5 hours remaining
    location: {
      address: "5th Block, Koramangala Outer Ring Rd",
      lat: CENTER_COORDS.lat + 0.007,
      lng: CENTER_COORDS.lng + 0.024
    },
    hygieneChecks: {
      tempControl: true,
      noSpoilage: true,
      cleanContainers: true,
      hygieneStaff: true
    },
    status: "available",
    claimedBy: null,
    claimedAt: null,
    distance: 2.5,
    createdAt: getRelativeTime(-0.5)
  },
  {
    id: "lead-4",
    donorName: "Engineering Boys Hostel Mess",
    donorType: "mess",
    foodType: "veg",
    foodName: "Vegetable Pulao & Mix Raita",
    servings: 120,
    weightKg: 48.0,
    prepTime: getRelativeTime(-3.0),
    bestBefore: getRelativeTime(-0.2), // Just expired 12 mins ago! Test safety cutoff
    location: {
      address: "Boys Hostel Block 3 Ground Floor",
      lat: CENTER_COORDS.lat - 0.022,
      lng: CENTER_COORDS.lng - 0.015
    },
    hygieneChecks: {
      tempControl: true,
      noSpoilage: true,
      cleanContainers: true,
      hygieneStaff: true
    },
    status: "available",
    claimedBy: null,
    claimedAt: null,
    distance: 4.1,
    createdAt: getRelativeTime(-3.0)
  },
  {
    id: "lead-5",
    donorName: "Imperial Caterers",
    donorType: "restaurant",
    foodType: "non-veg",
    foodName: "Fish Curry & Basmati Rice",
    servings: 60,
    weightKg: 24.0,
    prepTime: getRelativeTime(-2.5),
    bestBefore: getRelativeTime(3.0),
    location: {
      address: "Koramangala 8th Block, Near Sports Complex",
      lat: CENTER_COORDS.lat - 0.005,
      lng: CENTER_COORDS.lng - 0.003
    },
    hygieneChecks: {
      tempControl: true,
      noSpoilage: true,
      cleanContainers: true,
      hygieneStaff: true
    },
    status: "claimed",
    claimedBy: "Robin Hood Army - Bangalore Student Chapter",
    claimedAt: getRelativeTime(-0.5),
    distance: 1.2,
    createdAt: getRelativeTime(-2.5)
  }
];

export const HISTORICAL_IMPACT_DATA: MonthlyImpactData[] = [
  { month: "Jan", rescuedKg: 850, hungerGapReduction: 22 },
  { month: "Feb", rescuedKg: 1100, hungerGapReduction: 28 },
  { month: "Mar", rescuedKg: 1450, hungerGapReduction: 35 },
  { month: "Apr", rescuedKg: 1780, hungerGapReduction: 42 },
  { month: "May", rescuedKg: 2100, hungerGapReduction: 48 },
  { month: "Jun", rescuedKg: 2650, hungerGapReduction: 56 } // Current Month (Jun 2026)
];
