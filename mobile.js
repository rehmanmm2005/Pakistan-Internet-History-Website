/**
 * mobile.js
 * ---------
 * Loads mobile.json, validates it, renders the shared article
 * template plus a stats box (this page has no mini-list/timeline
 * in its sidebar, unlike infrastructure.js and censorship.js).
 */
document.addEventListener("DOMContentLoaded", async () => {
  await initSite("isMobile");

  const container = document.getElementById("pageContent");

  try {
    const pageData = await fetchAndValidate("data/mobile.json", validateArticlePageData);

    await renderTemplateIntoDOM("partials/article-template.html", pageData, "#pageContent");

    if (pageData.stats) {
      await renderTemplateIntoDOM("partials/stats-template.html", pageData.stats, "#sidebarStats");
    }
  } catch (error) {
    console.error("Failed to load mobile page:", error);
    container.innerHTML = `<p class="render-error">Sorry, this page could not be loaded. Please check the console for details.</p>`;
  }
});
