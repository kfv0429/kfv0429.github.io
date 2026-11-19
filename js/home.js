/* ═══════════════════════════════════════════════════════════════
   home.js — makes the homepage interactive

   What it does:
     • When you click one of the five icons, or one of the three
       highlighted words in the intro, the photo collage fades out and a
       detail card (photo + title + description) fades in.
     • Clicking the same icon/word again, or pressing Esc, brings the
       collage back.
     • Clicking your name swaps it between English and Chinese.
     • Keeps the © year in the footer up to date.

   The only part you normally need to edit is ITEMS, right below.
   Everything under the "Behaviour" line is the machinery.
   ═══════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────
   The cards: five things (icons) + three traits (intro words).
   Both kinds work exactly the same way.
   TODO: fill in your real photos, dates, places and descriptions.
   - photo: path to an image (leave "" to show a placeholder box)
   - focus (optional): which part of the photo stays in view when it's
     cropped, as "left/right% top/bottom%". "center 50%" = the middle
     (the default); "center 20%" = nearer the top; "center 80%" = nearer
     the bottom.
   - fit: "whole" (optional): shows the WHOLE photo instead of cropping it
     to fill the space, with a soft blurred copy filling the sides. Use it
     for tall photos where the top/bottom matter (e.g. the badminton one).
   - spotify (optional): a Spotify playlist/album/song link; shows a
     playable Spotify player in place of the photo
   - date / time / location: shown in the small grey line
     (any you leave as "" are skipped; leave all three empty to hide the line)
   - place / placeLink (optional): a named spot (café, restaurant, court…)
     shown first in the grey line. With placeLink (e.g. a Google Maps
     link), the name becomes a link that opens in a new tab.
   - desc: a short paragraph about what it means to you

   Each name on the left (coffee, fuji, …) must match a data-key on a
   button in index.html. To add a new card, add an entry here AND a
   matching button in index.html.

   Formatting rules: keep the text inside "double quotes", and keep the
   comma after each line and after each closing }. If you need a double
   quote inside your text, write it as \" (e.g. "my \"daily\" coffee").
   ───────────────────────────────────────────── */
const ITEMS = {
  coffee: {
    title: "Coffee",
    photo: "images/cards/Coffee-2.jpg",
    focus: "center 62%",   // which part of the photo stays in view when cropped (here: the poster)
    place: "Buttermilk",   // shop name shown in the grey line
    location: "Naperville, Illinois",
    desc: "Coffee fuels my mornings, work, studies and questionable decisions. " +
        "The rich aroma that fills my room and the strong taste of black coffee work better than any alarm clock."
  },
  fuji: {
    title: "Photography",
    photo: "images/cards/Photography.jpg",
    place: "Santa Monica Pier",   // camera name shown in the grey line (bottom right)
    location: "Santa Monica, California",
    desc: "In the hustle and bustle of life, photographs capture moments that might otherwise slip away. " +
        "Photos turn temporary moments into permanent memories."
  },
  headphones: {
    title: "Music",
    photo: "", // not used while spotify (below) is filled in
    // Shows a playable Spotify player instead of a photo.
    // TODO: paste your playlist link, e.g. "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
    // (In Spotify: playlist → ⋯ → Share → Copy link to playlist.)
    // Albums and single songs work too. Leave it "" to show the photo instead.
    spotify: "https://open.spotify.com/playlist/5robZLQnfB5uoWYxhoo7rO?si=b12fae8167ee475a",

    desc: "Piano, jazz, songs with or without lyrics: they all tell a story if you listen closely. " +
        "At first, music was a way to gather my thoughts. Now, it is a storyteller.",
  },
  icecream: {
    title: "Foodie",
    photo: "images/cards/Icecream.jpg",
    place: "Guernsey Farms Dairy",
    location: "Northville, Michigan",
    desc: "They say the way to a man's heart is through his stomach. I can confirm it works for me too. " +
        "My stories sometimes start with food and always end with a sweet treat."
  },
  badminton: {
    title: "Badminton",
    photo: "images/cards/Badminton-doubles.jpg",
    place: "Gatineau Sports Centre",
    location: "Gatineau, Quebec",
    desc: "What started as a way to lose weight for an chubby 6-year-old has become an irreplaceable part of my life. " +
        "Badminton has taught me countless lessons, both on and off the court.",
  },

  /* ── The three traits (the highlighted words in the intro) ──
     Same fields as above. No date / time / location, so the grey line
     is hidden; add them back if you want one. */
  problemsolver: {
    title: "Problem solver",
    photo: "images/cards/ProblemSolver.jpeg",
    desc: "Where's Waldo, thousand-piece puzzles, Sudoku and even A = L + OE. " +
        "I have always found joy in breaking down and solving challenging problems.",
  },
  listener: {
    title: "Listener",
    photo: "images/cards/Listener.JPG",
    desc: "A long backstage conversation aided by a disfunctional Google Translate. Two unlikely people. Two opponents. Two listeners. One Lifelong friendship.",
  },
  storyteller: {
    title: "Storyteller",
    photo: "images/cards/Storyteller.JPG",
    desc: "Everyone has a unique story to tell, and yet ours just intersected. Hi, I'm Ares, and this is my story. What's yours?",
  },
};

