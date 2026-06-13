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
