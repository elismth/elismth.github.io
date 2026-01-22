document.addEventListener("DOMContentLoaded", () => {
  const wordEl = document.getElementById("sample-word");
  const track = document.querySelector(".word-scroll-track");
  if (!wordEl || !track) return;

  // 🔧 edit name here
  const WORD = "eli smith";

  // inject spans
  wordEl.innerHTML = "";
  for (const ch of WORD) {
    const span = document.createElement("span");
    if (ch === " ") {
      span.classList.add("space");
      span.innerHTML = "&nbsp;";
    } else {
      span.classList.add("letter");
      span.textContent = ch;
    }
    wordEl.appendChild(span);
  }

  const letters = Array.from(wordEl.querySelectorAll("span.letter"));

  const fontOptions = [
    '"Times New Roman", serif',
    "Georgia, serif",
    '"Courier New", monospace',
    '"Lucida Console", monospace',
    '"Comic Sans MS", cursive',
    '"Trebuchet MS", sans-serif',
    "Impact, fantasy",
    '"Palatino Linotype", Palatino, serif',
    '"Gill Sans", Calibri, sans-serif',
    "Arial, Helvetica, sans-serif"
  ];

  const randFont = () =>
    fontOptions[Math.floor(Math.random() * fontOptions.length)];

  function mutate() {
    for (const letter of letters) letter.style.fontFamily = randFont();
  }

  // initial state
  mutate();

  // Start in the middle (so you can scroll “forever” either direction)
  function setMid() {
    const max = track.scrollHeight - track.clientHeight;
    track.scrollTop = Math.floor(max / 2);
  }
  requestAnimationFrame(setMid);

  let lastTick = 0;
  const COOLDOWN = 60;
  const EDGE = 120;

  track.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      if (now - lastTick > COOLDOWN) {
        lastTick = now;
        mutate();
      }

      // endless loop: if near ends, jump back to middle
      const top = track.scrollTop;
      const max = track.scrollHeight - track.clientHeight;
      if (top < EDGE || top > max - EDGE) setMid();
    },
    { passive: true }
  );
});



