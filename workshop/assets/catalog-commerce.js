(function () {
  "use strict";

  const catalog = window.WORKSHOP_CATALOG;
  if (!catalog || window.WORKSHOP_COMMERCE_PATCH_APPLIED) return;

  const patch = {
    meta: {
      version: "0.3.0",
      status: "commerce-ready content pass"
    },
    collections: {
      originalFiles: {
        "workshop-test-plate": { photoStatus: "not-planned", linkStatus: "internal" },
        "crusader-heraldry-stamps": { photoStatus: "not-planned", linkStatus: "pending" },
        "greenskin-glyph-stamps": { photoStatus: "not-planned", linkStatus: "pending" },
        "battlefield-texture-stamps": { photoStatus: "not-planned", linkStatus: "pending" }
      },
      gear: {
        "elegoo-saturn-4-ultra": {
          cta: "Read owned setup notes",
          marketplace: "Workshop gear note",
          internalUrl: "gear/elegoo-saturn-4-ultra/",
          linkStatus: "detail-and-official",
          photoStatus: "needed",
          photoKey: "saturn-4-ultra-primary",
          image: "media/gear/saturn-4-ultra-primary.webp",
          imageAlt: "Elegoo Saturn 4 Ultra in the Wilkinson Workshop resin printing area.",
          bestFor: "Current resin production, miniature tests, and repeatable profile documentation.",
          watchFor: "Settings should stay tied to the exact resin blend, room conditions, and layer height."
        },
        "elegoo-saturn-8k": {
          linkStatus: "official",
          photoStatus: "needed",
          photoKey: "saturn-8k-secondary",
          image: "media/gear/saturn-8k-secondary.webp",
          imageAlt: "Elegoo Saturn 8K in the Wilkinson Workshop as the secondary resin printer.",
          bestFor: "Comparison work, overflow capacity, and older known profiles."
        },
        "elegoo-abs-like-resin": {
          cta: "See the Workshop resin mix",
          marketplace: "Workshop mixture note",
          internalUrl: "gear/resin-mixture/",
          linkStatus: "detail-and-official",
          photoStatus: "needed",
          photoKey: "resin-mixture-components",
          image: "media/gear/resin-mixture-components.webp",
          imageAlt: "Elegoo ABS-Like resin and Siraya Tech Tenacious used in the Workshop resin mixture.",
          bestFor: "The rigid base of the current miniature resin blend."
        },
        "siraya-tech-tenacious": {
          cta: "See the Workshop resin mix",
          marketplace: "Workshop mixture note",
          internalUrl: "gear/resin-mixture/",
          linkStatus: "detail-and-official",
          photoStatus: "needed",
          photoKey: "resin-mixture-components",
          image: "media/gear/resin-mixture-components.webp",
          imageAlt: "Elegoo ABS-Like resin and Siraya Tech Tenacious used in the Workshop resin mixture.",
          bestFor: "Adding controlled flex to thin weapons, spikes, and gaming pieces."
        },
        "bambu-a1-mini-combo": {
          cta: "Read owned setup notes",
          marketplace: "Workshop gear note",
          internalUrl: "gear/bambu-a1-mini-combo/",
          linkStatus: "detail-and-official",
          photoStatus: "needed",
          photoKey: "bambu-a1-mini-primary",
          image: "media/gear/bambu-a1-mini-primary.webp",
          imageAlt: "Bambu Lab A1 Mini Combo and AMS Lite in the Wilkinson Workshop.",
          bestFor: "Compact utility prints, organizers, terrain parts, and fast prototypes.",
          watchFor: "The small build area should be treated as a design constraint, not hidden in the recommendation."
        },
        "ams-lite": {
          cta: "Read A1 Mini setup notes",
          marketplace: "Workshop gear note",
          internalUrl: "gear/bambu-a1-mini-combo/",
          linkStatus: "detail-and-official",
          photoStatus: "needed",
          photoKey: "bambu-a1-mini-primary",
          image: "media/gear/bambu-a1-mini-primary.webp",
          imageAlt: "Bambu Lab A1 Mini Combo and AMS Lite in the Wilkinson Workshop."
        },
        "precision-dispensing-needles": {
          cta: "See the precision toolkit",
          marketplace: "Workshop tool note",
          internalUrl: "gear/sprue-glue-toolkit/",
          linkStatus: "internal-pending-product-link",
          photoStatus: "needed",
          photoKey: "sprue-glue-toolkit-overhead",
          image: "media/gear/sprue-glue-toolkit-overhead.webp",
          imageAlt: "Sprue glue jar, precision needles, bamboo swabs, syringe, and finishing tools arranged on the workbench."
        },
        "bamboo-detail-swabs": {
          cta: "See the precision toolkit",
          marketplace: "Workshop tool note",
          internalUrl: "gear/sprue-glue-toolkit/",
          linkStatus: "internal-pending-product-link",
          photoStatus: "needed",
          photoKey: "sprue-glue-toolkit-overhead",
          image: "media/gear/sprue-glue-toolkit-overhead.webp",
          imageAlt: "Sprue glue jar, precision needles, bamboo swabs, syringe, and finishing tools arranged on the workbench."
        },
        "digital-calipers": { photoStatus: "not-planned", linkStatus: "pending" },
        "pin-vise-set": { photoStatus: "not-planned", linkStatus: "pending" },
        "nitrile-gloves": { photoStatus: "not-planned", linkStatus: "pending" },
        "silicone-work-mat": { photoStatus: "not-planned", linkStatus: "pending" },
        "ender-3-pro": { photoStatus: "not-planned", linkStatus: "pending" },
        "lychee-slicer": { photoStatus: "not-planned", linkStatus: "internal" },
        "bambu-studio": { photoStatus: "not-planned", linkStatus: "pending" },
        "plastic-cement": {
          internalUrl: "gear/sprue-glue-toolkit/",
          cta: "See the precision toolkit",
          marketplace: "Workshop tool note",
          linkStatus: "internal-pending-product-link",
          photoStatus: "needed",
          photoKey: "sprue-glue-toolkit-overhead",
          image: "media/gear/sprue-glue-toolkit-overhead.webp",
          imageAlt: "Sprue glue jar, precision needles, bamboo swabs, syringe, and finishing tools arranged on the workbench."
        },
        "sprue-glue-jar": {
          internalUrl: "gear/sprue-glue-toolkit/",
          cta: "See the precision toolkit",
          marketplace: "Workshop tool note",
          linkStatus: "internal",
          photoStatus: "needed",
          photoKey: "sprue-glue-toolkit-overhead",
          image: "media/gear/sprue-glue-toolkit-overhead.webp",
          imageAlt: "Sprue glue jar, precision needles, bamboo swabs, syringe, and finishing tools arranged on the workbench."
        },
        "disposable-syringes": {
          internalUrl: "gear/sprue-glue-toolkit/",
          cta: "See the precision toolkit",
          marketplace: "Workshop tool note",
          linkStatus: "internal-pending-product-link",
          photoStatus: "needed",
          photoKey: "sprue-glue-toolkit-overhead",
          image: "media/gear/sprue-glue-toolkit-overhead.webp",
          imageAlt: "Sprue glue jar, precision needles, bamboo swabs, syringe, and finishing tools arranged on the workbench."
        },
        "super-glue-accelerator": { photoStatus: "not-planned", linkStatus: "pending" },
        "sanding-sticks": {
          internalUrl: "gear/sprue-glue-toolkit/",
          cta: "See the precision toolkit",
          marketplace: "Workshop tool note",
          linkStatus: "internal-pending-product-link",
          photoStatus: "needed",
          photoKey: "sprue-glue-toolkit-overhead",
          image: "media/gear/sprue-glue-toolkit-overhead.webp",
          imageAlt: "Sprue glue jar, precision needles, bamboo swabs, syringe, and finishing tools arranged on the workbench."
        }
      }
    },
    mediaPlan: [
      {
        id: "workbench-overview",
        target: "Homepage workbench overview",
        filename: "media/home/workbench-overview.webp",
        aspect: "16:9",
        minimumWidth: 1600,
        priority: "P1",
        status: "needed",
        shot: "Wide, clean view of the real hobby workbench with printers or current projects visible. Remove personal paperwork and unrelated clutter.",
        alt: "Wilkinson Workshop hobby bench with miniature projects and 3D printing equipment."
      },
      {
        id: "saturn-4-ultra-primary",
        target: "Saturn 4 Ultra owned setup page",
        filename: "media/gear/saturn-4-ultra-primary.webp",
        aspect: "4:3",
        minimumWidth: 1400,
        priority: "P1",
        status: "needed",
        shot: "Three-quarter view of the actual Saturn 4 Ultra in its working location, clean but not staged like a retailer image.",
        alt: "Elegoo Saturn 4 Ultra in the Wilkinson Workshop resin printing area."
      },
      {
        id: "saturn-8k-secondary",
        target: "Saturn 8K catalog card",
        filename: "media/gear/saturn-8k-secondary.webp",
        aspect: "4:3",
        minimumWidth: 1200,
        priority: "P2",
        status: "needed",
        shot: "Straight or three-quarter view showing the older printer as part of the current two-printer resin workflow.",
        alt: "Elegoo Saturn 8K used as the secondary resin printer in the Wilkinson Workshop."
      },
      {
        id: "bambu-a1-mini-primary",
        target: "Bambu A1 Mini owned setup page",
        filename: "media/gear/bambu-a1-mini-primary.webp",
        aspect: "4:3",
        minimumWidth: 1400,
        priority: "P1",
        status: "needed",
        shot: "A1 Mini and AMS Lite together, with one useful Workshop print nearby for scale and context.",
        alt: "Bambu Lab A1 Mini Combo and AMS Lite in the Wilkinson Workshop."
      },
      {
        id: "resin-mixture-components",
        target: "Workshop resin mixture page",
        filename: "media/gear/resin-mixture-components.webp",
        aspect: "4:3",
        minimumWidth: 1400,
        priority: "P1",
        status: "needed",
        shot: "Both resin bottles, labeled measuring container, gloves, and clean work surface. Do not stage uncured resin unsafely.",
        alt: "Elegoo ABS-Like resin and Siraya Tech Tenacious used in the Workshop resin mixture."
      },
      {
        id: "sprue-glue-toolkit-overhead",
        target: "Sprue glue precision toolkit page",
        filename: "media/gear/sprue-glue-toolkit-overhead.webp",
        aspect: "4:3",
        minimumWidth: 1400,
        priority: "P1",
        status: "needed",
        shot: "Overhead layout of the sprue glue jar, blunt needle, bamboo swabs, syringe, sanding sticks, and a sample seam.",
        alt: "Sprue glue jar, precision needles, bamboo swabs, syringe, and finishing tools arranged on the workbench."
      },
      {
        id: "miniature-photo-station",
        target: "Miniature photography guide",
        filename: "media/guides/miniature-photo-station.webp",
        aspect: "16:9",
        minimumWidth: 1600,
        priority: "P2",
        status: "needed",
        shot: "Pull-back view showing the two lights, diffusion, background, camera position, and miniature placement.",
        alt: "Simple miniature photography station with two lights, diffusion, background, and camera position."
      }
    ],
    storefrontPlan: [
      {
        id: "payhip",
        name: "Payhip",
        role: "Primary direct digital checkout and file delivery.",
        status: "confirmation-needed",
        nextAction: "Create or confirm the account, reserve the Wilkinson Workshop store name, and record the public store URL."
      },
      {
        id: "cults3d",
        name: "Cults3D",
        role: "Marketplace discovery for original STL files.",
        status: "confirmation-needed",
        nextAction: "Create or confirm the creator profile and save the profile URL in the catalog."
      },
      {
        id: "thangs",
        name: "Thangs",
        role: "Bundle and larger-file marketplace channel.",
        status: "confirmation-needed",
        nextAction: "Create or confirm the designer profile before publishing a bundle."
      },
      {
        id: "ebay",
        name: "eBay",
        role: "Pilot physical listings for printed Workshop products.",
        status: "confirmation-needed",
        nextAction: "Confirm the selling account and shipping profile before the first physical listing."
      },
      {
        id: "amazon-associates",
        name: "Amazon Associates",
        role: "Future paid links for generic tools and consumables.",
        status: "not-active",
        nextAction: "Do not activate links until the site has sufficient original content and the account is approved."
      }
    ]
  };

  Object.assign(catalog.meta, patch.meta);
  Object.entries(patch.collections).forEach(([collectionName, updates]) => {
    const collection = catalog[collectionName] || [];
    Object.entries(updates).forEach(([id, changes]) => {
      const entry = collection.find((candidate) => candidate.id === id);
      if (entry) Object.assign(entry, changes);
    });
  });

  catalog.meta.mediaPlan = patch.mediaPlan;
  catalog.meta.storefrontPlan = patch.storefrontPlan;

  ["originalFiles", "gear", "creators", "vendors", "guides", "physicalProducts"].forEach((collectionName) => {
    (catalog[collectionName] || []).forEach((entry) => {
      entry.tags = Array.from(new Set([
        ...(entry.tags || []),
        entry.bestFor || "",
        entry.watchFor || ""
      ].filter(Boolean)));
    });
  });

  window.WORKSHOP_COMMERCE_PATCH_APPLIED = true;
  window.dispatchEvent(new CustomEvent("workshop:commerce-patch", {
    detail: { version: catalog.meta.version }
  }));
}());
