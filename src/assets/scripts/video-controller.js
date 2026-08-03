class VideoController {
  constructor(wrapper, reducedMotion, slowConnection) {
    this.video = wrapper.querySelector(".project-video-el");
    this.btn = wrapper.querySelector(".project-video-play");
    if (!this.video || !this.btn) return;
    if (this.video.dataset.init) return;
    this.video.dataset.init = "1";

    this.inView = false;
    this.loaded = false;
    this.reducedMotion = reducedMotion;
    this.slowConnection = slowConnection;

    if (this.reducedMotion.matches || this.slowConnection) this.showBtn();
    this.setupObserver();
    this.setupListeners();
  }

  showBtn() {
    this.btn.setAttribute("data-visible", "");
  }

  hideBtn() {
    this.btn.removeAttribute("data-visible");
  }

  updateLabel() {
    this.btn.setAttribute("aria-label", this.video.paused ? "Play video" : "Pause video");
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
    if (!this.reducedMotion.matches && !this.slowConnection) {
      this.tryPlay();
    }
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
  var slowConnection =
    !!conn &&
    (conn.saveData === true ||
      conn.effectiveType === "slow-2g" ||
      conn.effectiveType === "2g");

  wrappers.forEach(function (wrapper) {
    new VideoController(wrapper, reducedMotion, slowConnection);
  });
}

export { VideoController, initProjectVideos };
