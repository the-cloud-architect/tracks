export type PackageTier =
  | "GAZEBO_ONLY"
  | "GAZEBO_HOUSE_3_DAY"
  | "GAZEBO_HOUSE_6_DAY"
  | "GAZEBO_HOUSE_ATV";

export type VenuePackage = {
  key: PackageTier;
  name: string;
  priceCents: number;
  depositCents: number;
  duration: string;
  summary: string;
};

export const DEFAULT_VENUE_PACKAGES: VenuePackage[] = [
  {
    key: "GAZEBO_ONLY",
    name: "Gazebo Ceremony",
    priceCents: 120000,
    depositCents: 30000,
    duration: "4 hours",
    summary: "Ceremony space for up to 40 guests with sound-system access.",
  },
  {
    key: "GAZEBO_HOUSE_3_DAY",
    name: "Gazebo + Depot House (3 Day)",
    priceCents: 390000,
    depositCents: 90000,
    duration: "3 days / 2 nights",
    summary: "Ceremony package plus full house access for wedding weekend stays.",
  },
  {
    key: "GAZEBO_HOUSE_6_DAY",
    name: "Gazebo + Depot House (6 Day)",
    priceCents: 640000,
    depositCents: 150000,
    duration: "6 days / 5 nights",
    summary: "Extended stay package for destination-style celebrations.",
  },
  {
    key: "GAZEBO_HOUSE_ATV",
    name: "Gazebo + House + ATV Experience",
    priceCents: 720000,
    depositCents: 175000,
    duration: "3 days / 2 nights",
    summary: "Adds guided ATV trail access and game-site activity routes.",
  },
];

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
