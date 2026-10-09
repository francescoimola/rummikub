import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { VideoController, initProjectVideos, isConstrained } from "./video-controller.js";

function createWrapper(opts = {}) {
  const {
    hasVideo = true,
    hasBtn = true,
    dataSrc = false,
    dataWebm = false,
  } = opts;

  const wrapper = document.createElement("div");
  wrapper.className = "project-video-wrapper";

  if (hasVideo) {
    const video = document.createElement("video");
    video.className = "project-video-el";
    if (dataSrc) video.dataset.src = "video.mp4";
    if (dataWebm) video.dataset.webm = "video.webm";
    wrapper.appendChild(video);
  }

  if (hasBtn) {
    const btn = document.createElement("button");
    btn.className = "project-video-play";
    wrapper.appendChild(btn);
  }

  return wrapper;
}

function createMediaQuery(matches = false) {
  return {
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
}

// Build a wrapper, construct the controller against it, and hand back every handle a test needs
function mount({ reduced = false, ...wrapperOpts } = {}) {
  const wrapper = createWrapper(wrapperOpts);
  document.body.appendChild(wrapper); // the gesture unlock skips videos no longer in the document
  const reducedMotion = createMediaQuery(reduced);
  const ctrl = new VideoController(wrapper, reducedMotion);
  return {
    ctrl,
    wrapper,
    reducedMotion,
    video: wrapper.querySelector(".project-video-el"),
    btn: wrapper.querySelector(".project-video-play"),
  };
}

// jsdom leaves play()/pause() unimplemented and `paused` read-only, so swap in a controllable stand-in
function createMockVideo(paused = true) {
  const el = document.createElement("video");
  Object.defineProperty(el, "paused", { value: paused, writable: true, configurable: true });
  el.play = vi.fn(() => {
    el.paused = false;
    return Promise.resolve();
  });
  el.pause = vi.fn(() => {
    el.paused = true;
  });
  return el;
}

// What a browser rejects play() with when it refuses autoplay (iOS Low Power Mode)
const notAllowed = () => new DOMException("play() refused", "NotAllowedError");

let originalIntersectionObserver;
let originalMatchMedia;

beforeEach(() => {
  originalIntersectionObserver = globalThis.IntersectionObserver;
  globalThis.IntersectionObserver = vi.fn(function (cb) {
    this._cb = cb;
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  });

  originalMatchMedia = window.matchMedia;
  window.matchMedia = vi.fn((query) => createMediaQuery(false));
});

afterEach(() => {
  globalThis.IntersectionObserver = originalIntersectionObserver;
  window.matchMedia = originalMatchMedia;
  // Restored here, not in the test body: a pre-load test that fails mid-way would otherwise
  // leak readyState "loading" into every test after it.
  Object.defineProperty(document, "readyState", {
    value: "complete",
    configurable: true,
  });
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("VideoController", () => {
  it("does nothing if wrapper has no video element", () => {
    const { ctrl } = mount({ hasVideo: false });

    expect(ctrl.video).toBeNull();
    expect(ctrl.btn).toBeInstanceOf(HTMLButtonElement);
    expect(ctrl.loaded).toBeUndefined();
  });

  it("does nothing if wrapper has no button element", () => {
    const { ctrl } = mount({ hasBtn: false });

    expect(ctrl.video).toBeInstanceOf(HTMLVideoElement);
    expect(ctrl.btn).toBeNull();
    expect(ctrl.loaded).toBeUndefined();
  });

  it("does not re-initialize if already init'd", () => {
    const wrapper = createWrapper();
    wrapper.querySelector(".project-video-el").dataset.init = "1";

    const ctrl = new VideoController(wrapper, createMediaQuery(), false);

    expect(ctrl.video).toBeDefined();
    expect(ctrl.btn).toBeDefined();
    expect(ctrl.loaded).toBeUndefined();
    expect(globalThis.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("sets data-init on the video element", () => {
    const { video } = mount();

    expect(video.dataset.init).toBe("1");
  });

  it("observes the video element with IntersectionObserver", () => {
    const { video } = mount();

    expect(globalThis.IntersectionObserver).toHaveBeenCalled();
    const instance = globalThis.IntersectionObserver.mock.results[0].value;
    expect(instance.observe).toHaveBeenCalledWith(video);
  });

  describe("ensureLoaded", () => {
    it("loads the webm when the browser can play it", () => {
      const { ctrl, video } = mount({ dataSrc: true, dataWebm: true });
      video.canPlayType = vi.fn(() => "maybe");

      ctrl.ensureLoaded();

      expect(video.src).toContain("video.webm");
      expect(ctrl.loaded).toBe(true);
    });

    it("falls back to the mp4 when the browser can't play webm", () => {
      const { ctrl, video } = mount({ dataSrc: true, dataWebm: true });
      video.canPlayType = vi.fn(() => "");

      ctrl.ensureLoaded();

      expect(video.src).toContain("video.mp4");
    });

    it("copies data-src directly on video when no webm is given", () => {
      const { ctrl, video } = mount({ dataSrc: true });

      ctrl.ensureLoaded();

      expect(video.src).toContain("video.mp4");
      expect(ctrl.loaded).toBe(true);
    });

    it("does not reload if already loaded", () => {
      const { ctrl, video } = mount({ dataSrc: true });

      ctrl.ensureLoaded();
      expect(ctrl.loaded).toBe(true);
      const firstSrc = video.src;

      ctrl.ensureLoaded();

      expect(video.src).toBe(firstSrc);
    });
  });

  describe("tryPlay", () => {
    it("calls ensureLoaded then video.play()", () => {
      const { ctrl, video } = mount({ dataSrc: true });
      video.play = vi.fn().mockResolvedValue(undefined);

      ctrl.tryPlay();

      expect(ctrl.loaded).toBe(true);
      expect(video.play).toHaveBeenCalled();
    });

    // The control is always on screen, so it must read as "pause" over a running video
    it("shows the pause glyph once play resolves", async () => {
      const { ctrl, wrapper, btn } = mount();
      const video = createMockVideo(true);
      wrapper.appendChild(video);
      ctrl.video = video;

      ctrl.tryPlay();

      await vi.waitFor(() => {
        expect(btn.hasAttribute("data-playing")).toBe(true);
      });
      expect(btn.getAttribute("aria-label")).toBe("Pause video");
    });

    // iOS Low Power Mode rejects autoplay; the first tap anywhere is a user gesture that lets it through
    it("retries once on the next tap when play rejects", async () => {
      const { ctrl, wrapper, btn } = mount();
      const video = createMockVideo(true);
      video.play = vi.fn().mockRejectedValueOnce(notAllowed()).mockResolvedValue(undefined);
      wrapper.appendChild(video);
      ctrl.video = video;
      ctrl.inView = true;

      ctrl.tryPlay();
      await vi.waitFor(() => {
        expect(btn.hasAttribute("data-blocked")).toBe(true);
      });
      expect(btn.getAttribute("aria-label")).toBe("Play video");

      // One tap fires both events; a scroll that started as a touch fires only touchend
      document.dispatchEvent(new Event("pointerup"));
      document.dispatchEvent(new Event("touchend"));

      expect(video.play).toHaveBeenCalledTimes(2);
    });

    // WebKit lifts the restriction per video, so the one tap must reach videos further down the page too
    it("primes off-screen videos on the same tap, then pauses them", async () => {
      const blocked = mount();
      const blockedVideo = createMockVideo(true);
      blockedVideo.play = vi.fn().mockRejectedValueOnce(notAllowed()).mockResolvedValue(undefined);
      blocked.wrapper.appendChild(blockedVideo);
      blocked.ctrl.video = blockedVideo;
      blocked.ctrl.inView = true;

      const below = mount();
      const belowVideo = createMockVideo(true);
      below.wrapper.appendChild(belowVideo);
      below.ctrl.video = belowVideo;

      blocked.ctrl.tryPlay();
      await vi.waitFor(() => {
        expect(blocked.btn.hasAttribute("data-blocked")).toBe(true);
      });

      document.dispatchEvent(new Event("pointerup"));

      expect(belowVideo.play).toHaveBeenCalledTimes(1);
      await vi.waitFor(() => {
        expect(belowVideo.pause).toHaveBeenCalled();
      });
      expect(below.ctrl.unlocked).toBe(true);
    });

    // A pause() landing before play() resolves rejects it with AbortError — that is a scroll-away, not a refusal
    it("does not treat an interrupted play as blocked", async () => {
      const { ctrl, video, btn } = mount();
      video.play = vi.fn().mockRejectedValue(new DOMException("interrupted", "AbortError"));

      ctrl.tryPlay();
      await new Promise((r) => setTimeout(r, 0));

      expect(btn.hasAttribute("data-blocked")).toBe(false);
    });

    it("leaves a tap on the button itself to the click handler", async () => {
      const { ctrl, video, btn } = mount();
      video.play = vi.fn().mockRejectedValue(notAllowed());
      ctrl.inView = true;

      ctrl.tryPlay();
      await vi.waitFor(() => {
        expect(btn.hasAttribute("data-blocked")).toBe(true);
      });

      btn.dispatchEvent(new Event("pointerup", { bubbles: true }));

      expect(video.play).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateLabel", () => {
    it("marks the button as playing and labels it Pause", () => {
      const { ctrl, wrapper, btn } = mount();
      const video = createMockVideo(false);
      wrapper.appendChild(video);
      ctrl.video = video;

      ctrl.updateLabel();

      expect(btn.getAttribute("aria-label")).toBe("Pause video");
      expect(btn.hasAttribute("data-playing")).toBe(true);
    });

    it("clears the playing state and labels it Play when paused", () => {
      const { ctrl, wrapper, btn } = mount();
      const video = createMockVideo(true);
      wrapper.appendChild(video);
      ctrl.video = video;
      btn.setAttribute("data-playing", "");

      ctrl.updateLabel();

      expect(btn.getAttribute("aria-label")).toBe("Play video");
      expect(btn.hasAttribute("data-playing")).toBe(false);
    });
  });

  describe("handleLeaveView", () => {
    it("pauses video and flips the control back to play", () => {
      const { ctrl, wrapper, btn } = mount();
      const video = createMockVideo(false);
      wrapper.appendChild(video);
      ctrl.video = video;

      ctrl.handleLeaveView();

      expect(video.pause).toHaveBeenCalled();
      expect(btn.getAttribute("aria-label")).toBe("Play video");
    });

    it("does nothing if video is already paused", () => {
      const { ctrl, wrapper } = mount({ reduced: true });
      const video = createMockVideo(true);
      wrapper.appendChild(video);
      ctrl.video = video;

      ctrl.handleLeaveView();

      expect(video.pause).not.toHaveBeenCalled();
    });
  });

  describe("handleEnterView", () => {
    it("calls tryPlay when motion allowed", () => {
      const { ctrl, video } = mount({ dataSrc: true });
      video.play = vi.fn().mockResolvedValue(undefined);
      ctrl.inView = true;

      ctrl.handleEnterView();

      expect(video.play).toHaveBeenCalled();
    });

    it("does not call tryPlay when reduced motion matches", () => {
      const { ctrl, video } = mount({ reduced: true });
      video.play = vi.fn();

      ctrl.handleEnterView();

      expect(video.play).not.toHaveBeenCalled();
    });

    it("waits for page load before playing, so the poster keeps the bandwidth", () => {
      Object.defineProperty(document, "readyState", {
        value: "loading",
        configurable: true,
      });
      const { ctrl, video } = mount({ dataSrc: true });
      video.play = vi.fn().mockResolvedValue(undefined);
      ctrl.inView = true;

      ctrl.handleEnterView();
      expect(video.play).not.toHaveBeenCalled();

      window.dispatchEvent(new Event("load"));
      expect(video.play).toHaveBeenCalled();

    });

    it("does not play if the video scrolled out of view before load fired", () => {
      Object.defineProperty(document, "readyState", {
        value: "loading",
        configurable: true,
      });
      const { ctrl, video } = mount({ dataSrc: true });
      video.play = vi.fn().mockResolvedValue(undefined);
      ctrl.inView = true;

      ctrl.handleEnterView();
      ctrl.inView = false; // user scrolled past while the page was still loading

      window.dispatchEvent(new Event("load"));
      expect(video.play).not.toHaveBeenCalled();

    });

    it("queues one deferred play however many times it re-enters view before load", () => {
      Object.defineProperty(document, "readyState", {
        value: "loading",
        configurable: true,
      });
      const { ctrl, video } = mount({ dataSrc: true });
      video.play = vi.fn().mockResolvedValue(undefined);

      // Scrolling in and out repeatedly while the page is still loading
      ctrl.inView = true;
      ctrl.handleEnterView();
      ctrl.inView = false;
      ctrl.handleLeaveView();
      ctrl.inView = true;
      ctrl.handleEnterView();
      ctrl.inView = false;
      ctrl.handleLeaveView();
      ctrl.inView = true;
      ctrl.handleEnterView();

      window.dispatchEvent(new Event("load"));

      expect(video.play).toHaveBeenCalledTimes(1);

    });

    it("defers again on the next enter-view once the page has loaded", () => {
      const { ctrl, video } = mount({ dataSrc: true });
      video.play = vi.fn().mockResolvedValue(undefined);
      ctrl.inView = true;

      ctrl.handleEnterView();
      ctrl.handleEnterView();

      // readyState is already "complete", so each call runs straight through rather than latching
      expect(video.play).toHaveBeenCalledTimes(2);
    });
  });
});

describe("initProjectVideos", () => {
  const WRAPPER_MARKUP = `
    <div class="project-video-wrapper">
      <video class="project-video-el"></video>
      <button class="project-video-play"></button>
    </div>
  `;

  it("does nothing if no wrappers exist", () => {
    document.body.innerHTML = "<div>no wrappers here</div>";
    const spy = vi.spyOn(document, "querySelectorAll");

    initProjectVideos();

    expect(spy).toHaveBeenCalledWith(".project-video-wrapper");
    spy.mockRestore();
  });

  it("creates a VideoController for each wrapper", () => {
    document.body.innerHTML = WRAPPER_MARKUP + WRAPPER_MARKUP;

    initProjectVideos();

    const videos = document.querySelectorAll(".project-video-el");
    expect(videos[0].dataset.init).toBe("1");
    expect(videos[1].dataset.init).toBe("1");
  });
});

describe("isConstrained", () => {
  it("is true on 3G or slower", () => {
    expect(isConstrained({ effectiveType: "3g" }, null)).toBe(true);
    expect(isConstrained({ effectiveType: "slow-2g" }, null)).toBe(true);
  });

  it("is false on 4G with no battery info", () => {
    expect(isConstrained({ effectiveType: "4g" }, null)).toBe(false);
    expect(isConstrained(undefined, null)).toBe(false);
  });

  it("is true at 20% or below while unplugged", () => {
    expect(isConstrained(undefined, { level: 0.2, charging: false })).toBe(true);
  });

  it("ignores a low battery that is charging", () => {
    expect(isConstrained(undefined, { level: 0.1, charging: true })).toBe(false);
  });
});
