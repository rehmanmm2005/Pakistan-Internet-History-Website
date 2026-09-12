/**
 * jsonValidator.js
 * ----------------
 * Validates JSON data against a simple schema BEFORE it's passed to the
 * template engine for rendering. This is a required part of Stage 3:
 * "Include JSON data validation code."
 *
 * The validator checks:
 *   - required fields are present
 *   - fields are the expected type (string, array, object, etc.)
 *   - arrays contain items with their own required sub-fields
 *
 * It does NOT use any external validation library (e.g. Ajv) - it's a
 * small, hand-written checker, consistent with the module's
 * "no libraries" approach used for the template engine itself.
 */

/**
 * Validates a single value against a simple type descriptor.
 * Supported types: "string", "array", "object", "number", "boolean".
 */
function checkType(value, expectedType) {
  if (expectedType === "array") return Array.isArray(value);
  if (expectedType === "object") return typeof value === "object" && value !== null && !Array.isArray(value);
  return typeof value === expectedType;
}

/**
 * Validates a data object against a schema.
 * @param {object} data - the parsed JSON data to validate
 * @param {object} schema - shape: { fieldName: { required: bool, type: string, itemSchema?: object } }
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateAgainstSchema(data, schema) {
  const errors = [];

  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: ["Top-level data is not a valid object."] };
  }

  for (const field in schema) {
    const rule = schema[field];
    const value = data[field];

    if (rule.required && (value === undefined || value === null)) {
      errors.push(`Missing required field: "${field}"`);
      continue;
    }

    if (value === undefined || value === null) continue; // optional and absent, skip

    if (!checkType(value, rule.type)) {
      errors.push(`Field "${field}" should be type "${rule.type}", got "${typeof value}"`);
      continue;
    }

    // If this field is an array of objects with their own required shape,
    // validate every item against the item schema.
    if (rule.type === "array" && rule.itemSchema) {
      value.forEach((item, index) => {
        const itemResult = validateAgainstSchema(item, rule.itemSchema);
        if (!itemResult.valid) {
          itemResult.errors.forEach((err) =>
            errors.push(`In "${field}[${index}]": ${err}`)
          );
        }
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Schema definitions for each page's JSON data file.
 * These describe the minimum shape each file must have for the
 * template engine to render it safely.
 */
const SCHEMAS = {
  timelineEntry: {
    id: { required: true, type: "string" },
    year: { required: true, type: "string" },
    era: { required: true, type: "string" },
    title: { required: true, type: "string" },
    summary: { required: true, type: "string" },
    page: { required: false, type: "string" },
  },

  articlePage: {
    pageTitle: { required: true, type: "string" },
    intro: { required: true, type: "string" },
    heroImageSrc: { required: true, type: "string" },
    heroImageAlt: { required: true, type: "string" },
    facts: {
      required: true,
      type: "array",
      itemSchema: {
        id: { required: true, type: "string" },
        heading: { required: true, type: "string" },
        detail: { required: true, type: "string" },
        source: { required: false, type: "string" },
      },
    },
    stats: { required: false, type: "object" },
  },

  referencesPage: {
    pageTitle: { required: true, type: "string" },
    intro: { required: true, type: "string" },
    groups: {
      required: true,
      type: "array",
      itemSchema: {
        groupName: { required: true, type: "string" },
        sources: {
          required: true,
          type: "array",
          itemSchema: {
            name: { required: true, type: "string" },
            detail: { required: true, type: "string" },
          },
        },
      },
    },
  },
};

/**
 * Validates the timeline.json file specifically (an array of entries,
 * not a single object, so it's handled separately).
 */
function validateTimelineData(timelineArray) {
  if (!Array.isArray(timelineArray)) {
    return { valid: false, errors: ["timeline.json must be a top-level array."] };
  }

  const errors = [];
  timelineArray.forEach((entry, index) => {
    const result = validateAgainstSchema(entry, SCHEMAS.timelineEntry);
    if (!result.valid) {
      result.errors.forEach((err) => errors.push(`timeline[${index}]: ${err}`));
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validates any of the 4 "article-style" page JSON files
 * (infrastructure.json, mobile.json, censorship.json, economy.json).
 */
function validateArticlePageData(pageData) {
  return validateAgainstSchema(pageData, SCHEMAS.articlePage);
}

/**
 * Validates references.json, which has a different (doubly-nested)
 * shape: an array of groups, each containing an array of sources.
 */
function validateReferencesPageData(pageData) {
  return validateAgainstSchema(pageData, SCHEMAS.referencesPage);
}

/**
 * Fetches a JSON file, validates it, and returns the parsed data if
 * valid. Throws a descriptive error and logs details to the console
 * if validation fails, so a malformed data file fails loudly during
 * development rather than silently breaking the page.
 */
async function fetchAndValidate(jsonPath, validatorFn) {
  const response = await fetch(jsonPath);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${jsonPath} (status ${response.status})`);
  }

  const data = await response.json();
  const result = validatorFn(data);

  if (!result.valid) {
    console.error(`JSON validation failed for ${jsonPath}:`, result.errors);
    throw new Error(
      `Invalid data in ${jsonPath}. See console for details (${result.errors.length} issue(s)).`
    );
  }

  return data;
}
