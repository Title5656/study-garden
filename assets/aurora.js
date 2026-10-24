/* Events only: no drawing loop, scroll handler, or pointer tracking. */
(() => {
  "use strict";
  const stage = document.querySelector(".aurora-scene");
  const button = document.querySelector(".aurora-toggle");
  if (!stage || !button) return;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let manuallyPaused = false;
  function syncMotion() {
    stage.dataset.paused = String(manuallyPaused || document.hidden || reducedMotion.matches);
    button.setAttribute("aria-pressed", String(manuallyPaused));
    button.querySelector("span").textContent = manuallyPaused ? "เล่นแสง" : "พักแสง";
  }
  button.addEventListener("click", () => { manuallyPaused = !manuallyPaused; syncMotion(); });
  document.addEventListener("visibilitychange", syncMotion);
  reducedMotion.addEventListener("change", syncMotion);
  syncMotion();
})();
