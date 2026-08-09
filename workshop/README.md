# Wilkinson Workshop Public Beta

Static, isolated Workshop section for `stephenwilkinson.dev`.

## Public routes

- `/workshop/`
- `/workshop/original-files/`
- `/workshop/original-files/workshop-test-plate/`
- `/workshop/gear/`
- `/workshop/creators/`
- `/workshop/vendors/`
- `/workshop/guides/`
- `/workshop/guides/resin-printing-miniatures/`
- `/workshop/guides/sprue-glue-gap-filling/`
- `/workshop/guides/miniature-photography/`
- `/workshop/physical-shop/`
- `/workshop/about/`
- `/workshop/disclosures/`

The noindex reviewer route is `/workshop/preview/`.

## Architecture

- `assets/catalog.js` contains structured catalog data.
- `assets/workshop.js` renders shared navigation, footer, cards, filters, selected-entry grids, and outbound tracking hooks.
- `assets/workshop.css` is loaded only by Workshop pages and does not change the existing portfolio stylesheet.
- Catalog pages supply a semantic HTML shell and identify their collection with data attributes.
- Guide pages reuse the same catalog cards and select related items with `data-entry-ids`.
- Payment processing, user accounts, and digital delivery remain outside this repository.

## Add a catalog entry

1. Open `assets/catalog.js`.
2. Add an object to the correct collection.
3. Keep `affiliate` false until the destination is an approved paid link.
4. Set `personallyUsed` and `tested` independently.
5. Add a real `lastVerified` date.
6. Leave `url` empty when a store link is not ready. The card will display a disabled call to action.
7. Use `internalUrl` when the best destination is a Workshop guide or product page.

## Render selected entries

A guide can render only the gear it references while preserving catalog order:

```html
<div
  class="ws-card-grid"
  data-catalog-grid
  data-collection="gear"
  data-entry-ids="plastic-cement,precision-dispensing-needles,sanding-sticks">
</div>
```

## Add a guide

1. Copy an existing guide directory under `workshop/guides/`.
2. Update the canonical URL, title, description, breadcrumbs, article metadata, and table of contents.
3. Add or update the corresponding object in `assets/catalog.js`.
4. Set the catalog `internalUrl` to the new guide route.
5. Select related catalog items with `data-entry-ids`.
6. Add the guide URL to `sitemap.xml`.
7. Verify mobile layout, internal links, and one H1 per page.

## Outbound event

External catalog links dispatch a browser event named `workshop:outbound` with:

```js
{
  event: "workshop_outbound_click",
  entryId: "elegoo-saturn-4-ultra",
  entryType: "gear",
  destination: "Elegoo",
  sourcePage: "/workshop/gear/"
}
```

When `window.gtag` already exists, the same fields are sent as a Google Analytics event.

## Local preview

From the repository root:

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080/workshop/
http://localhost:8080/workshop/preview/
```

## Deployment

The current site is static GitHub Pages. Merging these files into the publishing branch deploys the Workshop without a package install or build command.

## Guardrails

- Keep Workshop styles inside `workshop/assets/`.
- Do not add payment forms or card collection to the static site.
- Use external marketplaces for checkout and digital delivery.
- Label affiliate links visibly and set `affiliate: true` only after approval.
- Do not redistribute third-party STL files.
- Do not list physical third-party prints without documented commercial permission.
- Keep exact printer settings tied to a documented resin, machine, layer height, and test result.
