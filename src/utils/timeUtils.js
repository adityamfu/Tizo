import { formatInTimeZone } from "date-fns-tz";

export function nowInZone(zone) {
  return formatInTimeZone(new Date(), zone, "HH:mm:ss");
}

export function zoneAbbreviation(zone) {
  // contoh: WIB, CEST, PST
  try {
    return formatInTimeZone(new Date(), zone, "zzz");
  } catch {
    return "";
  }
}

export function zoneOffset(zone) {
  // contoh: UTC+7, UTC-5
  try {
    const offset = formatInTimeZone(new Date(), zone, "XXX");
    return `UTC${offset}`;
  } catch {
    return "";
  }
}
