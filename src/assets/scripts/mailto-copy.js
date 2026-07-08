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
