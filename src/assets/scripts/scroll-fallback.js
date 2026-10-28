// Scroll-timeline stand-in for browsers without animation-timeline (Firefox). Only imported there — see app-core.js.
// _responsive.scss marks each target with --scroll-fallback and replays the settle keyframes from --scroll-p; this writes --scroll-p.

var targets = [];
var last;
var queued = false;

// The CSS media query decides who animates, so targets are re-read whenever it might have flipped
function collect() {
  targets = [];
  last = undefined;
  document.querySelectorAll("[view-animation], .case-study > *").forEach(function (el) {
    if (getComputedStyle(el).getPropertyValue("--scroll-fallback").trim()) targets.push(el);
  });
}

// Mirrors scroll(root block) over 0–50vh, kept just short of 1 so the paused animation never lands on its finished edge
function update() {
  queued = false;
  var p = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.5), 0), 0.999);
  if (p === last) return; // clamped past the range, nothing to restyle
  last = p;
  targets.forEach(function (el) {
    el.style.setProperty("--scroll-p", p);
  });
}

function requestUpdate() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(update);
}

function refresh() {
  collect();
  requestUpdate();
}

collect();
update();
window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", refresh);
