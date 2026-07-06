document.querySelectorAll("[aria-controls]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    var target = document.getElementById(btn.getAttribute("aria-controls"));
    target.classList.toggle("is-open");
    btn.textContent = expanded ? "Read more" : "Read less";
    if (!expanded) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      btn.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
});

document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
  a.addEventListener("click", function (e) {
    e.preventDefault();
    var email = a.getAttribute("href").replace("mailto:", "");
    var original = a.textContent;
    navigator.clipboard.writeText(email).then(function () {
      a.textContent = "Email copied!";
      setTimeout(function () {
        a.textContent = original;
      }, 2000);
    });
  });
});

function createVideoController(wrapper, reducedMotion, slowConnection) {
  var video = wrapper.querySelector(".project-video-el");
  var btn = wrapper.querySelector(".project-video-play");
  if (!video || !btn) return;
  if (video.dataset.init) return;
  video.dataset.init = "1";

  var inView = false;
  var loaded = false;

  function showBtn() {
    btn.setAttribute("data-visible", "");
  }

  function hideBtn() {
    btn.removeAttribute("data-visible");
  }

  function ensureLoaded() {
    if (loaded) return;
    loaded = true;
    var sources = video.querySelectorAll("source[data-src]");
    if (sources.length) {
      sources.forEach(function (s) {
        s.src = s.dataset.src;
      });
      video.load();
    } else if (video.dataset.src) {
      video.src = video.dataset.src;
    }
  }

  function tryPlay() {
    ensureLoaded();
    var p = video.play();
    if (p && p.then) {
      p.then(hideBtn).catch(showBtn);
    }
  }

  function handleEnterView() {
    if (!reducedMotion.matches && !slowConnection) {
      tryPlay();
    }
  }

  function handleLeaveView() {
    if (!video.paused) {
      video.pause();
      if (reducedMotion.matches) showBtn();
    }
  }

  function setupObserver() {
    var observer = new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) handleEnterView();
      else handleLeaveView();
    }, { threshold: 0.25, rootMargin: "25% 0px" });
    observer.observe(video);
  }

  function setupListeners() {
    btn.addEventListener("click", function () {
      if (video.paused) tryPlay();
      else {
        video.pause();
        showBtn();
      }
    });

    reducedMotion.addEventListener("change", function () {
      if (reducedMotion.matches) {
        video.pause();
        showBtn();
      } else if (inView) {
        tryPlay();
      }
    });
  }

  if (reducedMotion.matches || slowConnection) showBtn();
  setupObserver();
  setupListeners();
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
    createVideoController(wrapper, reducedMotion, slowConnection);
  });
}

initProjectVideos();
