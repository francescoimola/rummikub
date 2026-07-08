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
