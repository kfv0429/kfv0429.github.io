/* ═══════════════════════════════════════════════════════════════
   nav.js — the "Contact" dropdown in the top nav

   Clicking "Contact" opens a small menu (Email / LinkedIn).
   It closes when you click "Contact" again, click anywhere else,
   pick a link, or press Esc.

   The links themselves are in the HTML (inside .contact-list), so
   you don't need to edit this file to change them.
   ═══════════════════════════════════════════════════════════════ */

const contactBtn = document.querySelector(".contact-toggle");
const contactList = document.getElementById("contact-list");

if (contactBtn && contactList) {
  function setOpen(open) {
    contactList.hidden = !open;
    contactBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  contactBtn.addEventListener("click", () => setOpen(contactList.hidden));

  // Click outside the menu closes it.
  document.addEventListener("click", (e) => {
    if (!contactList.hidden && !e.target.closest(".contact-menu")) setOpen(false);
  });

  // Esc closes it and puts focus back on "Contact".
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !contactList.hidden) {
      setOpen(false);
      contactBtn.focus();
    }
  });

  // Picking a link closes it too.
  contactList.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
}
