/**
 * site.js
 * -------
 * Shared setup that runs on every page: renders the nav (with the
 * current page highlighted) and footer using the template engine,
 * and wires up the mobile nav toggle button.
 *
 * Each page calls initSite("isHome") / initSite("isInfrastructure")
 * etc. so the nav template's {{#if}} blocks know which link to
 * mark active.
 */
async function initSite(activePageFlag) {
  const navData = {
    isHome: false,
    isInfrastructure: false,
    isMobile: false,
    isCensorship: false,
    isEconomy: false,
  };
  navData[activePageFlag] = true;

  await renderTemplateIntoDOM("partials/nav-template.html", navData, "#siteNav");
  await renderTemplateIntoDOM("partials/footer-template.html", {}, "#siteFooter");

  // Mobile nav toggle (added after nav is rendered into the DOM)
  const toggleBtn = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }
}
