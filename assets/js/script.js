(function() {
    if (document.querySelector('script[data-goatcounter]')) return;
    
    var script = document.createElement('script');
    script.async = true;
    script.src = '//gc.zgo.at/count.js';
    script.setAttribute('data-goatcounter', 'https://viduxsh.goatcounter.com/count');
    
    document.head.appendChild(script);
})();

const themeToggle = document.querySelector("#switcher");
const currentTheme = localStorage.getItem("theme") || "light";

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
