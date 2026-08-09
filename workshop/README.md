# Wilkinson Workshop Downloadable Product Beta

Static, isolated Workshop section for `stephenwilkinson.dev`.

## Current milestone

The Workshop now includes its first real downloadable product:

- **Workshop Test Plate v0.1.0**
- Free personal-use digital beta
- Deterministic browser-generated ZIP
- Watertight, consistently wound, single-component STL
- Editable OpenSCAD source
- 14,272 triangles
- 60 x 40 x 2.8 mm maximum bounds
- Physical resin print validation still pending

The noindex operations dashboard is `/workshop/preview/`.

## Public routes

- `/workshop/`
- `/workshop/original-files/`
- `/workshop/original-files/workshop-test-plate/`
- `/workshop/gear/`
- `/workshop/gear/elegoo-saturn-4-ultra/`
- `/workshop/gear/bambu-a1-mini-combo/`
- `/workshop/gear/resin-mixture/`
- `/workshop/gear/sprue-glue-toolkit/`
- `/workshop/creators/`
- `/workshop/vendors/`
- `/workshop/guides/`
- `/workshop/guides/resin-printing-miniatures/`
- `/workshop/guides/sprue-glue-gap-filling/`
- `/workshop/guides/miniature-photography/`
- `/workshop/physical-shop/`
- `/workshop/about/`
- `/workshop/disclosures/`

## Architecture

- `assets/catalog.js` contains the foundation catalog.
- `assets/catalog-beta.js` adds the published guides and expanded owned-gear data.
- `assets/catalog-commerce.js` adds media targets, link state, owned setup destinations, and storefront tasks.
- `assets/catalog-release.js` records downloadable product versions, expected byte counts, hashes, and validation state.
- `assets/workshop.js` renders shared navigation, cards, filters, and outbound tracking.
- `assets/workshop-commerce.js` activates future images and renders catalog, media, storefront, and link dashboards.
- `assets/workshop-product-generator.js` generates the Test Plate STL, editable OpenSCAD source, documentation, and versioned ZIP entirely in the visitor's browser.
- `assets/workshop-release.js` verifies the generated package and starts the download.
- `assets/workshop.css` imports only Workshop styles and does not change the existing portfolio stylesheet.

No payment form, account system, customer-data storage, server-side generation, or card collection is present.

## Product-generation workflow

The Test Plate is represented as a piecewise-constant parametric heightfield. The browser generator:

1. Creates the raised lines, recessed channels, clearance blocks, relief steps, and texture fields.
2. Builds one closed triangle mesh with bottom, top, perimeter walls, and internal height-transition walls.
3. Writes a binary STL with deterministic geometry and triangle ordering.
4. Creates editable OpenSCAD source plus the README, personal-use license, print log, validation report, and manifest.
5. Packages those files in a deterministic stored ZIP.
6. Verifies the finished byte count and SHA-256 against `catalog-release.js`.
7. Downloads the package locally without sending product data or customer information to a server.

Current deterministic release record:

```text
File: Workshop-Test-Plate-v0.1.0.zip
Bytes: 722573
SHA-256: 68e67e56503b4e22eea811351e6a9c7cc7acac6d5495631d43fb6b2dace3d02c
```

## Product release rules

- Bump the version for any geometry, license, package-content, or documentation change.
- Regenerate the package in Node before updating the release record.
- Validate the STL with an independent mesh checker.
- Confirm ZIP integrity and record the exact byte count and SHA-256.
- Keep digital geometry validation and physical print validation as separate states.
- Never mark a product production-ready until the actual print, wash, cure, and measurement steps are complete.

## Add or update catalog data

1. Keep the foundation data in `assets/catalog.js` stable.
2. Add ordinary catalog growth to `assets/catalog-beta.js`.
3. Add link, media, or storefront state to `assets/catalog-commerce.js`.
4. Add versioned product-release state to `assets/catalog-release.js`.
5. Keep `affiliate` false until an approved paid destination is active.
6. Set `personallyUsed`, `tested`, `geometryValidated`, and `physicalValidation` independently.
7. Record a real `lastVerified` or release date.
8. Use `internalUrl` when the best first destination is an owned Workshop page.
9. Leave `url` empty when the exact external product has not been verified.

## Media workflow

The required filenames and export rules are documented in `media/README.md` and rendered on the private launch dashboard.

Cards and detail-page media slots attempt to load the expected file. Missing photographs fail safely back to the branded placeholder, so media can be added incrementally without breaking the page.

## External commerce workflow

The private dashboard tracks:

- Payhip for future direct digital checkout and hosted delivery
- Cults3D for STL discovery
- Thangs for bundles and larger files
- eBay for pilot physical listings
- Amazon Associates for future generic-tool links

Do not invent a public storefront URL, seller state, or affiliate identifier. Add the exact URL only after the account is created or confirmed.

## Analytics events

External catalog links dispatch `workshop:outbound`.

Successful product downloads dispatch `workshop:download` with:

```js
{
  event: "workshop_download",
  productId: "workshop-test-plate-v0.1.0",
  sourcePage: "/workshop/original-files/workshop-test-plate/",
  version: "0.1.0",
  bytes: 722573
}
```

Existing `window.gtag` installations receive equivalent event fields.

## Local preview and validation

From the repository root:

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080/workshop/
http://localhost:8080/workshop/original-files/workshop-test-plate/
http://localhost:8080/workshop/preview/
```

The generator also supports Node for deterministic release validation:

```powershell
node -e "const p=require('./workshop/assets/workshop-product-generator.js').buildPackage(); console.log(p.bytes.length, p.stl.triangleCount)"
```

## Deployment

The site remains static GitHub Pages. Merging these files into the publishing branch deploys the Workshop without a package install or build command.

## Guardrails

- Keep Workshop styles and scripts inside `workshop/assets/`.
- Do not add payment forms or card collection to the static site.
- Use established external marketplaces when paid checkout begins.
- Label paid links visibly and use sponsored link attributes.
- Do not redistribute third-party STL files.
- Do not list physical third-party prints without documented commercial permission.
- Keep printer settings tied to a documented resin, machine, layer height, environment, and test result.
- Use original photography and preserve honest limitations in gear notes.
