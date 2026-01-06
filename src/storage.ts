import type { Journal, JournalEntry } from "./journal.js";

const STORAGE_KEY = "journalEntries";

/**
 * Loads the journal entries from localStorage.
 * Returns an empty array if there is no data to load.
 * If there is an error parsing the data, returns an empty array.
 * @returns {Journal} The loaded journal entries.
 */
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

/**
 * Saves the given journal entries to localStorage.
 * @param {Journal} entries The entries to save.
 */
export function saveEntries(entries: Journal): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
