/**
 * economy.js
 * ----------
 * Loads economy.json, validates it, renders the shared article
 * template plus a stats box.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await initSite("isEconomy");

  const container = document.getElementById("pageContent");

  try {
    const pageData = await fetchAndValidate("data/economy.json", validateArticlePageData);

    await renderTemplateIntoDOM("partials/article-template.html", pageData, "#pageContent");

    if (pageData.stats) {
      await renderTemplateIntoDOM("partials/stats-template.html", pageData.stats, "#sidebarStats");
    }
  } catch (error) {
    console.error("Failed to load economy page:", error);
    container.innerHTML = `<p class="render-error">Sorry, this page could not be loaded. Please check the console for details.</p>`;
  }
});
