// fallow-ignore-file coverage-gaps
// Entry point only: the imports and two calls below are covered by each module's own suite.
import "./mailto-copy.js";
import "./dialog-copy.js";
import "./look-toggles.js";
import "./nav-menu.js";
import { initProjectVideos } from "./video-controller.js";
import { fitStretchText } from "./stretch-text.js";

initProjectVideos();
fitStretchText();
