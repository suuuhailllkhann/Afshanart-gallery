// Reusable auto-advancing image carousel with dot indicators.
// Swaps the src of a single <img> element on an interval, and renders
// dot buttons into a sibling container when there's more than one image.
// Used on Shop cards (products.js) and the Inquire page (inquire.js).
function attachCarousel(imgEl, dotsEl, images, intervalMs = 5000) {
  if (!imgEl || !images || images.length <= 1) return;

  let index = 0;
  let timer = null;

  function render() {
    imgEl.src = images[index];
    if (dotsEl) {
      dotsEl.querySelectorAll(".carousel-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }
  }

  function next() {
    index = (index + 1) % images.length;
    render();
  }

  function goTo(i) {
    index = i;
    render();
    resetTimer();
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, intervalMs);
  }

  if (dotsEl) {
    dotsEl.innerHTML = images
      .map((_, i) => `<span class="carousel-dot${i === 0 ? " active" : ""}" data-index="${i}"></span>`)
      .join("");
    dotsEl.querySelectorAll(".carousel-dot").forEach((dot) => {
      dot.addEventListener("click", (e) => {
        // Cards are wrapped in a link to the Inquire page — don't navigate
        // when someone is just clicking a dot to browse photos.
        e.preventDefault();
        e.stopPropagation();
        goTo(Number(dot.dataset.index));
      });
    });
  }

  resetTimer();
}
