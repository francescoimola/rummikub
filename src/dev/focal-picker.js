// Dev-only object-position picker: Alt/Option+click any img or video on the page.
// Injected by _base.njk only under `eleventy --serve`; never copied into a production build.
// With object-fit: cover, object-position X% Y% pins the image's X%/Y% point to the box's X%/Y%,
// so the point clicked on the uncropped thumbnail maps 1:1 to the value.

const STYLE = `
.fp-panel { position: fixed; inset-block-end: 1rem; inset-inline-end: 1rem; z-index: 2147483647;
  display: grid; gap: 0.5rem; padding: 0.75rem; max-inline-size: 18rem;
  background: Canvas; color: CanvasText; border: 0.0625rem solid GrayText; border-radius: 0.5rem;
  box-shadow: 0 0.5rem 2rem rgb(0 0 0 / 0.3); font: 0.8125rem/1.4 system-ui, sans-serif; }
.fp-thumb { position: relative; justify-self: center; cursor: crosshair; touch-action: none; line-height: 0; }
.fp-thumb img { display: block; inline-size: auto; max-inline-size: 16rem; max-block-size: 16rem;
  margin: 0; border: 0; border-radius: 0.25rem; object-fit: contain; user-select: none; pointer-events: none; }
.fp-mark { position: absolute; inline-size: 1rem; block-size: 1rem; translate: -50% -50%; border-radius: 50%;
  border: 0.125rem solid #fff; box-shadow: 0 0 0 0.125rem #000, inset 0 0 0 0.125rem #000; pointer-events: none; }
.fp-readout { font-family: ui-monospace, monospace; text-align: center; }
.fp-actions { display: flex; flex-wrap: wrap; gap: 0.25rem; justify-content: center; }
.fp-actions button { font: inherit; padding: 0.25rem 0.5rem; border: 0.0625rem solid GrayText;
  border-radius: 0.25rem; background: ButtonFace; color: ButtonText; cursor: pointer; }
.fp-hint { margin: 0; color: GrayText; text-align: center; font-size: 0.75rem; }
.fp-target { outline: 0.125rem dashed magenta !important; outline-offset: -0.125rem !important; }
`;

const PANEL = `
<div class="fp-thumb"><img alt=""><span class="fp-mark"></span></div>
<output class="fp-readout"></output>
<div class="fp-actions">
  <button type="button" data-copy="css">Copy CSS</button>
  <button type="button" data-copy="attr">Copy figureImg</button>
  <button type="button" data-act="reset">Reset</button>
  <button type="button" data-act="done">Done</button>
</div>
<p class="fp-hint">Drag the thumbnail · arrows nudge 1% (Shift 10%) · Esc closes</p>
`;

const state = { el: null, panel: null, pos: { x: 50, y: 50 }, initialInline: "" };

const clamp = (n) => Math.round(Math.min(100, Math.max(0, n)));
const value = () => `${state.pos.x}% ${state.pos.y}%`;

// Topmost img/video under the pointer, even when a play button or link overlay sits on top.
function mediaAt(event) {
  return document
    .elementsFromPoint(event.clientX, event.clientY)
    .find((node) => node.matches("img, video") && !node.closest(".fp-panel"));
}

// Full uncropped source for the thumbnail: the chosen srcset candidate for images, the poster for videos.
function thumbnailSrc(el) {
  if (el.tagName === "VIDEO") return el.poster;
  return el.currentSrc || el.src;
}

// Computed object-position resolves keywords to percentages; anything else (px lengths) falls back to centre.
function readPosition(el) {
  const [x, y] = getComputedStyle(el).objectPosition.split(" ");
  const pct = (part) => (part && part.endsWith("%") ? parseFloat(part) : 50);
  return { x: pct(x), y: pct(y) };
}

function render() {
  state.el.style.objectPosition = value();
  const mark = state.panel.querySelector(".fp-mark");
  mark.style.left = `${state.pos.x}%`;
  mark.style.top = `${state.pos.y}%`;
  state.panel.querySelector(".fp-readout").textContent = `object-position: ${value()};`;
}

function setFromPointer(event) {
  const box = state.panel.querySelector(".fp-thumb img").getBoundingClientRect();
  state.pos = {
    x: clamp(((event.clientX - box.left) / box.width) * 100),
    y: clamp(((event.clientY - box.top) / box.height) * 100),
  };
  render();
}

function copy(kind, button) {
  const text = kind === "attr" ? `position="${value()}"` : `object-position: ${value()};`;
  console.info("[focal-picker]", thumbnailSrc(state.el), text);
  navigator.clipboard.writeText(text).then(() => {
    button.textContent = "Copied";
    setTimeout(() => (button.textContent = kind === "attr" ? "Copy figureImg" : "Copy CSS"), 1000);
  });
}

function close() {
  if (!state.el) return;
  state.el.classList.remove("fp-target");
  state.panel.remove();
  state.el = null;
  state.panel = null;
}

function open(el) {
  close();
  const src = thumbnailSrc(el);
  if (!src) {
    console.warn("[focal-picker] No source to preview (a video needs a poster).", el);
    return;
  }

  state.el = el;
  state.initialInline = el.style.objectPosition;
  state.pos = readPosition(el);
  el.classList.add("fp-target");

  const panel = document.createElement("div");
  panel.className = "fp-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "object-position picker");
  panel.innerHTML = PANEL;
  panel.querySelector(".fp-thumb img").src = src;
  document.body.append(panel);
  state.panel = panel;
  wirePanel(panel);
  render();
}

function wirePanel(panel) {
  const thumb = panel.querySelector(".fp-thumb");
  thumb.addEventListener("pointerdown", (event) => {
    thumb.setPointerCapture(event.pointerId);
    setFromPointer(event);
  });
  thumb.addEventListener("pointermove", (event) => {
    if (thumb.hasPointerCapture(event.pointerId)) setFromPointer(event);
  });

  panel.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.copy) copy(button.dataset.copy, button);
    if (button.dataset.act === "done") close();
    if (button.dataset.act === "reset") {
      state.el.style.objectPosition = state.initialInline;
      state.pos = readPosition(state.el);
      render();
    }
  });
}

const NUDGE = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

document.addEventListener("keydown", (event) => {
  if (!state.el) return;
  if (event.key === "Escape") return close();
  const step = NUDGE[event.key];
  if (!step) return;
  event.preventDefault();
  const size = event.shiftKey ? 10 : 1;
  state.pos = { x: clamp(state.pos.x + step[0] * size), y: clamp(state.pos.y + step[1] * size) };
  render();
});

// Capture phase, so an Alt+click on a linked image never navigates or triggers the browser's Alt+click download.
document.addEventListener(
  "click",
  (event) => {
    if (!event.altKey) return;
    const el = mediaAt(event);
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    open(el);
  },
  true
);

const style = document.createElement("style");
style.textContent = STYLE;
document.head.append(style);
console.info("[focal-picker] Alt/Option+click any image or video to pick its object-position.");
