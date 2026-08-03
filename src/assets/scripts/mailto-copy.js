document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
  var email = btn.getAttribute("data-copy-email");
  var status = btn.parentElement.querySelector("[data-copy-status]");

  btn.addEventListener("click", function () {
    navigator.clipboard
      .writeText(email)
      .then(function () {
        if (status) status.textContent = "Email address copied to clipboard";
      })
      .catch(function () {
        if (status) status.textContent = "Copy failed — the address is " + email;
      });
  });
});
