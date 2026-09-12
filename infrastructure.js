/**
 * infrastructure.js
 * -----------------
 * Loads infrastructure.json, validates it, then renders the shared
 * article template plus a stats box and an outage-history mini-list
 * into the sidebar.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await initSite("isInfrastructure");

  const container = document.getElementById("pageContent");

  try {
    const pageData = await fetchAndValidate("data/infrastructure.json", validateArticlePageData);

    await renderTemplateIntoDOM("partials/article-template.html", pageData, "#pageContent");

    if (pageData.stats) {
      await renderTemplateIntoDOM("partials/stats-template.html", pageData.stats, "#sidebarStats");
    }

    if (pageData.outageTimeline) {
      await renderTemplateIntoDOM(
        "partials/outage-template.html",
        { items: pageData.outageTimeline },
        "#sidebarMiniList"
      );
    }
  } catch (error) {
    console.error("Failed to load infrastructure page:", error);
    container.innerHTML = `<p class="render-error">Sorry, this page could not be loaded. Please check the console for details.</p>`;
  }
});
