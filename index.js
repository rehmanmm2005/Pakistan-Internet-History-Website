/**
 * index.js
 * --------
 * Page-specific script for index.html (Home / Timeline page).
 * Loads timeline.json, validates it, then renders it into the
 * page using the custom template engine.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await initSite("isHome");

  const container = document.getElementById("timelineContainer");

  try {
    const timelineData = await fetchAndValidate("data/timeline.json", validateTimelineData);
    // The timeline template expects a top-level "entries" key, so wrap
    // the raw array to match what timeline-template.html loops over.
    await renderTemplateIntoDOM(
      "partials/timeline-template.html",
      { entries: timelineData },
      "#timelineContainer"
    );
  } catch (error) {
    console.error("Failed to load timeline:", error);
    container.innerHTML = `<p class="render-error">Sorry, the timeline could not be loaded. Please check the console for details.</p>`;
  }
});
