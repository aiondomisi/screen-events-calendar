import { randomUUID } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createEvents, type EventAttributes } from "ics";
import { countries, continents } from "countries-list";
import type { FestivalDataset, FestivalEntry } from "./types.js";

type Continent =
  | "africa"
  | "asia"
  | "europe"
  | "north-america"
  | "south-america"
  | "oceania";

const CONTINENT_FILES: Record<string, Continent> = {
  Africa: "africa",
  Asia: "asia",
  Europe: "europe",
  "North America": "north-america",
  "South America": "south-america",
  Oceania: "oceania",
};

// Build the country-name lookup once instead of searching the
// countries list for every festival.
const countriesByName = new Map(
  Object.values(countries).map((country) => [country.name, country]),
);

function toDateArray(dateStr: string): [number, number, number] {
  const [y, m, d] = dateStr.split("-").map(Number);

  return [y, m, d];
}

// Deterministic slug so re-runs on the same entry don't churn UIDs
// every time (falls back to a random UUID if there's nothing to key off).
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureUid(entry: FestivalEntry): string {
  if (entry.uid && entry.uid.trim() !== "") {
    return entry.uid;
  }

  const base = slugify(
    `${entry.name}-${entry.startDate ?? ""}-${entry.country ?? ""}`,
  );

  const uid = base ? `${base}@festival-ics.example` : randomUUID();

  console.warn(`Generated missing uid for "${entry.name}": ${uid}`);

  return uid;
}

// Entries without a usable startDate/endDate can't become ICS events —
// filter them out (and warn) before anything else touches them.
function hasValidDates(
  entry: FestivalEntry,
): entry is FestivalEntry & { startDate: string; endDate: string } {
  if (!entry.startDate || !entry.endDate) {
    console.warn(`Skipping "${entry.name}" — missing startDate/endDate.`);

    return false;
  }

  return true;
}

function toEvent(entry: FestivalEntry): EventAttributes {
  const title =
    entry.status === "cancelled"
      ? `[CANCELLED] ${entry.name}`
      : entry.status === "rescheduled"
        ? `[RESCHEDULED] ${entry.name}`
        : entry.name;

  return {
    uid: ensureUid(entry),
    title,
    start: toDateArray(entry.startDate),
    end: toDateArray(entry.endDate),
    startInputType: "local",
    location: [entry.city, entry.country].filter(Boolean).join(", "),
    url: entry.website,
    description: [
      entry.category,
      entry.notes,
      entry.website ? `Website: ${entry.website}` : undefined,
      `Source: ${entry.sourceUrl}`,
    ]
      .filter(Boolean)
      .join("\n"),
    status:
      entry.status === "cancelled"
        ? "CANCELLED"
        : entry.status === "tentative"
          ? "TENTATIVE"
          : "CONFIRMED",
  };
}

function getContinent(countryName: string): Continent | undefined {
  const country = countriesByName.get(countryName);

  if (!country) {
    return undefined;
  }

  const continentName = continents[country.continent];

  return CONTINENT_FILES[continentName];
}

async function writeCalendar(filename: string, entries: FestivalEntry[]) {
  const validEntries = entries.filter(hasValidDates);
  const events = validEntries.map(toEvent);

  const { error, value } = createEvents(events);

  if (error) {
    throw error;
  }

  await writeFile(`dist/${filename}`, value ?? "", "utf-8");

  console.log(`Wrote dist/${filename} with ${events.length} events.`);
}

async function main() {
  const raw = await readFile("data/events.json", "utf-8");

  const dataset = JSON.parse(raw) as FestivalDataset & {
    events?: FestivalEntry[];
  };

  // Support either "festivals" or "events" as the top-level key, since
  // the source JSON has used both names.
  const rawFestivals = dataset.festivals ?? dataset.events;

  if (!Array.isArray(rawFestivals)) {
    throw new Error(
      'data/events.json must contain a top-level "festivals" (or "events") array.',
    );
  }

  await mkdir("dist", { recursive: true });

  // Only keep entries with usable dates for everything downstream
  // (the "complete" calendar and the per-category/continent split).
  const validFestivals = rawFestivals.filter(hasValidDates);

  /*
   * Generate the complete festival calendar.
   *
   * dist/festivals.ics
   */
  await writeCalendar("festivals.ics", validFestivals);

  /*
   * Group festivals by category and continent.
   */
  const categoryContinentEvents = new Map<string, FestivalEntry[]>();

  for (const entry of validFestivals) {
    const continent = getContinent(entry.country);

    if (!continent) {
      console.warn(
        `Could not determine continent for "${entry.name}" (${entry.country})`,
      );

      continue;
    }

    const key = `${entry.category}-${continent}`;

    const events = categoryContinentEvents.get(key) ?? [];

    events.push(entry);

    categoryContinentEvents.set(key, events);
  }

  /*
   * Generate one calendar for each category + continent combination.
   *
   * dist/award-oceania.ics
   * dist/festival-oceania.ics
   * dist/award-asia.ics
   * dist/festival-asia.ics
   */
  for (const [key, entries] of categoryContinentEvents) {
    await writeCalendar(`${key}.ics`, entries);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
