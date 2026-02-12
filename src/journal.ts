import { setupForm, setupFilters, setupActions, renderEntries } from "./ui.js";
import { loadEntries, saveEntries, loadTheme, saveTheme } from "./storage.js";

export enum Mood {
  HAPPY = "HAPPY",
  SAD = "SAD",
  MOTIVATED = "MOTIVATED",
  STRESSED = "STRESSED",
  CALM = "CALM",
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  timestamp: number;
}

export type Journal = JournalEntry[];

/**
 * Finds an element in a list by its property value.
 *
 * @template T The type of the list elements.
 * @param {T[]} list The list to search in.
 * @param {keyof T} key The property key to search for.
 * @param {T[keyof T]} value The value to search for.
 * @returns {T | undefined} The element if found, otherwise undefined.
 */
export function findByProperty<T>(
  list: T[],
  key: keyof T,
  value: T[keyof T],
): T | undefined {


  return list.find((item) => item[key] === value);
}

let journal: Journal = loadEntries();

/**
 * Adds a new journal entry to the journal.
 * The new entry is created by spreading the given partial entry
 * onto a new object with an auto-generated id and timestamp.
 * The new entry is then added to the journal and saved to storage.
 * @param {Omit<JournalEntry, "id" | "timestamp">} partialEntry
 * The partial entry to add, without an id or timestamp.
 */
export function addEntry(
  partialEntry: Omit<JournalEntry, "id" | "timestamp">,
): void {
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...partialEntry,
  };
  journal.push(entry);
  saveEntries(journal);
}

/**
 * Edits an existing journal entry with the given id and updates.
 * If the entry is found, the updates are applied to the entry using
 * Object.assign(). The journal is then saved to storage.
 * @param {string} id The id of the entry to edit.
 * @param {Partial<JournalEntry>} updates The partial entry with the updates.
 */
export function editEntry(id: string, updates: Partial<JournalEntry>): void {
  const entry = findByProperty(journal, "id", id);
  if (entry) {
    Object.assign(entry, updates);
    saveEntries(journal);
  }
}

/**
 * Deletes a journal entry with the given id.
 * If the entry is found, it is removed from the journal and the updated
 * journal is saved to storage.
 * @param {string} id The id of the entry to delete.
 */
export function deleteEntry(id: string): void {
  journal = journal.filter((entry) => entry.id !== id);
  saveEntries(journal);
}

/**
 * Filters the journal entries based on the given mood and search.
 * If mood is given, only entries with the given mood are returned.
 * If search is given, only entries with titles or content that include
 * the given search string are returned.
 * If neither mood nor search is given, all entries are returned.
 * @param {Mood} [mood]  mood to filter by.
 * @param {string} [search] search string to filter by.
 * @returns {Journal} filtered journal entries.
 */

export function filterEntries(mood?: string, search?: string): Journal {
  const moodLower = mood?.trim().toLowerCase();
  const searchLower = search?.trim().toLowerCase();

  return journal.filter((entry) => {
    const moodMatch = moodLower ? entry.mood.toLowerCase() === moodLower : true;

    if (!searchLower) return moodMatch;

    const titleMatch = entry.title.toLowerCase().includes(searchLower);
    const contentMatch = entry.content.toLowerCase().includes(searchLower);

    return moodMatch && (titleMatch || contentMatch);
  });
}

/**
 * Returns the current journal entries.
 * @returns {Journal} The current journal entries.
 * */
export function getEntries(): Journal {
  return journal;
}

//toggle

function init() {
  const toggle = document.getElementById("toggle") as HTMLButtonElement;
  const body = document.body;
  const toggleImg = document.getElementById("toggleImg") as HTMLImageElement;

  // Load saved theme
  const savedTheme = loadTheme();
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    toggleImg.src = "./assets/images/icon-moon.svg";
  } else {
    toggleImg.src = "./assets/images/icon-sun.svg";
  }

  toggle.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-theme");
    if (isDark) {
      toggleImg.src = "./assets/images/icon-moon.svg";
      saveTheme("dark");
    } else {
      toggleImg.src = "./assets/images/icon-sun.svg";
      saveTheme("light");
    }
  });

  journal = loadEntries();
  setupForm();
  setupFilters();
  setupActions();
  renderEntries(journal);
}

document.addEventListener("DOMContentLoaded", init);
