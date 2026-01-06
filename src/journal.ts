import { setupForm, setupFilters, renderEntries } from "./ui.js";
import { loadEntries, saveEntries } from "./storage.js";

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
  value: T[keyof T]
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
  partialEntry: Omit<JournalEntry, "id" | "timestamp">
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
export function filterEntries(mood?: Mood, search?: string): Journal {
  return journal.filter((entry) => {
    const moodMatch = mood ? entry.mood === mood : true;
    const searchMatch = search
      ? entry.title.includes(search) || entry.content.includes(search)
      : true;
    return moodMatch && searchMatch;
  });
}

/**
 * Returns the current journal entries.
 * @returns {Journal} The current journal entries.
 * */
export function getEntries(): Journal {
  return journal;
}