/* ───────────────────────── Behaviour ─────────────────────────
   You shouldn't need to change anything below unless you want to
   change how the page behaves. */

// Grab the elements from index.html that we need to control (matched by id/class).
// If you rename an id in index.html, rename it here too.
const stage = document.getElementById("stage");            // area that holds collage OR card
const collage = document.getElementById("collage");        // the 6-photo grid
const detail = document.getElementById("detail");          // the detail card
const photoBox = document.getElementById("detail-photo");  // card's photo slot
const metaEl = document.getElementById("detail-meta");     // card's "date · time · location" line
const titleEl = document.getElementById("detail-title");   // card's title
const descEl = document.getElementById("detail-desc");     // card's description
const buttons = document.querySelectorAll(".thing, .trait-word");  // the five icons + three intro words

let shownKey = null;   // what's on screen right now (null = collage)
let targetKey = null;  // what should be on screen
let busy = false;      // true while an animation is running

// Respect the visitor's "reduce motion" accessibility setting: no fades if it's on.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// How long the fade-out lasts, in milliseconds (1000 = 1 second).
// If you change this, also adjust the .stage transition in home.css to match.
const FADE_MS = reduceMotion ? 0 : 200;
// Small helper: pause for a number of milliseconds.
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Puts one item's photo, date line, title and description into the detail card.
function fillDetail(key) {
  const item = ITEMS[key];

  photoBox.innerHTML = "";  // clear the previous photo
  photoBox.classList.toggle("fit-whole", item.fit === "whole" && Boolean(item.photo));
  const embedUrl = spotifyEmbedUrl(item.spotify);
  detail.classList.toggle("has-embed", Boolean(embedUrl));  // lets the CSS lay out the player
  if (embedUrl) {
    // Spotify player in place of the photo
    const frame = document.createElement("iframe");
    frame.src = embedUrl;
    frame.title = item.title + " on Spotify";  // read by screen readers
    frame.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    frame.loading = "lazy";
    photoBox.appendChild(frame);
  } else if (item.photo) {
    if (item.fit === "whole") {
      // Blurred copy of the photo that fills the space beside it (see .photo-blur in home.css)
      const blur = document.createElement("div");
      blur.className = "photo-blur";
      blur.style.backgroundImage = `url("${item.photo}")`;
      photoBox.appendChild(blur);
    }
    const img = document.createElement("img");
    img.src = item.photo;
    if (item.focus) img.style.objectPosition = item.focus;  // see "focus" at the top
    img.alt = item.title;   // screen readers read the title as the photo description
    photoBox.appendChild(img);
  } else {
    // Placeholder until you add a real photo
    const ph = document.createElement("div");
    ph.className = "photo-ph";
    ph.textContent = "photo coming soon";  // change this text if you like
    photoBox.appendChild(ph);
  }

  // The grey line: place (as a map link if placeLink is set), then
  // date / time / location, skipping empty ones, with " · " between them.
  // Change " · " below to e.g. " | " or " — " for a different separator.
  const parts = [];
  if (item.place) {
    if (item.placeLink) {
      const link = document.createElement("a");
      link.href = item.placeLink;
      link.target = "_blank";   // opens Google Maps in a new tab
      link.rel = "noopener";
      link.textContent = item.place + " ↗";
      parts.push(link);
    } else {
      parts.push(item.place);
    }
  }
  parts.push(...[item.date, item.time, item.location].filter(Boolean));
  metaEl.replaceChildren();
  parts.forEach((part, i) => {
    if (i > 0) metaEl.append(" · ");
    metaEl.append(part);
  });
  metaEl.hidden = parts.length === 0;  // hide the line entirely if there's nothing to show
  titleEl.textContent = item.title;
  descEl.textContent = item.desc;
}

