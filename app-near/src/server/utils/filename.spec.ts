import { sanitizeForFilename } from "./filename";

describe("sanitizeForFilename", () => {
  it("should keep alphanumeric characters unchanged", () => {
    expect(sanitizeForFilename("Quartier42")).toBe("quartier42");
  });

  it("should replace spaces with dashes", () => {
    expect(sanitizeForFilename("Quartier Nord")).toBe("quartier-nord");
  });

  it("should collapse repeated whitespace into a single dash", () => {
    expect(sanitizeForFilename("  Quartier   Nord  ")).toBe("quartier-nord");
  });

  it("should strip accents down to their base letters", () => {
    expect(sanitizeForFilename("Éàçôquartier")).toBe("eacoquartier");
  });

  it("should remove characters unsafe for a filename or HTTP header", () => {
    expect(sanitizeForFilename('Quartier "Nord" / Sud\\Est')).toBe(
      "quartier-nord-sudest",
    );
  });

  it("should strip characters that could inject HTTP headers", () => {
    expect(sanitizeForFilename('Nord\r\nContent-Disposition: evil"; x="')).toBe(
      "nordcontent-disposition-evil-x",
    );
  });
});
