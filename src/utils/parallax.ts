export function initParallax() {
    const reel = document.getElementById("portfolio-reel");
    if (!reel) return;

    const section = reel.closest("section");
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Slightly reduced range for reduced-motion users
    const moveRange = prefersReducedMotion ? 300 : 400;

    reel.style.willChange = "transform";

    let ticking = false;

    const updatePosition = () => {
        const rect = section.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        // Calculate progress: 0 when entering bottom, 1 when leaving top
        const progress =
            (viewHeight - rect.top) / (viewHeight + rect.height);

        if (progress >= -0.1 && progress <= 1.1) {
            const moveAmount = -moveRange + progress * moveRange;
            reel.style.transform = `translate3d(${moveAmount}px, 0, 0)`;
        }

        ticking = false;
    };

    const requestTick = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updatePosition);
        }
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    // iOS Safari throttles scroll events during momentum scrolling,
    // so also listen to touchmove to keep updates smooth
    window.addEventListener("touchmove", requestTick, { passive: true });

    updatePosition();
}
