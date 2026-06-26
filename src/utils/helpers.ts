/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LatLng } from "../types";

/**
 * Calculates distance in km between two GPS coordinates using the Haversine formula.
 */
export function calculateHaversineDistance(pt1: LatLng, pt2: LatLng): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((pt2.lat - pt1.lat) * Math.PI) / 180;
  const dLng = ((pt2.lng - pt1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pt1.lat * Math.PI) / 180) *
      Math.cos((pt2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1)); // Rounded to 1 decimal place
}

/**
 * Formats seconds into HH:MM:SS remaining time.
 * If expired, returns a string warning.
 */
export function formatFreshnessTimer(bestBeforeIso: string): {
  timeString: string;
  isExpired: boolean;
  percentage: number; // 0 to 100 representing life left from preparation
  urgency: "critical" | "warning" | "safe";
} {
  const target = new Date(bestBeforeIso).getTime();
  const now = new Date("2026-06-26T09:33:56-07:00").getTime(); // Use current local mock time
  const totalDuration = 5 * 60 * 60 * 1000; // Assume standard 5-hour FSSAI safe shelf life for prepared food
  const diff = target - now;

  if (diff <= 0) {
    return {
      timeString: "FSSAI Safety Limit Exceeded (Delisted)",
      isExpired: true,
      percentage: 0,
      urgency: "critical"
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const hStr = hours.toString().padStart(2, "0");
  const mStr = minutes.toString().padStart(2, "0");
  const sStr = seconds.toString().padStart(2, "0");

  const pct = Math.min(Math.max((diff / totalDuration) * 100, 0), 100);

  let urgency: "critical" | "warning" | "safe" = "safe";
  if (diff < 1.5 * 60 * 60 * 1000) {
    urgency = "critical"; // Less than 90 mins
  } else if (diff < 3 * 60 * 60 * 1000) {
    urgency = "warning"; // Less than 3 hours
  }

  return {
    timeString: `${hStr}:${mStr}:${sStr}`,
    isExpired: false,
    percentage: pct,
    urgency
  };
}

/**
 * Converts servings to weight in kilograms.
 * Average institutional serving weight is ~0.4 kg.
 */
export function servingsToKg(servings: number): number {
  return parseFloat((servings * 0.4).toFixed(1));
}

/**
 * Calculates CO2/Methane offset (prevention) in kg.
 *Rescuing 1 kg of food from landfill prevents ~2.5 kg of greenhouse gases (CO2e) primarily due to methane avoidance.
 */
export function calculateCarbonOffset(weightKg: number): number {
  return parseFloat((weightKg * 2.5).toFixed(1));
}

/**
 * Helper to get ISO timestamp offset by hours relative to local mock time anchor
 */
export function getRelativeTime(hoursOffset: number): string {
  const date = new Date("2026-06-26T09:33:56-07:00");
  date.setMinutes(date.getMinutes() + Math.round(hoursOffset * 60));
  return date.toISOString();
}
