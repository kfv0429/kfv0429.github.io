/* ═══════════════════════════════════════════════════════════════
   work.js — the "pop out" experience cards on work.html

   Clicking a row (Professional / Leadership) makes it grow out of the
   list into a bigger card in the middle of the screen, with the page
   dimmed behind it. Closing it (× button, Esc, or clicking outside
   the card) shrinks it back into its row.

   You don't need to edit this file: the card shows whatever is inside
   that row's <div class="role-body"> in work.html.
   If this script ever fails to load, the rows still work: they just
   open downward like a normal drop-down.
   ═══════════════════════════════════════════════════════════════ */

const pop = document.getElementById("role-pop");
const popCard = pop.querySelector(".role-pop-card");
const popContent = pop.querySelector(".role-pop-content");
const popClose = pop.querySelector(".role-pop-close");
const popBackdrop = pop.querySelector(".role-pop-backdrop");

// How long the grow / shrink takes, in milliseconds (1000 = 1 second).
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const POP_MS = reduceMotion ? 0 : 420;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";  // fast start, soft landing

let activeRow = null;   // the row that's popped out right now
let busy = false;       // true while animating, so double-clicks don't break it

// Each row: clicking it pops it out instead of opening downward.
document.querySelectorAll("details.role").forEach((row) => {
  row.querySelector("summary").addEventListener("click", (e) => {
    e.preventDefault();
    openPop(row);
  });
});

// A box's position + size on screen, as the numbers the animation needs.
// minHeight 0 lets the card shrink all the way down to the row's height
// (otherwise its 70%-of-the-screen minimum height would stop it).
function box(r, radius) {
  return {
    left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px",
    minHeight: "0px", maxHeight: "none", transform: "none", borderRadius: radius,
  };
}
const ROW_RADIUS = "10px";   // same as --radius in home.css
const CARD_RADIUS = "16px";  // same as .role-pop-card in work.css

// While the card grows or shrinks, its text keeps the card's full width
// (so it doesn't re-wrap line by line) and anything outside is hidden.
function startAnimating() {
  popContent.style.width = popCard.clientWidth + "px";
  popCard.classList.add("is-animating");
}
function stopAnimating() {
  popContent.style.width = "";
  popCard.classList.remove("is-animating");
}

function openPop(row) {
  if (busy || activeRow) return;
  busy = true;
  activeRow = row;

  // Copy the row's top part (title, company, dates, logo) and its details into the card.
  const head = document.createElement("div");
  head.className = "role-summary role-pop-head";
  head.innerHTML = row.querySelector("summary").innerHTML;
  const body = row.querySelector(".role-body").cloneNode(true);
  // Move the company links up into the header, right under the dates.
  const links = body.querySelector(".role-links");
  if (links) head.querySelector(".role-info").appendChild(links);
  popContent.replaceChildren(head, body);

  const from = row.getBoundingClientRect();
  pop.hidden = false;
  document.body.classList.add("pop-open");       // stops the page scrolling behind the card
  const to = popCard.getBoundingClientRect();
  row.classList.add("is-popped");                // the row fades out: it "lifted" into the card
  startAnimating();

  // The card grows from the row to the middle of the screen; the words
  // and the × fade in during the second half.
  const fadeIn = [{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1 }];
  popBackdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: POP_MS, easing: "ease" });
  popContent.animate(fadeIn, { duration: POP_MS, easing: "ease" });
  popClose.animate(fadeIn, { duration: POP_MS, easing: "ease" });
  popCard.animate([box(from, ROW_RADIUS), box(to, CARD_RADIUS)], { duration: POP_MS, easing: EASE });

  // A timer (rather than waiting on the animation) so the card can never get stuck.
  setTimeout(() => {
    stopAnimating();
    busy = false;
    popClose.focus({ preventScroll: true });
  }, POP_MS);
}

function closePop() {
  if (busy || !activeRow) return;
  busy = true;
  const row = activeRow;

  const from = popCard.getBoundingClientRect();
  const to = row.getBoundingClientRect();
  startAnimating();

  // The words and × fade out first, then the card shrinks back into the
  // row's spot. Near the end the row fades back in underneath and the
  // card fades away, so the hand-off is smooth.
  const fadeOut = [{ opacity: 1 }, { opacity: 0, offset: 0.3 }, { opacity: 0 }];
  popBackdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: POP_MS, easing: "ease", fill: "forwards" });
  popContent.animate(fadeOut, { duration: POP_MS, fill: "forwards" });
  popClose.animate(fadeOut, { duration: POP_MS, fill: "forwards" });
  popCard.animate([
    { ...box(from, CARD_RADIUS), opacity: 1 },
    { ...box(to, ROW_RADIUS), opacity: 1, offset: 0.8 },
    { ...box(to, ROW_RADIUS), opacity: 0 },
  ], { duration: POP_MS, easing: EASE, fill: "forwards" });

  setTimeout(() => row.classList.remove("is-popped"), POP_MS * 0.55);  // row starts fading back in

  setTimeout(() => {
    pop.hidden = true;
    [popCard, popBackdrop, popContent, popClose].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
    stopAnimating();
    document.body.classList.remove("pop-open");
    row.querySelector("summary").focus({ preventScroll: true });
    activeRow = null;
    busy = false;
  }, POP_MS);
}

popClose.addEventListener("click", closePop);
popBackdrop.addEventListener("click", closePop);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePop();
});
