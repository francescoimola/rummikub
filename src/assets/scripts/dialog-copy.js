var RESET_DELAY = 2000;

// Rich-text targets keep the bold, plain-text targets get readable text
function copy(content) {
  var text = Array.prototype.map
    .call(content.querySelectorAll("p"), function (p) {
      return p.textContent.trim();
    })
    .join("\n\n");

  if (typeof ClipboardItem === "undefined") {
    return navigator.clipboard.writeText(text);
  }

  return navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([content.innerHTML], { type: "text/html" }),
      "text/plain": new Blob([text], { type: "text/plain" }),
    }),
  ]);
}

document.querySelectorAll("[data-dialog-open]").forEach(function (trigger) {
  var dialog = document.getElementById(trigger.getAttribute("data-dialog-open"));
  if (!dialog) return;

  var status = dialog.querySelector("[data-dialog-status]");
  var timer;

  trigger.addEventListener("click", function () {
    dialog.showModal();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target.closest("[data-dialog-close]")) return dialog.close();

    var btn = event.target.closest("[data-dialog-copy]");
    var content = dialog.querySelector("[data-dialog-content]");
    if (!btn || !content) return;

    copy(content)
      .then(function () {
        if (status) status.textContent = "Copied to clipboard";
      })
      .catch(function () {
        if (status) status.textContent = "Copy failed";
      });

    if (status) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        status.textContent = "";
      }, RESET_DELAY);
    }
  });
});
