/**
 * references.js
 * -------------
 * Loads references.json, validates it (using the doubly-nested
 * groups/sources schema), and renders it with the template engine -
 * this page specifically demonstrates a nested {{#each}} inside
 * another {{#each}}.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await initSite(""); // no nav item corresponds to this page, so nothing highlighted

  const container = document.getElementById("pageContent");

  try {
    const pageData = await fetchAndValidate("data/references.json", validateReferencesPageData);
    await renderTemplateIntoDOM("partials/references-template.html", pageData, "#pageContent");
  } catch (error) {
    console.error("Failed to load references page:", error);
    container.innerHTML = `<p class="render-error">Sorry, this page could not be loaded. Please check the console for details.</p>`;
  }
});
