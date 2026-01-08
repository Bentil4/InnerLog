import type { JournalEntry } from "./journal.js";
import { Mood } from "./journal.js";
import {
  addEntry,
  editEntry,
  deleteEntry,
  filterEntries,
  getEntries,
  findByProperty,
} from "./journal.js";

let editingId: string | null = null;

/**
 * Returns an HTML string representing a single journal entry.
 * The string is in the format of a section element with classes
 * "journal-entry" and "journal-entry--<mood>".
 * The section contains an h3 with the entry title, a p with the entry content,
 * a span with the entry mood, a span with the entry timestamp, and two
 * buttons for editing and deleting the entry.
 * @param {JournalEntry} entry The journal entry to render.
 * @returns {string} The rendered HTML string.
 */
const entryTemplate = (entry: JournalEntry): string => `
    <section class="journal-entry journal-entry--${entry.mood.toLowerCase()}">
        <div>
        <h3 class="journal-entry__title">${entry.title}</h3>
        <p class="journal-entry__content">${entry.content}</p>
        <span class="journal-entry__mood">${entry.mood}</span>
        <span class="journal-entry__timestamp">${new Date(
          entry.timestamp
        ).toLocaleString()}</span>
        </div>
        <div class="journal-entry__actions">
        <button class="journal-entry__edit" data-id="${entry.id}">Edit</button>
        <button class="journal-entry__delete" data-id="${
          entry.id
        }">Delete</button>
        </div>
    </section>
`;

/**
 * Renders the given journal entries to the page.
 * The entries are rendered by mapping the entryTemplate function over the
 * given entries and joining the resulting strings together.
 * The resulting string is then set as the innerHTML of the element with
 * the class "journal-app__entries".
 * @param {JournalEntry[]} entries The journal entries to render.
 */
export function renderEntries(entries: JournalEntry[]): void {
  const container = document.querySelector(
    ".journal-app__entries"
  ) as HTMLDivElement;
  container.innerHTML = entries.map(entryTemplate).join("");
}

/**
 * Sets up the journal form by adding a submit event listener.
 * extracts the form data, creates a new JournalEntry with the extracted data,
 * adds the new entry to the journal, resets the form, and renders the updated
 * journal entries.
 */
export function setupForm(): void {
  const form = document.querySelector(".journal-app__form") as HTMLFormElement;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const mood = formData.get("mood") as Mood;
    if (editingId) {
      editEntry(editingId, { title, content, mood });
      editingId = null;
      const button = form.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      button.textContent = "Add Entry";
    } else {
      addEntry({ title, content, mood });
    }
    form.reset();
    renderEntries(getEntries());
  });
  // Populate mood select with Enum values
  const moodSelect = form.querySelector(
    'select[name="mood"]'
  ) as HTMLSelectElement;
  Object.values(Mood).forEach((mood) => {
    const option = document.createElement("option");
    option.value = mood;
    option.text = mood;
    moodSelect.add(option);
  });
}

/**
 * Sets up the journal filters by adding change and input event listeners
 * to the mood filter select and search input respectively.
 * When either event is triggered, the updateFilters function is called,
 * which filters the journal entries based on the current mood filter and search
 * values, and renders the updated filtered entries.
 */
export function setupFilters(): void {
  const moodFilter = document.querySelector(
    'select[name="mood-filter"]'
  ) as HTMLSelectElement;
  const searchInput = document.querySelector(
    'input[name="search"]'
  ) as HTMLInputElement;

  /**
   * Filters the journal entries based on the current mood filter and search
   * values, and renders the updated filtered entries.
   */
  function updateFilters() {
    const mood = (moodFilter.value || undefined) as Mood | undefined;
    const search = searchInput.value;
    const filtered = filterEntries(mood, search);
    renderEntries(filtered);
  }

  moodFilter.addEventListener("change", updateFilters);
  searchInput.addEventListener("input", updateFilters);

  // Populate mood filter select
  Object.values(Mood).forEach((mood) => {
    const option = document.createElement("option");
    option.value = mood;
    option.text = mood;
    moodFilter.add(option);
  });
}

/**
 * Sets up event listeners for the edit and delete buttons in the journal
 * entries section.
 * When an edit button is clicked, the corresponding entry is found and the
 * journal form is populated with the entry's data. The form submit button
 * is also updated to display "Update Entry".
 * When a delete button is clicked, the corresponding entry is deleted and the
 * updated journal entries are rendered.
 */
export function setupActions(): void {
  const container = document.querySelector(
    ".journal-app__entries"
  ) as HTMLElement;
  container.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("journal-entry__edit")) {
      const id = target.dataset.id!;
      const entry = findByProperty(getEntries(), "id", id);
      if (entry) {
        const form = document.querySelector(
          ".journal-app__form"
        ) as HTMLFormElement;
        (form.querySelector('input[name="title"]') as HTMLInputElement).value =
          entry.title;
        (
          form.querySelector('textarea[name="content"]') as HTMLTextAreaElement
        ).value = entry.content;
        (form.querySelector('select[name="mood"]') as HTMLSelectElement).value =
          entry.mood;
        editingId = id;
        const button = form.querySelector(
          'button[type="submit"]'
        ) as HTMLButtonElement;
        button.textContent = "Update Entry";
      }
    } else if (target.classList.contains("journal-entry__delete")) {
      const id = target.dataset.id!;
      deleteEntry(id);
      renderEntries(getEntries());
    }
  });
}
