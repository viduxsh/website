/**
 * i18n.js — Sistema di internazionalizzazione (EN default / IT)
 * Gestisce il caricamento del file JSON per ogni pagina,
 * la persistenza della preferenza in localStorage e
 * i pulsanti di switch lingua nell'header.
 */

(function () {
  const STORAGE_KEY = "lang";
  const DEFAULT_LANG = "en";
  const SUPPORTED = ["en", "it", "es"];

  // Traduzioni comuni (navbar, footer, bottoni generici)
  const COMMON_TRANSLATIONS = {
    en: {
      nav_home: "Home",
      nav_projects: "Projects",
      nav_social: "Social",
      nav_aboutme: "About Me",
      nav_switch: "Switch",
      footer_contact: "Contact",
      footer_about: "About Me",
      footer_visits: "Total visits:",
      footer_design: "Design by",
      footer_modified: "Last modified:",
      back_blog: "Back to Blog",
      back_coding: "Back to Coding",
      back_top: "Back to Top"
    },
    it: {
      nav_home: "Inizio",
      nav_projects: "Progetti",
      nav_social: "Social",
      nav_aboutme: "Chi sono",
      nav_switch: "Tema",
      footer_contact: "Contatti",
      footer_about: "Chi sono",
      footer_visits: "Visite totali:",
      footer_design: "Design di",
      footer_modified: "Ultima modifica:",
      back_blog: "Torna al Blog",
      back_coding: "Torna alle Guide",
      back_top: "Torna su"
    },
    es: {
      nav_home: "Inicio",
      nav_projects: "Proyectos",
      nav_social: "Social",
      nav_aboutme: "Sobre mí",
      nav_switch: "Tema",
      footer_contact: "Contacto",
      footer_about: "Sobre mí",
      footer_visits: "Visitas totales:",
      footer_design: "Diseño de",
      footer_modified: "Última modificación:",
      back_blog: "Volver al Blog",
      back_coding: "Volver a las Guías",
      back_top: "Volver arriba"
    }
  };

  let pageTranslations = {};

  function getCurrentLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(saved) ? saved : DEFAULT_LANG;
  }

  function getPageId() {
    if (document.body && document.body.dataset && document.body.dataset.page) {
      return document.body.dataset.page;
    }
    let p = window.location.pathname.replace(/\\/g, "/");
    p = p.replace(/^\/website\//, "/");
    p = p.replace(/^\//, "").replace(/\.html$/, "");
    if (!p) return "index";
    return p.replace(/\//g, "_");
  }

  function getJsonUrl(pageId) {
    const scriptEl = document.currentScript || document.querySelector('script[src*="i18n.js"]');
    if (scriptEl && scriptEl.src) {
      return new URL("../i18n/" + pageId + ".json", scriptEl.src).href;
    }
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    const prefix = depth > 0 ? "../".repeat(depth) : "";
    return `${prefix}assets/i18n/${pageId}.json`;
  }

  function applyTranslations(lang) {
    const commonDict = COMMON_TRANSLATIONS[lang] || COMMON_TRANSLATIONS[DEFAULT_LANG] || {};
    const pageDict = (pageTranslations && pageTranslations[lang]) || {};
    const dict = Object.assign({}, commonDict, pageDict);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key in dict) {
        const attr = el.getAttribute("data-i18n-attr");
        if (attr) {
          el.setAttribute(attr, dict[key]);
        } else {
          el.innerHTML = dict[key];
        }
      }
    });

    document.documentElement.setAttribute("lang", lang);
    updateButtons(lang);
  }

  function updateButtons(lang) {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  function setupLangButtons() {
    let container = document.querySelector(".lang-switcher");

    if (!container) {
      const switcher = document.querySelector(".theme-switcher");
      if (switcher && switcher.parentNode) {
        container = document.createElement("div");
        container.className = "lang-switcher";
        container.setAttribute("aria-label", "Language selector");

        const flags = { en: "🇬🇧", it: "🇮🇹", es: "🇪🇸" };
        const labels = { en: "English", it: "Italiano", es: "Español" };
        SUPPORTED.forEach((l) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "lang-btn";
          btn.dataset.lang = l;
          btn.setAttribute("aria-label", `Switch to ${labels[l] || l.toUpperCase()}`);
          btn.innerHTML = `<span class="flag-emoji">${flags[l] || ""}</span> <span>${l.toUpperCase()}</span>`;
          container.appendChild(btn);
        });

        switcher.parentNode.insertBefore(container, switcher);
      }
    }

    // Aggiungi click handler a tutti i bottoni lingua presenti
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = "true";
        btn.addEventListener("click", () => {
          setLang(btn.dataset.lang);
        });
      }
    });
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(lang);
  }

  function init() {
    const lang = getCurrentLang();
    setupLangButtons();
    // Applica subito le traduzioni comuni prima ancora del fetch
    applyTranslations(lang);

    const pageId = getPageId();
    const jsonUrl = getJsonUrl(pageId);

    fetch(jsonUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`i18n fetch failed: ${jsonUrl} (${r.status})`);
        return r.json();
      })
      .then((data) => {
        pageTranslations = data;
        applyTranslations(getCurrentLang());
      })
      .catch((err) => {
        console.warn("[i18n]", err.message);
      });
  }

  window.setLang = setLang;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
