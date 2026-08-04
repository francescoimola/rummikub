var RESET_DELAY = 2000;

document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
  var email = btn.getAttribute("data-copy-email");
  var status = btn.parentElement.querySelector("[data-copy-status]");
  var label = btn.textContent;
  var timer;

  // scheduled from the message, not the click — the clipboard write is async
  function reset() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      btn.textContent = label;
      if (status) status.textContent = "";
    }, RESET_DELAY);
  }

  btn.addEventListener("click", function () {
    navigator.clipboard
      .writeText(email)
      .then(function () {
        // the icon is a ::before pseudo-element, so swapping textContent leaves it intact
        btn.textContent = "Email copied!";
        if (status) status.textContent = "Email copied!";
        reset();
      })
      .catch(function () {
        btn.textContent = "Copy failed";
        if (status) status.textContent = "Copy failed — the address is " + email;
        reset();
      });
  });
});
