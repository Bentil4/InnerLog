import type { Journal, JournalEntry } from "./journal.js";

const STORAGE_KEY = "journalEntries";
const THEME_KEY = "theme";

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

/**
 * Loads the saved theme from localStorage.
 * Returns "light" if no theme is saved.
 * @returns {string} The saved theme ("light" or "dark").
 */
export function loadTheme(): string {
  return localStorage.getItem(THEME_KEY) || "light";
}

/**
 * Saves the given theme to localStorage.
 * @param {string} theme The theme to save ("light" or "dark").
 */
export function saveTheme(theme: string): void {
  localStorage.setItem(THEME_KEY, theme);
}
