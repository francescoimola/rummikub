// fallow-ignore-file coverage-gaps
// Entry point only: the imports and calls below are covered by each module's own suite.
import "./mailto-copy.js";
import "./dialog-copy.js";
import "./look-toggles.js";
import "./nav-menu.js";
import "./webmcp.js";
import { initProjectVideos } from "./video-controller.js";
import { fitStretchText } from "./stretch-text.js";

initProjectVideos();
fitStretchText();

// Browsers without scroll timelines (Firefox today) load a small stand-in; the rest never download it
if (!CSS.supports("animation-timeline: view()")) import("./scroll-fallback.js");
