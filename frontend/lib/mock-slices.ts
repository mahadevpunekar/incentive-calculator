import type { DataSliceDimensions } from "@/lib/mock-api/types";

/** Rotating slice assignments for mock dimensional data */
const SLAB: DataSliceDimensions[] = [
  {
    channel: "Direct",
    region: "Muscat",
    branch: "Head Office",
    staff: "ST-001",
    product: "Motor",
    month: "Jan",
  },
  {
    channel: "Broker",
    region: "Dhofar",
    branch: "Salalah",
    staff: "ST-002",
    product: "Marine",
    month: "Feb",
  },
  {
    channel: "Bancassurance",
    region: "Muscat",
    branch: "HQ Partner",
    staff: "ST-003",
    product: "Medical",
    month: "Mar",
  },
  {
    channel: "Online",
    region: "National",
    branch: "Digital",
    staff: "ST-004",
    product: "Motor",
    month: "Apr",
  },
  {
    channel: "Direct",
    region: "Al Batinah",
    branch: "Sohar",
    staff: "ST-005",
    product: "Property",
    month: "May",
  },
  {
    channel: "Broker",
    region: "Muscat",
    branch: "Ruwi",
    staff: "ST-006",
    product: "Engineering",
    month: "Jun",
  },
  {
    channel: "Direct",
    region: "Dhofar",
    branch: "Salalah",
    staff: "ST-007",
    product: "Motor",
    month: "Jan",
  },
  {
    channel: "Broker",
    region: "Muscat",
    branch: "Head Office",
    staff: "ST-008",
    product: "Medical",
    month: "Feb",
  },
];

export function mockSliceAt(i: number): DataSliceDimensions {
  return SLAB[i % SLAB.length];
}

export const FILTER_CHANNELS = [
  "All",
  "Direct",
  "Broker",
  "Bancassurance",
  "Online",
] as const;

export const FILTER_REGIONS = [
  "All",
  "Muscat",
  "Dhofar",
  "Al Batinah",
  "National",
] as const;

export const FILTER_BRANCHES = [
  "All",
  "Head Office",
  "Salalah",
  "Sohar",
  "Ruwi",
  "HQ Partner",
  "Digital",
] as const;

export const FILTER_STAFF = [
  "All",
  "ST-001",
  "ST-002",
  "ST-003",
  "ST-004",
  "ST-005",
  "ST-006",
  "ST-007",
  "ST-008",
] as const;

export const FILTER_PRODUCTS = [
  "All",
  "Motor",
  "Marine",
  "Medical",
  "Property",
  "Engineering",
] as const;

export const FILTER_MONTHS = [
  "all",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
] as const;
