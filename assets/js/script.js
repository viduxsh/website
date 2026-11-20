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
const currentTheme = localStorage.getItem("theme") || getAutoTheme();

document.body.setAttribute("data-theme", currentTheme);
if (currentTheme === "dark" && themeToggle) {
  themeToggle.checked = true;
}

if (themeToggle) {
  themeToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const birthYear = 2001;
const age = currentYear - birthYear;

const ageContainer = document.getElementById("my-age");
const copyrightContainer = document.getElementById("copyright-year");

if (ageContainer) {
  ageContainer.textContent = `I'm a programmer and I'm ${age} years old.`;
}

if (copyrightContainer) {
  copyrightContainer.textContent = `Copyright © ${currentYear} vidux.sh. All Rights Reserved.`;
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

const footerBottom = document.querySelector("footer .footer-bottom");
if (footerBottom && !footerBottom.querySelector("[data-visitor-count]")) {
  const visitorCount = document.createElement("p");
  visitorCount.appendChild(document.createTextNode("Total visits: "));

  const count = document.createElement("span");
  count.dataset.visitorCount = "";
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
    });
  })
  .catch((error) => {
    console.error("Error fetching visitor count:", error);
    document.querySelectorAll("[data-visitor-count]").forEach((element) => {
      element.textContent = "N/A";
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
