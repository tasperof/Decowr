const paletteEl = document.getElementById("palette");
const generateBtn = document.getElementById("generateBtn");
const resetLocksBtn = document.getElementById("resetLocksBtn");
const countInput = document.getElementById("countInput");
const toast = document.getElementById("toast");

let colors = []; // [{ hex: "#AABBCC", locked: false }]

function randomHexColor() {
  const n = Math.floor(Math.random() * 16777215); // 0xFFFFFF
  return "#" + n.toString(16).padStart(6, "0").toUpperCase();
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 900);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied ${text}`);
  } catch {
    showToast("Copy failed");
  }
}

function ensureColors(count) {
  // Resize colors array while preserving existing locks/colors
  if (colors.length < count) {
    while (colors.length < count) {
      colors.push({ hex: randomHexColor(), locked: false });
    }
  } else if (colors.length > count) {
    colors = colors.slice(0, count);
  }
}

function generatePalette() {
  const count = Math.max(3, Math.min(15, Number(countInput.value) || 5));
  countInput.value = count;

  ensureColors(count);

  colors = colors.map((c) => {
    if (c.locked) return c;
    return { ...c, hex: randomHexColor() };
  });

  render();
}

function toggleLock(index) {
  colors[index].locked = !colors[index].locked;
  render();
}

function render() {
  // Set grid columns equal to count (desktop only). Mobile overrides in CSS.
  paletteEl.style.gridTemplateColumns = `repeat(${colors.length}, 1fr)`;

  paletteEl.innerHTML = "";

  colors.forEach((c, index) => {
    const swatch = document.createElement("div");
    swatch.className = "swatch";
    swatch.style.background = c.hex;

    // clicking swatch copies hex
    swatch.addEventListener("click", () => copyToClipboard(c.hex));

    const label = document.createElement("div");
    label.className = "label";

    const hex = document.createElement("span");
    hex.className = "hex";
    hex.textContent = c.hex;

    const lockBtn = document.createElement("button");
    lockBtn.className = "lock";
    lockBtn.textContent = c.locked ? "🔒" : "🔓";
    lockBtn.title = c.locked ? "Locked" : "Unlocked";

    // stop click from copying when clicking lock
    lockBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLock(index);
    });

    label.appendChild(hex);
    label.appendChild(lockBtn);
    swatch.appendChild(label);
    paletteEl.appendChild(swatch);
  });
}

function unlockAll() {
  colors = colors.map((c) => ({ ...c, locked: false }));
  render();
}

// Buttons
generateBtn.addEventListener("click", generatePalette);
resetLocksBtn.addEventListener("click", unlockAll);

// Generate on load
generatePalette();

// Optional: Spacebar generates
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    generatePalette();
  }
});
