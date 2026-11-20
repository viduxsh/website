(function() {
    if (document.querySelector('script[data-goatcounter]')) return;
    
    var script = document.createElement('script');
    script.async = true;
    script.src = '//gc.zgo.at/count.js';
    script.setAttribute('data-goatcounter', 'https://viduxsh.goatcounter.com/count');
    
    document.head.appendChild(script);
})();

const themeToggle = document.querySelector("#switcher");
function getAutoTheme() {
  const h = new Date().getHours();
  return (h >= 20 || h < 8) ? "dark" : "light";
}

const THEME_KEY = "theme";
const THEME_EXPIRATION_KEY = "theme_expiration";
const THEME_TTL_MS = 60 * 60 * 1000;

function getSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const expiration = Number(localStorage.getItem(THEME_EXPIRATION_KEY));

  if (savedTheme !== "dark" && savedTheme !== "light") {
    clearSavedTheme();
    return null;
  }
  if (!Number.isFinite(expiration) || expiration <= Date.now()) {
    clearSavedTheme();
    return null;
  }
  return savedTheme;
}

function clearSavedTheme() {
  localStorage.removeItem(THEME_KEY);
  localStorage.removeItem(THEME_EXPIRATION_KEY);
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  localStorage.setItem(THEME_EXPIRATION_KEY, String(Date.now() + THEME_TTL_MS));
}

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.checked = theme === "dark";
  }
}

let currentTheme = getSavedTheme() || getAutoTheme();
applyTheme(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      currentTheme = "dark";
    } else {
      currentTheme = "light";
    }
    applyTheme(currentTheme);
    saveTheme(currentTheme);
  });
}

window.setInterval(() => {
  const savedTheme = getSavedTheme();
  if (!savedTheme) {
    applyTheme(getAutoTheme());
  }
}, 60 * 1000);

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const birthYear = 2001;
const age = currentYear - birthYear;

const ageContainer = document.getElementById("my-age");
const copyrightContainer = document.getElementById("copyright-year");

if (ageContainer) {
  ageContainer.dataset.i18n = "footer_age";
  ageContainer.dataset.i18nAge = String(age);
}

if (copyrightContainer) {
  copyrightContainer.dataset.i18n = "footer_copyright";
  copyrightContainer.dataset.i18nYear = String(currentYear);
}
function updateLastModified() {
  const d = new Date(document.lastModified);
  let formatted = "";
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    formatted = `${day}/${month}/${year} ${hours}:${minutes}`;
  } else {
    formatted = document.lastModified;
  }

  const lastModifiedContainer = document.getElementById("last-modified-date");
  if (lastModifiedContainer) {
    lastModifiedContainer.textContent = formatted;
  }
}
updateLastModified();

document.querySelectorAll("[data-visitor-count]").forEach((element) => {
  element.dataset.i18n = "footer_loading";
});

const footerBottom = document.querySelector("footer .footer-bottom");
if (footerBottom && !footerBottom.querySelector("[data-visitor-count]")) {
  const visitorCount = document.createElement("p");
  const visitsLabel = document.createElement("span");
  visitsLabel.dataset.i18n = "footer_visits";
  visitsLabel.textContent = "Total visits:";
  visitorCount.appendChild(visitsLabel);
  visitorCount.appendChild(document.createTextNode(" "));

  const count = document.createElement("span");
  count.dataset.visitorCount = "";
  count.dataset.i18n = "footer_loading";
  count.textContent = "Loading...";
  visitorCount.appendChild(count);

  const credits = footerBottom.querySelector(".credits");
  footerBottom.insertBefore(visitorCount, credits);
}

const visitorCountUrl = new URL("../data/visitor-count.json", document.currentScript.src);
fetch(visitorCountUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const count = Number(data.count);
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new Error("Invalid visitor count");
    }
    document.querySelectorAll("[data-visitor-count]").forEach((element) => {
      element.textContent = count.toLocaleString();
      element.removeAttribute("data-i18n");
    });
  })
  .catch((error) => {
    console.error("Error fetching visitor count:", error);
    document.querySelectorAll("[data-visitor-count]").forEach((element) => {
      element.textContent = "N/A";
      element.dataset.i18n = "footer_unavailable";
    });
  });

// ── PWA Service Worker Registration ──
const pwaScriptSrc = (document.currentScript && document.currentScript.src) || "";
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    let swUrl = "";
    if (pwaScriptSrc) {
      swUrl = new URL("../../sw.js", pwaScriptSrc).href;
    } else {
      const depth = (window.location.pathname.match(/\//g) || []).length - 1;
      const prefix = depth > 0 ? "../".repeat(depth) : "";
      swUrl = prefix + "sw.js";
    }
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        console.log("[PWA] Service Worker registered with scope:", reg.scope);
      })
      .catch((err) => {
        console.warn("[PWA] Service Worker registration failed:", err);
      });
  });
}

// Capture install prompt for PWA
let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  window.deferredInstallPrompt = e;
  const pwaBtn = document.getElementById("pwa-install-btn");
  if (pwaBtn) {
    pwaBtn.style.display = "inline-flex";
    pwaBtn.addEventListener("click", () => {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(() => {
        deferredInstallPrompt = null;
      });
    });
  }
});
