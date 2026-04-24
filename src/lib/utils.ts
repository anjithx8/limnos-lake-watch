import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSatelliteDate(rawDate: string | null | undefined): string {
  if (!rawDate) {
    return "Unknown date";
  }

  const match = rawDate.match(/^[^_]*_([0-9]{8})/);
  if (!match) {
    return "Unknown date";
  }

  const datePart = match[1];
  const year = Number(datePart.slice(0, 4));
  const month = Number(datePart.slice(4, 6));
  const day = Number(datePart.slice(6, 8));

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function analyzeLakeStatus(analysisResult: any) {
  if (!analysisResult) return { status: "unknown", summary: "No data available", issues: [] };

  const issues = [];
  let status = "healthy";

  // Area deficit check
  if (analysisResult.area_deficit_pct && analysisResult.area_deficit_pct > 60) {
    issues.push("Severe water loss");
    status = "critical";
  } else if (analysisResult.area_deficit_pct && analysisResult.area_deficit_pct > 30) {
    issues.push("Significant water loss");
    status = status === "critical" ? "critical" : "moderate";
  }

  // Macrophyte check
  if (analysisResult.macrophyte?.coverage_pct && analysisResult.macrophyte.coverage_pct > 50) {
    issues.push("Heavy vegetation growth");
    status = "critical";
  } else if (analysisResult.macrophyte?.coverage_pct && analysisResult.macrophyte.coverage_pct > 20) {
    issues.push("Moderate vegetation");
    status = status === "critical" ? "critical" : "moderate";
  }

  // Chlorophyll check
  if (analysisResult.chlorophyll?.value && analysisResult.chlorophyll.value > 30) {
    issues.push("High algae levels");
    status = "critical";
  } else if (analysisResult.chlorophyll?.value && analysisResult.chlorophyll.value > 10) {
    issues.push("Elevated algae");
    status = status === "critical" ? "critical" : "moderate";
  }

  // Cloud cover
  if (analysisResult.cloud_cover_pct && analysisResult.cloud_cover_pct > 70) {
    issues.push("Heavy cloud cover affecting analysis");
  }

  const summary = issues.length > 0
    ? `Lake is in ${status} condition due to ${issues.join(", ").toLowerCase()}`
    : "Lake appears to be in healthy condition";

  return { status, summary, issues };
}
