document.addEventListener("DOMContentLoaded", () => {
  const topContainer = document.getElementById("top-word");
  if (!topContainer) return;

  // ===== CONFIG =====
  const HEADER_DURATION = 3000 + Math.random() * 2000; // 3–5s
  const HEADER_COOLDOWN = 80; // ms between header flips

  const fontOptions = [
    '"Times New Roman", serif',
    'Georgia, serif',
    '"Courier New", monospace',
    '"Lucida Console", monospace',
    '"Comic Sans MS", cursive',
    '"Trebuchet MS", sans-serif',
    'Impact, fantasy',
    '"Palatino Linotype", Palatino, serif',
    '"Gill Sans", Calibri, sans-serif'
  ];

  const finalFont = 'Arial, Helvetica, sans-serif';

  // ===== 1. HEADER LETTERS =====
  const WORD = (topContainer.dataset.word || "page");
  topContainer.innerHTML = "";
  const headerSpans = [];

  for (let i = 0; i < WORD.length; i++) {
    const span = document.createElement("span");
    span.textContent = WORD[i];
    span.style.display = "inline-block";
    topContainer.appendChild(span);
    headerSpans.push(span);
  }

  const headerCount = headerSpans.length;

  // initial random fonts for header
  headerSpans.forEach(s => {
    s.style.fontFamily =
      fontOptions[Math.floor(Math.random() * fontOptions.length)];
  });

  // ===== ANIMATION LOOP (HEADER ONLY) =====
  let start = performance.now();
  let lastHeaderFlip = 0;

  function animate(now) {
    const elapsed = now - start;
    const headerProgress = Math.min(elapsed / HEADER_DURATION, 1);

    // how many letters should be "locked" so far
    const headerLockedCount = Math.floor(headerProgress * headerCount);

    const shouldFlipHeader =
      headerProgress < 1 && now - lastHeaderFlip > HEADER_COOLDOWN;

    // ----- HEADER: flip only UNLOCKED letters -----
    if (shouldFlipHeader) {
      headerSpans.forEach((span, index) => {
        if (index >= headerLockedCount) {
          span.style.fontFamily =
            fontOptions[Math.floor(Math.random() * fontOptions.length)];
        }
      });
      lastHeaderFlip = now;
    }

    // lock header letters from left to right
    for (let i = 0; i < headerLockedCount; i++) {
      headerSpans[i].style.fontFamily = finalFont;
    }

    if (headerProgress >= 1) {
      headerSpans.forEach(span => (span.style.fontFamily = finalFont));
    }

    // keep animating while header is still in progress
    if (headerProgress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
});
