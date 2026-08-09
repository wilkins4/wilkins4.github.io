(function () {
  "use strict";

  const catalog = window.WORKSHOP_CATALOG;
  if (!catalog) return;

  function applyRelease() {
    const entry = (catalog.originalFiles || []).find((candidate) => candidate.id === "workshop-test-plate");
    if (entry) {
      Object.assign(entry, {
        summary: "A free digital beta for comparing raised and recessed detail, square post and recess clearance, relief height, and repeated texture fields before committing to a larger resin print.",
        tested: false,
        status: "Digital beta available",
        statusTone: "ready",
        priceLabel: "Free beta download",
        cta: "View and download beta",
        marketplace: "Direct Workshop download",
        internalUrl: "original-files/workshop-test-plate/",
        linkStatus: "internal-download",
        photoStatus: "ready",
        image: "media/products/workshop-test-plate-v0.1.0-product.svg",
        imageAlt: "Digital render of the Wilkinson Workshop Test Plate showing raised lines, recessed grooves, square posts, recesses, relief steps, and texture fields.",
        releaseVersion: "0.1.0",
        releaseDate: "2026-08-09",
        downloadMode: "generated-browser-package",
        downloadBytes: 718020,
        downloadSha256: "f824074d32579b8bc62fffedee33b473045e4fb8cb8d8e14fe84bd7c16bd5e4b",
        geometryValidated: true,
        physicalValidation: false,
        tags: Array.from(new Set([...(entry.tags || []), "download", "digital beta", "watertight", "parametric"]))
      });
    }

    catalog.meta.version = "0.4.0";
    catalog.meta.updated = "2026-08-09";
    catalog.meta.status = "first downloadable product beta";
    catalog.meta.productReleases = [
      {
        id: "workshop-test-plate-v0.1.0",
        name: "Workshop Test Plate",
        version: "0.1.0",
        status: "digital-beta",
        physicalValidation: false,
        downloadMode: "generated-browser-package",
        downloadBytes: 718020,
        sha256: "f824074d32579b8bc62fffedee33b473045e4fb8cb8d8e14fe84bd7c16bd5e4b",
        triangleCount: 14272,
        included: ["STL", "parametric JavaScript source", "print log", "license", "validation report"]
      }
    ];

    window.WORKSHOP_RELEASE_PATCH_APPLIED = true;
  }

  applyRelease();
  window.addEventListener("workshop:commerce-patch", applyRelease);
  window.dispatchEvent(new CustomEvent("workshop:release-patch", {
    detail: { version: "0.4.0", product: "workshop-test-plate-v0.1.0" }
  }));
}());
