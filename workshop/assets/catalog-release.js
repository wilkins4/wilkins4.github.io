(function () {
  "use strict";

  const catalog = window.WORKSHOP_CATALOG;
  if (!catalog) return;

  function applyRelease() {
    const entry = (catalog.originalFiles || []).find((candidate) => candidate.id === "workshop-test-plate");
    if (entry) {
      Object.assign(entry, {
        summary: "A free digital beta for comparing raised and recessed detail, peg and hole clearance, shallow relief, and repeated texture fields before committing to a larger resin print.",
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
        imageAlt: "Digital render of the Wilkinson Workshop Test Plate showing raised lines, recessed grooves, pegs, holes, relief steps, and texture fields.",
        releaseVersion: "0.1.0",
        releaseDate: "2026-08-09",
        downloadUrl: "downloads/workshop-test-plate-v0.1.0/manifest.json",
        packageManifestUrl: "downloads/workshop-test-plate-v0.1.0/manifest.json",
        downloadMode: "base64-chunks",
        downloadBytes: 249479,
        downloadSha256: "e077b7e78785a627a2169d86da840d6739bba57ffd7d047d9c04ca207d366622",
        geometryValidated: true,
        physicalValidation: false,
        tags: Array.from(new Set([...(entry.tags || []), "download", "digital beta", "watertight", "cadquery"]))
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
        downloadUrl: "downloads/workshop-test-plate-v0.1.0/manifest.json",
        packageManifestUrl: "downloads/workshop-test-plate-v0.1.0/manifest.json",
        downloadMode: "base64-chunks",
        downloadBytes: 249479,
        sha256: "e077b7e78785a627a2169d86da840d6739bba57ffd7d047d9c04ca207d366622",
        included: ["STL", "CadQuery source", "print log", "license", "validation report", "preview images"]
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
