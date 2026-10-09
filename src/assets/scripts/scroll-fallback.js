// Scroll-timeline stand-in for browsers without animation-timeline (Firefox). Only imported there — see app-core.js.
// index.scss marks each target with --scroll-fallback and replays the breakout keyframes from --scroll-p; this writes --scroll-p.

var targets = [];
var queued = false;

// Kept just short of 1 so the paused animation never lands on its finished edge
function clampProgress(p) {
  return Math.min(Math.max(p, 0), 0.999);
}

// Mirrors scroll(root block) over 0–50vh
function settleProgress() {
  return window.scrollY / (window.innerHeight * 0.5);
}

// Mirrors view() over cover 0% → cover 50%: from first peek at the bottom to centred
function breakoutProgress(el) {
  var rect = el.getBoundingClientRect();
  return (window.innerHeight - rect.top) / ((window.innerHeight + rect.height) * 0.5);
}

// The CSS media query decides who animates, so targets are re-read whenever it might have flipped
function collect() {
  targets = [];
  document.querySelectorAll("[view-animation], .case-study > *").forEach(function (el) {
    var kind = getComputedStyle(el).getPropertyValue("--scroll-fallback").trim();
    if (kind) targets.push({ el: el, kind: kind });
  });
}

function update() {
  queued = false;
  // Measure every target before writing any, so the frame lays out once instead of once per target
  var progress = targets.map(function (t) {
    return clampProgress(t.kind === "settle" ? settleProgress() : breakoutProgress(t.el));
  });
  targets.forEach(function (t, i) {
    if (progress[i] === t.p) return; // clamped off-screen targets would restyle for nothing
    t.p = progress[i];
    t.el.style.setProperty("--scroll-p", t.p);
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
window.addEventListener("load", refresh, { once: true }); // image heights land late and shift breakout progress
