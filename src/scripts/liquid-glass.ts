// Match Safari 26 Liquid Glass toolbar tint to the visible section:
// hero visible → hero color, footer visible → footer color, otherwise olive-1 (from CSS).
function init() {
    const hero = document.querySelector(".hero-background");
    const foot = document.querySelector("footer");
    let heroVis = false;
    let footVis = false;

    const heroBg = hero ? getComputedStyle(hero).backgroundColor : "";
    const footBg = foot ? getComputedStyle(foot).backgroundColor : "";

    function syncBg() {
        if (heroVis) {
            document.body.style.backgroundColor = heroBg;
        } else if (footVis) {
            document.body.style.backgroundColor = footBg;
        } else {
            document.body.style.backgroundColor = "";
        }
    }

    if (hero || foot) {
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.target === hero) heroVis = e.isIntersecting;
                    else if (e.target === foot) footVis = e.isIntersecting;
                }
                syncBg();
            },
            { threshold: 0 },
        );
        if (hero) io.observe(hero);
        if (foot) io.observe(foot);
    }
}

init();
document.addEventListener("astro:page-load", init);
