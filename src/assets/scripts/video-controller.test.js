import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { VideoController, initProjectVideos } from "./video-controller.js";

function createWrapper(opts = {}) {
  const {
    hasVideo = true,
    hasBtn = true,
    hasSource = false,
    dataSrc = false,
  } = opts;

  const wrapper = document.createElement("div");
  wrapper.className = "project-video-wrapper";

  if (hasVideo) {
    const video = document.createElement("video");
    video.className = "project-video-el";
    if (dataSrc) video.dataset.src = "video.mp4";
    if (hasSource) {
      const source = document.createElement("source");
      source.dataset.src = "video.webm";
      video.appendChild(source);
    }
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
function mount({ reduced = false, dataSaver = false, ...wrapperOpts } = {}) {
  const wrapper = createWrapper(wrapperOpts);
  const reducedMotion = createMediaQuery(reduced);
  const ctrl = new VideoController(wrapper, reducedMotion, dataSaver);
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

  it("shows button when reduced motion matches", () => {
    const { btn } = mount({ reduced: true });

    expect(btn.hasAttribute("data-visible")).toBe(true);
  });

  it("shows button when data saver is on", () => {
    const { btn } = mount({ dataSaver: true });

    expect(btn.hasAttribute("data-visible")).toBe(true);
  });

  it("does not show button when motion allowed and data saver off", () => {
    const { btn } = mount();

    expect(btn.hasAttribute("data-visible")).toBe(false);
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
    it("copies data-src from source elements to src", () => {
      const { ctrl, video } = mount({ hasSource: true });
      const source = video.querySelector("source");

      ctrl.ensureLoaded();

      expect(source.src).toContain("video.webm");
      expect(ctrl.loaded).toBe(true);
    });

    it("copies data-src directly on video when no source elements", () => {
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

    it("hides button when play resolves", async () => {
      const { ctrl, video, btn } = mount();
      video.play = vi.fn().mockResolvedValue(undefined);

      ctrl.tryPlay();
      await vi.waitFor(() => {
        expect(btn.hasAttribute("data-visible")).toBe(false);
      });
    });

    it("shows button when play rejects", async () => {
      const { ctrl, video, btn } = mount();
      video.play = vi.fn().mockRejectedValue(new Error("play failed"));

      ctrl.tryPlay();
      await vi.waitFor(() => {
        expect(btn.hasAttribute("data-visible")).toBe(true);
      });
    });

    // Data saver no longer blocks playback, so the control has to stay put as the way to stop it
    it("keeps button visible after play resolves when data saver is on", async () => {
      const { ctrl, video, btn } = mount({ dataSaver: true });
      video.play = vi.fn().mockResolvedValue(undefined);

      ctrl.tryPlay();
      await vi.waitFor(() => {
        expect(video.play).toHaveBeenCalled();
      });
      expect(btn.hasAttribute("data-visible")).toBe(true);
    });

    // The pinned control must read as "pause" while playing — data-visible alone would leave a play triangle on a running video
    it("pins the control and shows the pause glyph while playing under data saver", async () => {
      const { ctrl, wrapper, btn } = mount({ dataSaver: true });
      const video = createMockVideo(true);
      wrapper.appendChild(video);
      ctrl.video = video;

      ctrl.tryPlay();

      await vi.waitFor(() => {
        expect(btn.hasAttribute("data-playing")).toBe(true);
      });
      expect(btn.hasAttribute("data-visible")).toBe(true);
      expect(btn.getAttribute("aria-label")).toBe("Pause video");
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
    it("pauses video and shows button when reduced motion matches", () => {
      const { ctrl, wrapper, btn } = mount({ reduced: true });
      const video = createMockVideo(false);
      wrapper.appendChild(video);
      ctrl.video = video;

      ctrl.handleLeaveView();

      expect(video.pause).toHaveBeenCalled();
      expect(btn.hasAttribute("data-visible")).toBe(true);
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

      ctrl.handleEnterView();

      expect(video.play).toHaveBeenCalled();
    });

    it("does not call tryPlay when reduced motion matches", () => {
      const { ctrl, video } = mount({ reduced: true });
      video.play = vi.fn();

      ctrl.handleEnterView();

      expect(video.play).not.toHaveBeenCalled();
    });

    it("still calls tryPlay when data saver is on", () => {
      const { ctrl, video } = mount({ dataSaver: true, dataSrc: true });
      video.play = vi.fn().mockResolvedValue(undefined);

      ctrl.handleEnterView();

      expect(video.play).toHaveBeenCalled();
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

  it("detects data saver via navigator.connection", () => {
    const original = navigator.connection;
    Object.defineProperty(navigator, "connection", {
      value: { effectiveType: "slow-2g", saveData: false },
      configurable: true,
      writable: true,
    });

    document.body.innerHTML = WRAPPER_MARKUP;

    initProjectVideos();

    const btn = document.querySelector(".project-video-play");
    expect(btn.hasAttribute("data-visible")).toBe(true);

    Object.defineProperty(navigator, "connection", {
      value: original,
      configurable: true,
      writable: true,
    });
  });
});
