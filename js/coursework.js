/* ═══════════════════════════════════════════════════════════════
   coursework.js — filters + sorting on the coursework page

   What it does:
     • Subject buttons (All / Accounting / Business Analytics) hide the
       course cards that don't match.
     • The "Newest first / Oldest first" button re-orders the cards by
       the term written on each card (e.g. "Fall, 2025").
     • Opening accounting.html#business-analytics (or #accounting) starts
       with that subject already selected.

   You don't need to edit this file. To add a course, add a card in
   accounting.html with data-subject and a term like "Fall, 2025".
   ═══════════════════════════════════════════════════════════════ */

const list = document.getElementById("course-list");
const empty = document.getElementById("course-empty");
const chips = document.querySelectorAll(".chip");
const sortBtn = document.getElementById("sort-toggle");

// What's currently selected.
const state = { subject: "all", order: "newest" };

// Start with a subject selected if the link had #accounting or #business-analytics.
const fromLink = window.location.hash.slice(1);
if (fromLink === "accounting" || fromLink === "business-analytics") {
  state.subject = fromLink;
}

// Turns a card's term text ("Fall, 2025") into a number for sorting:
// year × 10 + season, so Winter 2026 (20261) comes after Fall 2025 (20254).
const SEASONS = { winter: 1, spring: 2, summer: 3, fall: 4, autumn: 4 };
function termValue(card) {
  const text = (card.querySelector(".course-term")?.textContent || "").toLowerCase();
  const year = parseInt((text.match(/\d{4}/) || ["0"])[0], 10);
  const season = Object.keys(SEASONS).find((s) => text.includes(s));
  return year * 10 + (season ? SEASONS[season] : 0);
}

function render() {
  const courses = Array.from(list.querySelectorAll(".course"));

  // 1. Sort by term (newest or oldest first).
  courses.sort((a, b) => {
    const da = termValue(a);
    const db = termValue(b);
    return state.order === "newest" ? db - da : da - db;
  });
  courses.forEach((c) => list.appendChild(c)); // re-adding puts them in the new order

  // 2. Hide the ones that don't match the selected subject.
  let shown = 0;
  courses.forEach((c) => {
    c.hidden = !(state.subject === "all" || c.dataset.subject === state.subject);
    if (!c.hidden) shown++;
  });
  empty.hidden = shown > 0;

  // 3. Update which buttons look pressed.
  chips.forEach((chip) => {
    const on = state[chip.dataset.filter] === chip.dataset.value;
    chip.setAttribute("aria-pressed", on ? "true" : "false");
  });
  // The button shows the CURRENT order (click it to flip).
  sortBtn.textContent = state.order === "newest" ? "Sort: Newest first" : "Sort: Oldest first";
  sortBtn.title = state.order === "newest" ? "Click to show oldest first" : "Click to show newest first";
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    state[chip.dataset.filter] = chip.dataset.value;
    render();
  });
});

sortBtn.addEventListener("click", () => {
  state.order = state.order === "newest" ? "oldest" : "newest";
  render();
});

render();
