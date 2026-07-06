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

function createMockVideo(overrides = {}) {
  const el = document.createElement("video");
  el.className = "project-video-el";
  let paused = true;
  Object.defineProperty(el, "paused", {
    get() {
      return paused;
    },
    set(v) {
      paused = v;
    },
    configurable: true,
  });
  el.play = vi.fn().mockImplementation(() => {
    paused = false;
    return Promise.resolve();
  });
  el.pause = vi.fn().mockImplementation(() => {
    paused = true;
  });
  Object.assign(el, overrides);
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
    const wrapper = document.createElement("div");
    const btn = document.createElement("button");
    btn.className = "project-video-play";
    wrapper.appendChild(btn);

    const reducedMotion = createMediaQuery();
    const ctrl = new VideoController(wrapper, reducedMotion, false);

    expect(ctrl.video).toBeNull();
    expect(ctrl.btn).toBeInstanceOf(HTMLButtonElement);
    expect(ctrl.loaded).toBeUndefined();
  });

  it("does nothing if wrapper has no button element", () => {
    const wrapper = document.createElement("div");
    const video = document.createElement("video");
    video.className = "project-video-el";
    wrapper.appendChild(video);

    const reducedMotion = createMediaQuery();
    const ctrl = new VideoController(wrapper, reducedMotion, false);

    expect(ctrl.video).toBeInstanceOf(HTMLVideoElement);
    expect(ctrl.btn).toBeNull();
    expect(ctrl.loaded).toBeUndefined();
  });

  it("does not re-initialize if already init'd", () => {
    const wrapper = createWrapper();
    wrapper.querySelector(".project-video-el").dataset.init = "1";

    const reducedMotion = createMediaQuery();
    const ctrl = new VideoController(wrapper, reducedMotion, false);

    expect(ctrl.video).toBeDefined();
    expect(ctrl.btn).toBeDefined();
    expect(ctrl.loaded).toBeUndefined();
    expect(globalThis.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("shows button when reduced motion matches", () => {
    const wrapper = createWrapper();
    const reducedMotion = createMediaQuery(true);

    new VideoController(wrapper, reducedMotion, false);

    expect(
      wrapper.querySelector(".project-video-play").hasAttribute("data-visible")
    ).toBe(true);
  });

  it("shows button when slow connection", () => {
    const wrapper = createWrapper();
    const reducedMotion = createMediaQuery(false);

    new VideoController(wrapper, reducedMotion, true);

    expect(
      wrapper.querySelector(".project-video-play").hasAttribute("data-visible")
    ).toBe(true);
  });

  it("does not show button when motion allowed and fast connection", () => {
    const wrapper = createWrapper();
    const reducedMotion = createMediaQuery(false);

    new VideoController(wrapper, reducedMotion, false);

    expect(
      wrapper.querySelector(".project-video-play").hasAttribute("data-visible")
    ).toBe(false);
  });

  it("sets data-init on the video element", () => {
    const wrapper = createWrapper();
    const reducedMotion = createMediaQuery(false);

    new VideoController(wrapper, reducedMotion, false);

    expect(wrapper.querySelector(".project-video-el").dataset.init).toBe("1");
  });

  it("observes the video element with IntersectionObserver", () => {
    const wrapper = createWrapper();
    const reducedMotion = createMediaQuery(false);

    new VideoController(wrapper, reducedMotion, false);

    expect(globalThis.IntersectionObserver).toHaveBeenCalled();
    const instance = globalThis.IntersectionObserver.mock.results[0].value;
    expect(instance.observe).toHaveBeenCalledWith(
      wrapper.querySelector(".project-video-el")
    );
  });

  describe("ensureLoaded", () => {
    it("copies data-src from source elements to src", () => {
      const wrapper = createWrapper({ hasSource: true });
      const reducedMotion = createMediaQuery(false);
      const ctrl = new VideoController(wrapper, reducedMotion, false);
      const video = wrapper.querySelector(".project-video-el");
      const source = video.querySelector("source");

      ctrl.ensureLoaded();

      expect(source.src).toContain("video.webm");
      expect(ctrl.loaded).toBe(true);
    });

    it("copies data-src directly on video when no source elements", () => {
      const wrapper = createWrapper({ dataSrc: true });
      const reducedMotion = createMediaQuery(false);
      const ctrl = new VideoController(wrapper, reducedMotion, false);
      const video = wrapper.querySelector(".project-video-el");

      ctrl.ensureLoaded();

      expect(video.src).toContain("video.mp4");
      expect(ctrl.loaded).toBe(true);
    });

    it("does not reload if already loaded", () => {
      const wrapper = createWrapper({ dataSrc: true });
      const reducedMotion = createMediaQuery(false);
      const ctrl = new VideoController(wrapper, reducedMotion, false);

      ctrl.ensureLoaded();
      expect(ctrl.loaded).toBe(true);
      const firstSrc = wrapper.querySelector(".project-video-el").src;

      ctrl.ensureLoaded();
      const secondSrc = wrapper.querySelector(".project-video-el").src;

      expect(firstSrc).toBe(secondSrc);
    });
  });

  describe("tryPlay", () => {
    it("calls ensureLoaded then video.play()", () => {
      const wrapper = createWrapper({ dataSrc: true });
      const reducedMotion = createMediaQuery(false);
      const ctrl = new VideoController(wrapper, reducedMotion, false);
      const video = wrapper.querySelector(".project-video-el");
      video.play = vi.fn().mockResolvedValue(undefined);

      ctrl.tryPlay();

      expect(ctrl.loaded).toBe(true);
      expect(video.play).toHaveBeenCalled();
    });

    it("hides button when play resolves", async () => {
      const wrapper = createWrapper();
      const btn = wrapper.querySelector(".project-video-play");
      const reducedMotion = createMediaQuery(false);
      const ctrl = new VideoController(wrapper, reducedMotion, false);
      const video = wrapper.querySelector(".project-video-el");
      video.play = vi.fn().mockResolvedValue(undefined);

      ctrl.tryPlay();
      await vi.waitFor(() => {
        expect(btn.hasAttribute("data-visible")).toBe(false);
      });
    });

    it("shows button when play rejects", async () => {
      const wrapper = createWrapper();
      const btn = wrapper.querySelector(".project-video-play");
      const reducedMotion = createMediaQuery(false);
      const ctrl = new VideoController(wrapper, reducedMotion, false);
      const video = wrapper.querySelector(".project-video-el");
      video.play = vi.fn().mockRejectedValue(new Error("play failed"));

      ctrl.tryPlay();
      await vi.waitFor(() => {
        expect(btn.hasAttribute("data-visible")).toBe(true);
      });
    });
  });

  describe("handleLeaveView", () => {
    it("pauses video and shows button when reduced motion matches", () => {
      const wrapper = createWrapper();
      const btn = wrapper.querySelector(".project-video-play");
      const reducedMotion = createMediaQuery(true);
      const ctrl = new VideoController(wrapper, reducedMotion, false);
      const video = createMockVideo({ paused: false });
      wrapper.appendChild(video);
      ctrl.video = video;

      ctrl.handleLeaveView();

      expect(video.pause).toHaveBeenCalled();
      expect(btn.hasAttribute("data-visible")).toBe(true);
    });

    it("does nothing if video is already paused", () => {
      const wrapper = createWrapper();
      const reducedMotion = createMediaQuery(true);
      const ctrl = new VideoController(wrapper, reducedMotion, false);
      const video = createMockVideo({ paused: true });
      wrapper.appendChild(video);
      ctrl.video = video;

      ctrl.handleLeaveView();

      expect(video.pause).not.toHaveBeenCalled();
    });
  });

  describe("handleEnterView", () => {
    it("calls tryPlay when motion allowed and fast connection", () => {
      const wrapper = createWrapper({ dataSrc: true });
      const reducedMotion = createMediaQuery(false);
      const ctrl = new VideoController(wrapper, reducedMotion, false);
      const video = wrapper.querySelector(".project-video-el");
      video.play = vi.fn().mockResolvedValue(undefined);

      ctrl.handleEnterView();

      expect(video.play).toHaveBeenCalled();
    });

    it("does not call tryPlay when reduced motion matches", () => {
      const wrapper = createWrapper();
      const reducedMotion = createMediaQuery(true);
      const ctrl = new VideoController(wrapper, reducedMotion, false);
      const video = wrapper.querySelector(".project-video-el");
      video.play = vi.fn();

      ctrl.handleEnterView();

      expect(video.play).not.toHaveBeenCalled();
    });

    it("does not call tryPlay on slow connection", () => {
      const wrapper = createWrapper();
      const reducedMotion = createMediaQuery(false);
      const ctrl = new VideoController(wrapper, reducedMotion, true);
      const video = wrapper.querySelector(".project-video-el");
      video.play = vi.fn();

      ctrl.handleEnterView();

      expect(video.play).not.toHaveBeenCalled();
    });
  });
});

describe("initProjectVideos", () => {
  it("does nothing if no wrappers exist", () => {
    document.body.innerHTML = "<div>no wrappers here</div>";
    const spy = vi.spyOn(document, "querySelectorAll");

    initProjectVideos();

    expect(spy).toHaveBeenCalledWith(".project-video-wrapper");
    spy.mockRestore();
  });

  it("creates a VideoController for each wrapper", () => {
    document.body.innerHTML = `
      <div class="project-video-wrapper">
        <video class="project-video-el"></video>
        <button class="project-video-play"></button>
      </div>
      <div class="project-video-wrapper">
        <video class="project-video-el"></video>
        <button class="project-video-play"></button>
      </div>
    `;

    initProjectVideos();

    const videos = document.querySelectorAll(".project-video-el");
    expect(videos[0].dataset.init).toBe("1");
    expect(videos[1].dataset.init).toBe("1");
  });

  it("detects slow connection via navigator.connection", () => {
    const original = navigator.connection;
    Object.defineProperty(navigator, "connection", {
      value: { effectiveType: "slow-2g", saveData: false },
      configurable: true,
      writable: true,
    });

    document.body.innerHTML = `
      <div class="project-video-wrapper">
        <video class="project-video-el"></video>
        <button class="project-video-play"></button>
      </div>
    `;

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
