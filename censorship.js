/**
 * censorship.js
 * -------------
 * Loads censorship.json, validates it, renders the shared article
 * template plus a ban-history mini-list (this page has no numeric
 * stats box, unlike infrastructure.js and mobile.js).
 */
document.addEventListener("DOMContentLoaded", async () => {
  await initSite("isCensorship");

  const container = document.getElementById("pageContent");

  try {
    const pageData = await fetchAndValidate("data/censorship.json", validateArticlePageData);

    await renderTemplateIntoDOM("partials/article-template.html", pageData, "#pageContent");

    if (pageData.banTimeline) {
      await renderTemplateIntoDOM(
        "partials/minilist-template.html",
        { label: "Ban Timeline", items: pageData.banTimeline },
        "#sidebarMiniList"
      );
    }
  } catch (error) {
    console.error("Failed to load censorship page:", error);
    container.innerHTML = `<p class="render-error">Sorry, this page could not be loaded. Please check the console for details.</p>`;
  }
});
