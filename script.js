document.addEventListener("DOMContentLoaded", () => {
  // Always start at the top when the page loads / refreshes
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  const centerContainer = document.getElementById("sample-word");
  const topContainer = document.getElementById("top-word");
  const hint = document.querySelector(".scroll-hint");
  const menu = document.getElementById("menu");
  const menuItems = Array.from(document.querySelectorAll(".menu-item"));

  // Main intro word
  const WORD = "elismith"; // change this to any word you want

  // Dynamically create spans for the center word only
  for (let i = 0; i < WORD.length; i++) {
    const ch = WORD[i];

    const centerSpan = document.createElement("span");
    centerSpan.textContent = ch;
    centerContainer.appendChild(centerSpan);
  }

  const centerLetters = centerContainer.querySelectorAll("span");

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

  // Scroll percentage where locking starts / ends
  const LOCK_START = 0.08; // 8% down the page
  const LOCK_END   = 0.35; // 35% down the page

  // Flip cooldown so scroll doesn't flip too fast
  let lastFlip = 0;
  const FLIP_COOLDOWN = 120; // ms between font changes

  // Track progress so letters only ever lock once
  let maxLockedSoFar = 0;
  const totalLetters = centerLetters.length;
  let headerShown = false;

  // Initial random fonts for the center word
  centerLetters.forEach(letter => {
    const f = fontOptions[Math.floor(Math.random() * fontOptions.length)];
    letter.style.fontFamily = f;
  });

  // ---------- SCROLL INTRO LOGIC ----------
  function updateFromScroll() {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.scrollY;

    if (maxScroll <= 0) return;

    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    // Fade out hint once user starts scrolling a bit
    if (progress > 0.02 && hint) {
      hint.style.opacity = 0;
    }

    // Determine how many letters "should" be locked based on scroll
    let lockProgress = 0;

    if (progress <= LOCK_START) {
      lockProgress = 0;
    } else if (progress >= LOCK_END) {
      lockProgress = 1;
    } else {
      lockProgress = (progress - LOCK_START) / (LOCK_END - LOCK_START);
    }

    let desiredLocked = Math.round(lockProgress * totalLetters);
    if (desiredLocked > totalLetters) desiredLocked = totalLetters;

    // Make locking one-way
    if (desiredLocked > maxLockedSoFar) {
      maxLockedSoFar = desiredLocked;
    }

    const now = performance.now();

    centerLetters.forEach((letter, index) => {
      if (index < maxLockedSoFar) {
        // Locked in final font, but stay visible
        letter.style.fontFamily = finalFont;
      } else {
        // Still flipping, but respect cooldown
        if (now - lastFlip > FLIP_COOLDOWN) {
          const f = fontOptions[Math.floor(Math.random() * fontOptions.length)];
          letter.style.fontFamily = f;
        }
      }
    });

    // Once all letters are locked, show the top header word once
    if (maxLockedSoFar === totalLetters && !headerShown) {
      headerShown = true;
      topContainer.textContent = WORD;
      topContainer.classList.add("top-word-visible");
    }

    if (maxLockedSoFar === totalLetters) {
      centerContainer.classList.add("fade-out");
      menu.classList.add("menu-visible");
    }

    if (now - lastFlip > FLIP_COOLDOWN) {
      lastFlip = now;
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      updateFromScroll();
    },
    { passive: true }
  );

  // ---------- SIMPLE MENU NAVIGATION ----------
  menuItems.forEach((item, idx) => {
    item.addEventListener("click", () => {
      if (idx === 0) {
        window.location.href = "about.html";
      } else if (idx === 1) {
        window.location.href = "projects.html";
      } else if (idx === 2) {
        window.location.href = "skills.html";
      } else if (idx === 3) {
        window.location.href = "contact.html";
      }
    });
  });
});
