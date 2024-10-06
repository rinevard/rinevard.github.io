window.MathJax = {
  tex: {
    inlineMath: [["$", "$"]],
  },
  svg: {
    fontCache: "global",
  },
};

function toggleTheme() {
  const currentTheme = localStorage.getItem("theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
}

function setTheme(themeName) {
  localStorage.setItem("theme", themeName);
  document.documentElement.setAttribute("theme", themeName);
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");
  setTheme(theme);
}

document.addEventListener("DOMContentLoaded", function () {
  initializeTheme();

  const invertThemeButton = document.getElementById("invert-theme");
  if (invertThemeButton) {
    invertThemeButton.addEventListener("click", toggleTheme);
  }
});
