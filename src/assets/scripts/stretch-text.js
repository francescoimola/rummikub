// Fit each .stretch SVG's viewBox to its <text> so preserveAspectRatio="none" stretches it edge to edge.
function fitStretchText() {
  var svgs = document.querySelectorAll(".stretch svg");
  if (!svgs.length) return;

  // Measure against the real webfont, else getBBox reads fallback metrics and the box jumps when Ronzino swaps in.
  var fonts = document.fonts;
  if (fonts && fonts.status !== "loaded") {
    fonts.ready.then(apply);
  } else {
    apply();
  }

  function apply() {
    // Batch all getBBox reads before any write to avoid forced synchronous layout (thrashing).
    var boxes = [];
    svgs.forEach(function (svg) {
      var text = svg.querySelector("text");
      try {
        // getBBox throws in Firefox when the node isn't rendered; fall back to the placeholder viewBox.
        boxes.push(text ? text.getBBox() : null);
      } catch (e) {
        boxes.push(null);
      }
    });
    svgs.forEach(function (svg, i) {
      var b = boxes[i];
      // Skip zero boxes (hidden/unrendered) so we keep the server-rendered placeholder viewBox.
      if (b && b.width) svg.setAttribute("viewBox", b.x + " " + b.y + " " + b.width + " " + b.height);
    });
  }
}

export { fitStretchText };
