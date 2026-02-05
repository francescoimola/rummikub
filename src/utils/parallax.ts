export function initParallax() {
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const reel = document.getElementById("portfolio-reel");
    if (!reel) return;

    const section = reel.closest("section"); // Get the wrapper section
    if (!section) return;

    const updatePosition = () => {
        const rect = section.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        // Calculate progress: 0 when entering bottom, 1 when leaving top
        // extending the range slightly ensures movement while visible
        const progress =
            (viewHeight - rect.top) / (viewHeight + rect.height);

        // Only animate when in view (with buffer)
        if (progress >= -0.1 && progress <= 1.1) {
            // Move from Left (-X) to Right (+X) as we scroll down
            // Range: -400px to 0px
            // This prevents white space on the left by ensuring we never shift "positive" (Right) past the center
            const moveAmount = -400 + progress * 400;
            reel.style.transform = `translate3d(${moveAmount}px, 0, 0)`;
        }
    };

    window.addEventListener("scroll", () => {
        requestAnimationFrame(updatePosition);
    });

    // Initial call
    updatePosition();
}
