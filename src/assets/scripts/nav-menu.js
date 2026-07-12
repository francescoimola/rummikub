// Progressive enhancement for the mobile nav <details> — Esc, tap-outside, and tap-a-link close it.
// The native <summary> handles the actual toggle + animation; this only adds the extra close paths.
var menu = document.querySelector(".nav-menu");

if (menu) {
  var close = function () {
    menu.open = false;
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.open) close();
  });

  document.addEventListener("pointerdown", function (e) {
    if (menu.open && !menu.contains(e.target)) close();
  });

  menu.querySelectorAll(".nav-menu__panel a").forEach(function (link) {
    link.addEventListener("click", close);
  });
}
