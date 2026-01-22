document.addEventListener("DOMContentLoaded", () => {
  const topContainer = document.getElementById("top-word");
  if (!topContainer) return;

  const HEADER_DURATION = 1750 + Math.random() * 2000;
  const HEADER_COOLDOWN = 80;

  const fontOptions = [
    '"Times New Roman", serif',
    "Georgia, serif",
    '"Courier New", monospace',
    '"Lucida Console", monospace',
    '"Comic Sans MS", cursive',
    '"Trebuchet MS", sans-serif',
    "Impact, fantasy",
    '"Palatino Linotype", Palatino, serif',
    '"Gill Sans", Calibri, sans-serif'
  ];

  const finalFont = "Arial, Helvetica, sans-serif";

  const WORD = (topContainer.dataset.word || "page").toString();

  topContainer.innerHTML = "";

  const letterSpans = [];

  for (let i = 0; i < WORD.length; i++) {
    const ch = WORD[i];
    const span = document.createElement("span");
    span.style.display = "inline-block";

    if (ch === " ") {
      span.classList.add("space");
      span.innerHTML = "&nbsp;";
      topContainer.appendChild(span);
      continue;
    }

    span.textContent = ch;
    span.classList.add("letter");
    topContainer.appendChild(span);
    letterSpans.push(span);
  }

  const headerCount = letterSpans.length;

  letterSpans.forEach((s) => {
    s.style.fontFamily = fontOptions[Math.floor(Math.random() * fontOptions.length)];
  });

  let start = performance.now();
  let lastFlip = 0;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / HEADER_DURATION, 1);

    const lockedCount = Math.floor(progress * headerCount);

    const shouldFlip = progress < 1 && (now - lastFlip > HEADER_COOLDOWN);

    if (shouldFlip) {
      letterSpans.forEach((span, idx) => {
        if (idx >= lockedCount) {
          span.style.fontFamily = fontOptions[Math.floor(Math.random() * fontOptions.length)];
        }
      });
      lastFlip = now;
    }

    for (let i = 0; i < lockedCount; i++) {
      letterSpans[i].style.fontFamily = finalFont;
    }

    if (progress >= 1) {
      letterSpans.forEach((span) => (span.style.fontFamily = finalFont));
    }

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