// Turns a normal Spotify share link, e.g.
//   https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=abc123
// into the "embed" version Spotify needs for a player on a website.
// Returns "" if there's no link or it isn't a Spotify playlist/album/song link.
function spotifyEmbedUrl(link) {
  const match = /open\.spotify\.com\/(?:intl-[a-z-]+\/)?(playlist|album|track|show|episode)\/([A-Za-z0-9]+)/i.exec(link || "");
  return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : "";
}

// Fade the stage out, swap content, then smoothly resize and fade back in.
// If the target changes mid-animation (fast clicking), it catches up afterwards.
async function sync() {
  if (busy || targetKey === shownKey) return;  // already animating, or nothing to change
  busy = true;

  const key = targetKey;
  const startH = stage.offsetHeight;      // remember the current height
  stage.style.height = startH + "px";     // lock it so nothing jumps
  stage.classList.add("is-fading");       // fade out (CSS handles the animation)
  await wait(FADE_MS);

  // Swap: show the card for `key`, or the collage if key is null.
  if (key) {
    fillDetail(key);
    collage.hidden = true;
    detail.hidden = false;
  } else {
    detail.hidden = true;
    collage.hidden = false;
  }
  shownKey = key;

  // Measure the new content's height, then animate from the old height to the new one.
  stage.style.height = "auto";
  const endH = stage.offsetHeight;
  stage.style.height = startH + "px";
  stage.offsetHeight; // force reflow so the height change animates
  stage.style.height = endH + "px";
  stage.classList.remove("is-fading");   // fade back in

  // 300ms ≈ the height transition in home.css (0.35s).
  await wait(reduceMotion ? 0 : 300);
  stage.style.height = "";               // unlock height so it adapts to window resizing
  busy = false;
  sync(); // in case the user moved to another icon meanwhile
}

// Choose what should be shown (an item key, or null for the collage),
// highlight the matching icon, and start the transition.
function setTarget(key) {
  targetKey = key;
  // aria-pressed="true" on the active icon is what the CSS uses to style it as selected.
  buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.key === key)));
  sync();
}

/* ── Click / tap: show a card, click the same icon again to close ──
   Want cards to open on hover instead of click? Add, inside this loop:
     btn.addEventListener("mouseenter", () => setTarget(btn.dataset.key));
   (click still works for phones, which have no hover.) */
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.key;
    setTarget(targetKey === key ? null : key);  // same icon again = close
  });
});

// The Esc key returns to the collage.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setTarget(null);
});

/* ── Name toggle: click your name to switch English ⇄ Chinese ──
   Both names are stored on the button in index.html (data-en / data-zh);
   edit them there, not here. */
const nameBtn = document.getElementById("name-toggle");
const nameText = document.getElementById("name-text");
let nameSwapping = false;  // ignore extra clicks while the fade is running

nameBtn.addEventListener("click", async () => {
  if (nameSwapping) return;
  nameSwapping = true;

  const toZh = nameText.lang !== "zh";     
  nameBtn.classList.add("is-swapping");    
  await wait(FADE_MS);

  nameText.textContent = toZh ? nameBtn.dataset.zh : nameBtn.dataset.en;
  nameText.lang = toZh ? "zh" : "en";      
  nameBtn.classList.remove("is-swapping"); 

  nameSwapping = false;
});

document.getElementById("year").textContent = new Date().getFullYear();
