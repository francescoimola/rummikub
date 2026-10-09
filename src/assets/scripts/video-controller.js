// Runs fn once the page has finished loading, or straight away if it already has
function afterPageLoad(fn) {
  if (document.readyState === "complete") fn();
  else window.addEventListener("load", fn, { once: true });
}

// WebM when the browser can play it, else the mp4 — picked in JS so the markup carries no sourceless <source> for Firefox to warn about
function pickSrc(video) {
  var d = video.dataset;
  if (d.webm && video.canPlayType("video/webm")) return d.webm;
  return d.src;
}

var SLOW_NETWORKS = ["slow-2g", "2g", "3g"];

// 3G-or-slower (Network Information API) or under 20% and unplugged (Battery API) — both Chromium-only, so others never see the control
function isConstrained(connection, battery) {
  if (connection && SLOW_NETWORKS.includes(connection.effectiveType)) return true;
  return Boolean(battery && !battery.charging && battery.level <= 0.2);
}

// Flags <html> so CSS shows the play/pause control; reduced motion counts, since without autoplay the button is the only way to play
function watchConstraints(reducedMotion) {
  var connection = navigator.connection;
  var battery = null;
  var update = function () {
    var on = reducedMotion.matches || isConstrained(connection, battery);
    document.documentElement.toggleAttribute("data-video-controls", on);
  };
  update();
  reducedMotion.addEventListener("change", update);
  if (connection) connection.addEventListener("change", update);
  if (!navigator.getBattery) return;
  navigator.getBattery().then(function (b) {
    battery = b;
    b.addEventListener("levelchange", update);
    b.addEventListener("chargingchange", update);
    update();
  }).catch(function () {});
}

var controllers = [];
var unlockArmed = false;

// iOS Low Power Mode refuses autoplay until a gesture, then lifts it per video — so the first tap after a refusal plays every video once
function armUnlock() {
  if (unlockArmed) return;
  unlockArmed = true;
  var gesture = new AbortController();
  var unlockAll = function (e) {
    gesture.abort(); // a tap fires both events; whichever lands first wins
    unlockArmed = false;
    controllers.forEach(function (c) {
      if (c.video.isConnected) c.unlock(e.target);
    });
  };
  // touchend too: a touch that turns into a scroll ends in pointercancel, never pointerup
  document.addEventListener("pointerup", unlockAll, { signal: gesture.signal });
  document.addEventListener("touchend", unlockAll, { signal: gesture.signal, passive: true });
}

class VideoController {
  constructor(wrapper, reducedMotion) {
    this.video = wrapper.querySelector(".project-video-el");
    this.btn = wrapper.querySelector(".project-video-play");
    if (!this.video || !this.btn) return;
    if (this.video.dataset.init) return;
    this.video.dataset.init = "1";
    controllers.push(this);

    this.inView = false;
    this.loaded = false;
    this.pendingLoadPlay = false;
    this.unlocked = false;
    this.reducedMotion = reducedMotion;

    this.setupObserver();
    this.setupListeners();
  }

  updateLabel() {
    var paused = this.video.paused;
    this.btn.setAttribute("aria-label", paused ? "Play video" : "Pause video");
    if (paused) this.btn.removeAttribute("data-playing");
    else this.btn.setAttribute("data-playing", "");
  }

  ensureLoaded() {
    if (this.loaded) return;
    this.loaded = true;
    var src = pickSrc(this.video);
    if (src) this.video.src = src;
  }

  tryPlay() {
    this.ensureLoaded();
    var p = this.video.play();
    if (p && p.then) {
      p.then(() => {
        this.unlocked = true;
        this.updateLabel();
      }).catch((err) => {
        if (err.name !== "NotAllowedError") return; // AbortError is a pause() interrupting play — scrolled away, not refused
        this.btn.setAttribute("data-blocked", ""); // iOS Low Power Mode is undetectable up front — a refused play() is the only tell
        this.updateLabel();
        armUnlock();
      });
    }
  }

  // Plays then pauses an off-screen video inside the gesture, so WebKit lifts its restriction before it scrolls into view
  prime() {
    this.ensureLoaded();
    var p = this.video.play();
    if (!p || !p.then) return;
    p.then(() => {
      this.unlocked = true;
      if (!this.canAutoplay()) this.video.pause();
      this.updateLabel();
    }).catch(() => {});
  }

  // Skips its own button: that tap's click handler already toggles playback
  unlock(target) {
    if (this.unlocked || this.btn.contains(target)) return;
    if (this.canAutoplay()) this.tryPlay();
    else if (!this.reducedMotion.matches) this.prime();
  }

  canAutoplay() {
    return this.inView && !this.reducedMotion.matches;
  }

  handleEnterView() {
    if (this.reducedMotion.matches) return;
    if (this.pendingLoadPlay) return; // scrolling in and out pre-load would queue one load listener per entry
    this.pendingLoadPlay = true;
    // Deferred: fetching the video during first paint starves the poster, which is the LCP element above the fold
    afterPageLoad(() => {
      this.pendingLoadPlay = false;
      if (this.canAutoplay()) this.tryPlay();
    });
  }

  handleLeaveView() {
    if (!this.video.paused) {
      this.video.pause();
      this.updateLabel();
    }
  }

  setupObserver() {
    var observer = new IntersectionObserver(
      (entries) => {
        this.inView = entries[0].isIntersecting;
        if (this.inView) this.handleEnterView();
        else this.handleLeaveView();
      },
      { threshold: 0.25, rootMargin: "25% 0px" }
    );
    observer.observe(this.video);
  }

  setupListeners() {
    this.btn.addEventListener("click", () => {
      if (this.video.paused) this.tryPlay();
      else {
        this.video.pause();
        this.updateLabel();
      }
    });

    this.reducedMotion.addEventListener("change", () => {
      if (this.reducedMotion.matches) {
        this.video.pause();
        this.updateLabel();
      } else if (this.inView) {
        this.tryPlay();
      }
    });
  }
}

function initProjectVideos() {
  var wrappers = document.querySelectorAll(".project-video-wrapper");
  if (!wrappers.length) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  watchConstraints(reducedMotion);

  wrappers.forEach(function (wrapper) {
    new VideoController(wrapper, reducedMotion);
  });
}

export { VideoController, initProjectVideos, isConstrained };
