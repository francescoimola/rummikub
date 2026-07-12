// Brand palette + light/dark toggles. Applies a choice to <html> (data-brand / data-theme),
// keeps both sidebar instances' aria-pressed in sync, and persists to localStorage.
// The pre-paint inline script in _head.njk applies stored choices before first paint; this only reconciles state + wires clicks.

var root = document.documentElement;

function store(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch (e) {}
}

// Mark the button whose choice matches `value` as pressed, across every instance
function syncPressed(attr, value) {
  document.querySelectorAll("[" + attr + "]").forEach(function (btn) {
    btn.setAttribute("aria-pressed", String(btn.getAttribute(attr) === value));
  });
}

// ---- Brand palette (absent data-brand === "green") ----
function currentBrand() {
  return root.getAttribute("data-brand") || "green";
}

document.querySelectorAll("[data-brand-choice]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var choice = btn.getAttribute("data-brand-choice");
    if (choice === "green") root.removeAttribute("data-brand");
    else root.setAttribute("data-brand", choice);
    store("brand", choice === "green" ? "" : choice);
    syncPressed("data-brand-choice", choice);
  });
});

// ---- Light / dark (absent data-theme === follow OS) ----
function currentTheme() {
  var explicit = root.getAttribute("data-theme");
  if (explicit) return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

document.querySelectorAll("[data-theme-choice]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var choice = btn.getAttribute("data-theme-choice");
    root.setAttribute("data-theme", choice);
    store("theme", choice);
    syncPressed("data-theme-choice", choice);
  });
});

// Reconcile server-rendered pressed state with the resolved state (stored choice or OS scheme)
syncPressed("data-brand-choice", currentBrand());
syncPressed("data-theme-choice", currentTheme());
