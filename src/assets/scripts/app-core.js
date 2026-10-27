// fallow-ignore-file coverage-gaps
// Entry point only: the imports and calls below are covered by each module's own suite.
import "./mailto-copy.js";
import "./dialog-copy.js";
import "./look-toggles.js";
import "./nav-menu.js";
import "./webmcp.js";
import { initProjectVideos } from "./video-controller.js";

initProjectVideos();

// Without ::scroll-button (Firefox, Safari) one fixed Previous/Next pair under the strip scrolls it a slide at a time (G47: no wrap-around)
function initCarouselButtons() {
  document.querySelectorAll(".carousel").forEach(function (carousel) {
    var track = carousel.querySelector(".carousel__track");
    var controls = carousel.querySelector(".carousel__links");
    var prev = carousel.querySelector("[data-carousel-prev]");
    var next = carousel.querySelector("[data-carousel-next]");
    if (!track || !controls || !prev || !next) return;

    function update() {
      prev.hidden = track.scrollLeft < 1;
      next.hidden = track.scrollLeft > track.scrollWidth - track.clientWidth - 1;
    }

    prev.addEventListener("click", function () { track.scrollBy({ left: -track.clientWidth }); });
    next.addEventListener("click", function () { track.scrollBy({ left: track.clientWidth }); });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    controls.hidden = false;
    update();
  });
}

if (!CSS.supports("selector(::scroll-button(*))")) initCarouselButtons();

// Browsers without scroll timelines (Firefox today) load a small stand-in; the rest never download it
if (!CSS.supports("animation-timeline: view()")) import("./scroll-fallback.js");
