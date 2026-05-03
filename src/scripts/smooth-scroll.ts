import Lenis from "lenis";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenisInstance: Lenis | undefined;

function initLenis() {
    lenisInstance?.destroy();

    lenisInstance = new Lenis({
        duration: reducedMotion ? 0.5 : 1.0,
        easing: reducedMotion
            ? (t: number) => t
            : (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        autoRaf: true,
        anchors: true,
    });
}

initLenis();
document.addEventListener("astro:page-load", initLenis);
