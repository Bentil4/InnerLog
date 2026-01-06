import type { Journal, JournalEntry } from "./journal.js";

const STORAGE_KEY = "journalEntries";

export function loadEntries(): Journal {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data) as JournalEntry[];
    return parsed;
  } catch {
    return [];
  }
}

export function saveEntries(entries: Journal): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
