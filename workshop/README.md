# Wilkinson Workshop Commerce-Ready Beta

Static, isolated Workshop section for `stephenwilkinson.dev`.

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

The noindex operations dashboard is `/workshop/preview/`.

## Architecture

- `assets/catalog.js` contains the foundation catalog.
- `assets/catalog-beta.js` adds the published guide and expanded owned-gear data.
- `assets/catalog-commerce.js` adds media targets, link status, owned setup destinations, and storefront tasks.
- `assets/workshop.js` renders shared navigation, footer, cards, filters, selected-entry grids, and outbound tracking hooks.
- `assets/workshop-commerce.js` enhances existing cards, activates future images, and renders the private launch dashboard.
- `assets/workshop.css` imports only Workshop styles and does not change the existing portfolio stylesheet.
- Catalog pages supply semantic HTML shells and identify collections with data attributes.
- Payment processing, user accounts, customer data, and digital delivery remain outside this repository.

## Add or update catalog data

1. Keep the foundation data in `assets/catalog.js` stable.
2. Add ordinary catalog growth to `assets/catalog-beta.js`.
3. Add link, media, or storefront state to `assets/catalog-commerce.js`.
4. Keep `affiliate` false until an approved paid destination is active.
5. Set `personallyUsed` and `tested` independently.
6. Record a real `lastVerified` date.
7. Use `internalUrl` when the best first destination is an owned Workshop page.
8. Leave `url` empty when the exact external product has not been verified.

## Add an owned gear page

1. Copy one of the folders under `workshop/gear/`.
2. Update title, description, canonical URL, structured data, and H1.
3. State the equipment role, actual use, limitations, and paid-link status.
4. Add a `data-photo-target` filename that also exists in the media plan.
5. Add the route to `sitemap.xml`.
6. Patch the matching catalog entry with an `internalUrl`.
7. Verify the page with and without the image file present.

## Media workflow

The required filenames and export rules are documented in `media/README.md` and rendered on the private launch dashboard.

Cards and detail-page media slots attempt to load the expected file. Missing files fail safely back to the branded placeholder, so media can be added incrementally without breaking the page.

## External commerce workflow

The private dashboard tracks five channels:

- Payhip for direct digital checkout and file delivery
- Cults3D for STL discovery
- Thangs for bundles and larger files
- eBay for pilot physical listings
- Amazon Associates for future generic-tool links

Do not invent a public storefront URL, seller state, or affiliate identifier. Add the exact URL only after the account is created or confirmed.

## Outbound event

External catalog links dispatch `workshop:outbound` with the entry ID, entry type, destination, and source page. Existing `window.gtag` installations receive the same data as an analytics event.

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

The site remains static GitHub Pages. Merging these files into the publishing branch deploys the Workshop without a package install or build command.

## Guardrails

- Keep Workshop styles inside `workshop/assets/`.
- Do not add payment forms or card collection to the static site.
- Use established external marketplaces for checkout and digital delivery.
- Label paid links visibly and use sponsored link attributes.
- Do not redistribute third-party STL files.
- Do not list physical third-party prints without documented commercial permission.
- Keep printer settings tied to a documented resin, machine, layer height, environment, and test result.
- Use original photography and preserve honest limitations in gear notes.
