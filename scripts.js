window.MathJax = {
  tex: {
    inlineMath: [["$", "$"]],
  },
  svg: {
    fontCache: "global",
  },
};

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
}

function setTheme(themeName) {
  localStorage.setItem("theme", themeName);
  document.documentElement.setAttribute("theme", themeName);
  updateButtonText();
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");
  setTheme(theme);
}

function updateButtonText() {
  const invertThemeButton = document.getElementById("invert-theme");
  const currentTheme =
    document.documentElement.getAttribute("theme") || "light";
  invertThemeButton.textContent =
    currentTheme === "light" ? "深色模式" : "浅色模式";
}

function addCopyButtons() {
  const codeBlocks = document.querySelectorAll("pre");
  codeBlocks.forEach((block, index) => {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.textContent = "复制";
    button.addEventListener("click", () => copyCode(block, button));
    block.appendChild(button);
  });
}

async function copyCode(block, button) {
  const code = block.querySelector("code");

  try {
    await navigator.clipboard.writeText(code.textContent);
    button.textContent = "已复制!";
    setTimeout(() => {
      button.textContent = "复制";
    }, 2000);
  } catch (e) {
    console.error("复制失败", e);
    button.textContent = "复制失败";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeTheme();

  const invertThemeButton = document.getElementById("invert-theme");
  if (invertThemeButton) {
    invertThemeButton.addEventListener("click", toggleTheme);
  }

  addCopyButtons();
});
