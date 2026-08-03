// fallow-ignore-file unused-file
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  new Lenis({ autoRaf: true, allowNestedScroll: true });
}
