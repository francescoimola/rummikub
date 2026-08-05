// Runs fn once the page has finished loading, or straight away if it already has
function afterPageLoad(fn) {
  if (document.readyState === "complete") fn();
  else window.addEventListener("load", fn, { once: true });
}

class VideoController {
  constructor(wrapper, reducedMotion, dataSaver) {
    this.video = wrapper.querySelector(".project-video-el");
    this.btn = wrapper.querySelector(".project-video-play");
    if (!this.video || !this.btn) return;
    if (this.video.dataset.init) return;
    this.video.dataset.init = "1";

    this.inView = false;
    this.loaded = false;
    this.reducedMotion = reducedMotion;
    this.dataSaver = dataSaver;

    // Data saver keeps the control on screen rather than blocking playback — these clips are a few hundred KB
    if (this.reducedMotion.matches || this.dataSaver) this.showBtn();
    this.setupObserver();
    this.setupListeners();
  }

  showBtn() {
    this.btn.setAttribute("data-visible", "");
  }

  hideBtn() {
    if (this.dataSaver) return; // stays put as the pause affordance
    this.btn.removeAttribute("data-visible");
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
    var sources = this.video.querySelectorAll("source[data-src]");
    if (sources.length) {
      sources.forEach((s) => {
        s.src = s.dataset.src;
      });
      this.video.load();
    } else if (this.video.dataset.src) {
      this.video.src = this.video.dataset.src;
    }
  }

  tryPlay() {
    this.ensureLoaded();
    var p = this.video.play();
    if (p && p.then) {
      p.then(() => {
        this.hideBtn();
        this.updateLabel();
      }).catch(() => {
        this.showBtn();
        this.updateLabel();
      });
    }
  }

  handleEnterView() {
    if (this.reducedMotion.matches) return;
    // Deferred: fetching the video during first paint starves the poster, which is the LCP element above the fold
    afterPageLoad(() => {
      if (this.inView && !this.reducedMotion.matches) this.tryPlay();
    });
  }

  handleLeaveView() {
    if (!this.video.paused) {
      this.video.pause();
      this.updateLabel();
      if (this.reducedMotion.matches) this.showBtn();
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
        this.showBtn();
        this.updateLabel();
      }
    });

    this.reducedMotion.addEventListener("change", () => {
      if (this.reducedMotion.matches) {
        this.video.pause();
        this.showBtn();
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
  var conn = navigator.connection;
  var dataSaver =
    !!conn &&
    (conn.saveData === true ||
      conn.effectiveType === "slow-2g" ||
      conn.effectiveType === "2g");

  wrappers.forEach(function (wrapper) {
    new VideoController(wrapper, reducedMotion, dataSaver);
  });
}

export { VideoController, initProjectVideos };
