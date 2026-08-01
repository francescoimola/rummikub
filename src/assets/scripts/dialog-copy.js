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

  var label;
  var timer;

  trigger.addEventListener("click", function () {
    dialog.showModal();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target.closest("[data-dialog-close]")) return dialog.close();

    var btn = event.target.closest("[data-dialog-copy]");
    var content = dialog.querySelector("[data-dialog-content]");
    if (!btn || !content) return;

    copy(content).catch(function () {}); // a denied write must not break the label swap
    if (label === undefined) label = btn.textContent;
    btn.textContent = "Copied!";
    clearTimeout(timer);
    timer = setTimeout(function () {
      btn.textContent = label;
    }, RESET_DELAY);
  });
});
