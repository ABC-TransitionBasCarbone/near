import { type IconValidationResult } from "~/types/Dataviz";

const VALIDATION_CONFIG = {
  maxLength: 10000,
  allowedTags: [
    "svg",
    "g",
    "path",
    "circle",
    "rect",
    "ellipse",
    "line",
    "polyline",
    "polygon",
    "text",
    "tspan",
    "defs",
    "use",
    "clipPath",
    "mask",
    "pattern",
    "linearGradient",
    "radialGradient",
    "stop",
    "marker",
    "symbol",
    "title",
    "desc",
    "metadata",
  ],
  forbiddenTags: [
    "script",
    "iframe",
    "object",
    "embed",
    "link",
    "style",
    "base",
    "meta",
    "form",
    "input",
    "button",
    "textarea",
    "select",
    "option",
    "video",
    "audio",
  ],
  forbiddenAttributes: [
    "onload",
    "onclick",
    "onmouseover",
    "onmouseout",
    "onchange",
    "onsubmit",
    "onfocus",
    "onblur",
    "onerror",
    "onkeydown",
    "onkeyup",
    "onkeypress",
  ],
  forbiddenProtocols: [
    "javascript:",
    "data:",
    "vbscript:",
    "file:",
    "about:",
    "chrome:",
    "chrome-extension:",
    "moz-extension:",
  ],
};

export function validateAndSanitizeIcon(
  iconHtml: string,
): IconValidationResult {
  const result: IconValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!iconHtml || typeof iconHtml !== "string") {
    result.isValid = false;
    result.errors.push("Icône manquante ou invalide");
    return result;
  }

  if (iconHtml.length > VALIDATION_CONFIG.maxLength) {
    result.isValid = false;
    result.errors.push(
      `Icône trop volumineuse (${iconHtml.length} > ${VALIDATION_CONFIG.maxLength} caractères)`,
    );
    return result;
  }

  let cleanIcon = iconHtml.trim();

  if (!cleanIcon.toLowerCase().startsWith("<svg")) {
    result.isValid = false;
    result.errors.push("L'icône doit être un SVG valide commençant par <svg>");
    return result;
  }

  if (!cleanIcon.toLowerCase().includes("</svg>")) {
    result.isValid = false;
    result.errors.push("L'icône SVG doit être correctement fermée avec </svg>");
    return result;
  }

  for (const forbiddenTag of VALIDATION_CONFIG.forbiddenTags) {
    const tagRegex = new RegExp(`<${forbiddenTag}[^>]*>`, "gi");
    if (tagRegex.test(cleanIcon)) {
      result.isValid = false;
      result.errors.push(`Balise interdite détectée: ${forbiddenTag}`);
    }
  }

  for (const forbiddenAttr of VALIDATION_CONFIG.forbiddenAttributes) {
    const attrRegex = new RegExp(`${forbiddenAttr}\\s*=`, "gi");
    if (attrRegex.test(cleanIcon)) {
      result.isValid = false;
      result.errors.push(`Attribut d'événement interdit: ${forbiddenAttr}`);
    }
  }

  for (const protocol of VALIDATION_CONFIG.forbiddenProtocols) {
    if (cleanIcon.toLowerCase().includes(protocol)) {
      result.isValid = false;
      result.errors.push(`Protocole interdit détecté: ${protocol}`);
    }
  }

  const urlRegex = /(?:href|src|xlink:href|action)\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = urlRegex.exec(cleanIcon)) !== null) {
    const url = match[1]?.toLowerCase();
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      result.warnings.push(`URL externe détectée: ${match[1]}`);
    }
  }

  cleanIcon = cleanIcon.replace(/<!--[\s\S]*?-->/g, "");

  cleanIcon = cleanIcon.replace(/\s+/g, " ").trim();

  try {
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanIcon, "image/svg+xml");
      const parseErrors = doc.getElementsByTagName("parsererror");
      if (parseErrors.length > 0) {
        result.isValid = false;
        result.errors.push("SVG malformé: erreur de parsing XML");
      }
    }
  } catch {
    result.warnings.push("Impossible de valider le XML côté serveur");
  }

  if (result.isValid && result.errors.length === 0) {
    result.sanitizedIcon = cleanIcon;
  } else {
    result.isValid = false;
  }

  return result;
}

export function getFallbackIcon(suNumber?: number): string {
  const iconContent = suNumber
    ? `<text x="12" y="16" text-anchor="middle" fill="currentColor" font-family="Arial" font-size="10">${suNumber}</text>`
    : '<circle cx="12" cy="12" r="8" fill="currentColor"/>';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">${iconContent}</svg>`;
}
