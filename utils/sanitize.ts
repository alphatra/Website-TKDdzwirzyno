// @deno-types="npm:@types/sanitize-html"
import sanitizeHtml from "sanitize-html";
import { IOptions } from "sanitize-html";

// Base configuration for standard CMS content (rich text)
const cmsConfig: IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "iframe",
    "u",
    "s",
    "span",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "img": ["src", "alt", "class", "width", "height"],
    "iframe": ["src", "width", "height", "allowfullscreen", "frameborder"],
    "a": ["href", "name", "target", "rel", "class"],
    "div": ["class", "style"],
    "span": ["class", "style"],
    "*": ["id"],
  },
  transformTags: {
    "a": sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    "iframe": sanitizeHtml.simpleTransform("iframe", { loading: "lazy" }),
  },
};

// Start strict for news excerpts/summaries
const minimalConfig: IOptions = {
  allowedTags: ["b", "i", "em", "strong", "a"],
  allowedAttributes: {
    "a": ["href", "target", "rel"],
  },
  transformTags: {
    "a": sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

// Specific for gallery descriptions (often just text + maybe bold/links)
const albumnDescriptionConfig: IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "img": ["src", "alt", "class"],
  },
  transformTags: {
    "a": sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

export function sanitize(
  html: string,
  type: "cms" | "minimal" | "album" = "cms",
): string {
  if (!html) return "";

  let config = cmsConfig;
  if (type === "minimal") config = minimalConfig;
  if (type === "album") config = albumnDescriptionConfig;

  return sanitizeHtml(html, config);
}
