/**
 * templateEngine.js
 * ------------------
 * Rendering layer built on Handlebars.js, per CM1040 Topic 6's
 * "Using Handlebars" lab exercise. Handlebars is loaded via CDN
 * script tag in each HTML page (see <head>), the same approach used
 * in the lab worksheet.
 *
 * This file wraps Handlebars.compile() in the same
 * renderTemplateIntoDOM() function signature used throughout the
 * site's page scripts (index.js, infrastructure.js, etc.), so no
 * other files needed to change when swapping the rendering approach.
 *
 * A from-scratch template engine (built without any library, per
 * Topic 6's other learning objective: "Implement a template engine
 * in Javascript without using libraries") was also built and tested
 * separately - see /custom-engine-reference/templateEngine.js.
 */

/**
 * Fetches a template file, compiles it with Handlebars, renders it
 * with the given data, and injects the result into a target DOM
 * element.
 * @param {string} templatePath - path to the .html template file
 * @param {object} data - data to render into the template
 * @param {string} targetSelector - CSS selector for the container element
 */
async function renderTemplateIntoDOM(templatePath, data, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) {
    console.error(`renderTemplateIntoDOM: no element found for selector "${targetSelector}"`);
    return;
  }

  try {
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${templatePath} (status ${response.status})`);
    }
    const templateSource = await response.text();
    const compiledTemplate = Handlebars.compile(templateSource);
    target.innerHTML = compiledTemplate(data);
  } catch (error) {
    console.error("renderTemplateIntoDOM error:", error);
    target.innerHTML = `<p class="render-error">Sorry, this content could not be loaded.</p>`;
  }
}
