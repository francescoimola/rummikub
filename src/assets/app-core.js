document.querySelectorAll('[aria-controls]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    var target = document.getElementById(btn.getAttribute('aria-controls'));
    target.classList.toggle('is-open');
    btn.textContent = expanded ? 'Read more' : 'Read less';
    if (!expanded) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});

document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    var email = a.getAttribute('href').replace('mailto:', '');
    var original = a.textContent;
    navigator.clipboard.writeText(email).then(function () {
      a.textContent = 'Email copied!';
      setTimeout(function () { a.textContent = original; }, 2000);
    });
  });
});

// Lazy project videos: nothing downloads until the video is near the viewport,
// then it autoplays muted and pauses when scrolled away. Respects
// prefers-reduced-motion and slow connections by showing the play button instead.
// Ported from the old Astro ProjectVideo component.
function initProjectVideos() {
  var wrappers = document.querySelectorAll('.project-video-wrapper');
  if (!wrappers.length) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var conn = navigator.connection;
  var slowConnection =
    !!conn &&
    (conn.saveData === true ||
      conn.effectiveType === 'slow-2g' ||
      conn.effectiveType === '2g');

  wrappers.forEach(function (wrapper) {
    var video = wrapper.querySelector('.project-video-el');
    var btn = wrapper.querySelector('.project-video-play');
    if (!video || !btn) return;

    // Skip if already initialised
    if (video.dataset.init) return;
    video.dataset.init = '1';

    var inView = false;
    var loaded = false;

    var showBtn = function () { btn.setAttribute('data-visible', ''); };
    var hideBtn = function () { btn.removeAttribute('data-visible'); };

    // Promote data-src -> src (once), for either video[data-src] or <source data-src>.
    var ensureLoaded = function () {
      if (loaded) return;
      loaded = true;
      var sources = video.querySelectorAll('source[data-src]');
      if (sources.length) {
        sources.forEach(function (s) { s.src = s.dataset.src; });
        video.load();
      } else if (video.dataset.src) {
        video.src = video.dataset.src;
      }
    };

    var tryPlay = function () {
      ensureLoaded();
      var p = video.play();
      if (p && p.then) {
        p.then(hideBtn).catch(showBtn);
      }
    };

    // Reduced-motion or slow connection: show button, don't autoplay
    if (reducedMotion.matches || slowConnection) showBtn();

    btn.addEventListener('click', function () {
      if (video.paused) {
        tryPlay();
      } else {
        video.pause();
        showBtn();
      }
    });

    // Load and play only when genuinely near the viewport. The tight margin means
    // headless bots (no scroll) never trigger a fetch; real users get just-in-time autoplay.
    var observer = new IntersectionObserver(
      function (entries) {
        var entry = entries[0];
        inView = entry.isIntersecting;
        if (inView && !reducedMotion.matches && !slowConnection) {
          tryPlay();
        } else if (!inView && !video.paused) {
          video.pause();
          if (reducedMotion.matches) showBtn();
        }
      },
      { threshold: 0.25, rootMargin: '25% 0px' }
    );
    observer.observe(video);

    // React to live preference changes
    reducedMotion.addEventListener('change', function () {
      if (reducedMotion.matches) {
        video.pause();
        showBtn();
      } else if (inView) {
        tryPlay();
      }
    });
  });
}

initProjectVideos();
