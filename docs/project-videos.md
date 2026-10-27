# Project videos

Embed lazy, autoplay-in-view videos with the `projectVideo` shortcode (defined in `eleventy.config.js`). Nothing downloads until an `IntersectionObserver` in `src/assets/scripts/app-core.js` sees the video near the viewport (`preload="none"` + `data-src`); it then autoplays muted and pauses when scrolled away. The play/pause control is **hidden** unless `<html>` has `[data-video-controls]` (≤3G connection, battery ≤20% unplugged, or reduced motion — `watchConstraints` in `video-controller.js`; the network/battery APIs are Chromium-only), the button has `[data-blocked]` (autoplay refused), or it has keyboard focus; its glyph follows `[data-playing]`. `prefers-reduced-motion` gets no autoplay. iOS Low Power Mode rejects `play()` (`NotAllowedError`; an `AbortError` is a scroll-away, not a refusal) and lifts the block per video, so a refusal centres the button and the next tap anywhere (`pointerup`/`touchend`) plays every video once, pausing the off-screen ones. Styling: `.project-video*` in `_components.scss`.

```njk
{% projectVideo "/assets/portfolio/x.webm", "Alt text" %}                                  {# webm-only (Safari 16+) #}
{% projectVideo "/assets/portfolio/x.mp4", "Alt", webm="/assets/portfolio/x.webm",
                poster="/assets/portfolio/x.jpg", caption="Optional caption" %}             {# webm + mp4 fallback #}
{% projectVideo "/assets/portfolio/x.mp4", "Alt", class="site-recording" %}                {# extra class on .project-video-wrapper #}
```

- **Formats:** WebM (small) with an MP4 fallback is the safe default — WebM-only drops pre-16 Safari/iOS. Single-format `src` may be `.webm` or `.mp4` (no `type` attr; browser sniffs).
- **Optimize raw uploads:** drop `<name>.src.{mp4,mov,webm}` into `src/assets/portfolio/`, run `pnpm optimize:video` (needs system `ffmpeg` on PATH) → emits `<name>.mp4`, `<name>.webm`, and a `<name>.jpg` poster.
