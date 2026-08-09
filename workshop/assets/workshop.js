(function () {
  "use strict";

  const catalog = window.WORKSHOP_CATALOG || {};
  const body = document.body;
  const root = body.dataset.root || "./";
  const currentPage = body.dataset.page || "home";

  const navigation = [
    { id: "home", label: "Home", path: "" },
    { id: "original-files", label: "Original Files", path: "original-files/" },
    { id: "gear", label: "Gear", path: "gear/" },
    { id: "creators", label: "Creators", path: "creators/" },
    { id: "vendors", label: "Vendors", path: "vendors/" },
    { id: "guides", label: "Guides", path: "guides/" },
    { id: "physical-shop", label: "Physical Shop", path: "physical-shop/" }
  ];

  function pathFromRoot(path) {
    return `${root}${path}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderHeader() {
    const target = document.querySelector("[data-workshop-header]");
    if (!target) return;

    const navLinks = navigation.map((item) => {
      const isCurrent = currentPage === item.id;
      return `<a href="${escapeHtml(pathFromRoot(item.path))}"${isCurrent ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`;
    }).join("");

    target.innerHTML = `
      <div class="ws-announcement">
        <div class="ws-container">
          <p><strong>Public beta</strong> Three workflow guides are live. Checkout remains external and no paid affiliate links are active.</p>
        </div>
      </div>
      <header class="ws-site-header">
        <div class="ws-container ws-header-row">
          <a class="ws-brand" href="${escapeHtml(pathFromRoot(""))}" aria-label="Wilkinson Workshop home">
            <img src="${escapeHtml(pathFromRoot("assets/workshop-mark.svg"))}" width="42" height="42" alt="">
            <span class="ws-brand-copy">
              <strong>Wilkinson Workshop</strong>
              <span>Print. Build. Finish.</span>
            </span>
          </a>
          <button class="ws-nav-toggle" type="button" aria-expanded="false" aria-controls="workshop-navigation" aria-label="Open navigation">
            <span class="ws-nav-toggle-lines" aria-hidden="true"></span>
          </button>
          <nav class="ws-nav" id="workshop-navigation" aria-label="Workshop navigation" data-open="false">
            ${navLinks}
          </nav>
        </div>
      </header>`;
  }

  function renderFooter() {
    const target = document.querySelector("[data-workshop-footer]");
    if (!target) return;

    const year = new Date().getFullYear();
    target.innerHTML = `
      <footer class="ws-site-footer">
        <div class="ws-container ws-footer-grid">
          <div class="ws-footer-brand">
            <img src="${escapeHtml(pathFromRoot("assets/workshop-mark.svg"))}" width="38" height="38" alt="">
            <div>
              <strong>Wilkinson Workshop</strong>
              <p>Original hobby files, personally used gear, and curated third-party resources. Store transactions are handled by external marketplaces.</p>
            </div>
          </div>
          <nav class="ws-footer-links" aria-label="Workshop footer navigation">
            <a href="${escapeHtml(pathFromRoot("about/"))}">About</a>
            <a href="${escapeHtml(pathFromRoot("disclosures/"))}">Disclosures</a>
            <a href="mailto:stephen@stephenwilkinson.dev">Contact</a>
            <a href="${escapeHtml(pathFromRoot("../"))}">Portfolio</a>
          </nav>
        </div>
        <div class="ws-container ws-footer-bottom">
          <span>&copy; ${year} Stephen Wilkinson</span>
          <span>Catalog version ${escapeHtml(catalog.meta?.version || "preview")}</span>
        </div>
      </footer>`;
  }

  function initializeNavigation() {
    const button = document.querySelector(".ws-nav-toggle");
    const nav = document.querySelector(".ws-nav");
    if (!button || !nav) return;

    const closeNavigation = () => {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation");
      nav.dataset.open = "false";
    };

    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      button.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      nav.dataset.open = String(!open);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNavigation();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNavigation();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080) closeNavigation();
    });
  }

  function badgesFor(entry) {
    const badges = [];
    if (entry.type === "original-stl") {
      badges.push('<span class="ws-badge ws-badge-original">Original file</span>');
    }
    if (entry.personallyUsed) {
      badges.push('<span class="ws-badge ws-badge-used">Personally used</span>');
    }
    if (entry.affiliate) {
      badges.push('<span class="ws-badge ws-badge-affiliate">Paid link</span>');
    }
    return badges.join("");
  }

  function cardLink(entry, className, label) {
    if (entry.internalUrl) {
      return `<a class="${className}" href="${escapeHtml(pathFromRoot(entry.internalUrl))}">${escapeHtml(label)}</a>`;
    }

    if (entry.url) {
      const rel = entry.affiliate
        ? "sponsored nofollow noopener noreferrer"
        : "noopener noreferrer";
      return `<a class="${className}" href="${escapeHtml(entry.url)}" target="_blank" rel="${rel}" data-outbound-link data-entry-id="${escapeHtml(entry.id)}" data-entry-type="${escapeHtml(entry.type)}" data-destination="${escapeHtml(entry.marketplace || "external")}">${escapeHtml(label)}</a>`;
    }

    return `<span class="${className} ws-button-muted" aria-disabled="true">${escapeHtml(label)}</span>`;
  }

  function renderCard(entry) {
    const title = entry.internalUrl
      ? `<a href="${escapeHtml(pathFromRoot(entry.internalUrl))}">${escapeHtml(entry.name)}</a>`
      : entry.url
        ? `<a href="${escapeHtml(entry.url)}" target="_blank" rel="${entry.affiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}" data-outbound-link data-entry-id="${escapeHtml(entry.id)}" data-entry-type="${escapeHtml(entry.type)}" data-destination="${escapeHtml(entry.marketplace || "external")}">${escapeHtml(entry.name)}</a>`
        : escapeHtml(entry.name);

    const detailItems = [
      entry.category ? `Category: ${entry.category}` : "",
      entry.marketplace ? `Destination: ${entry.marketplace}` : "",
      entry.priceLabel ? `Release: ${entry.priceLabel}` : ""
    ].filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join("");

    return `
      <article class="ws-card" data-entry-id="${escapeHtml(entry.id)}">
        <div class="ws-card-media" data-tone="${escapeHtml(entry.tone || "tool")}">
          <span class="ws-card-icon" aria-hidden="true">${escapeHtml(entry.icon || "WW")}</span>
          <span class="ws-card-status" data-status-tone="${escapeHtml(entry.statusTone || "planned")}">${escapeHtml(entry.status || "Planned")}</span>
        </div>
        <div class="ws-card-body">
          <div class="ws-card-meta">${badgesFor(entry)}</div>
          <h3>${title}</h3>
          <p>${escapeHtml(entry.summary)}</p>
          <ul class="ws-card-details">${detailItems}</ul>
          <div class="ws-card-footer">
            <span class="ws-card-verified">Checked ${escapeHtml(entry.lastVerified || catalog.meta?.updated || "")}</span>
            ${cardLink(entry, "ws-button ws-button-secondary", entry.cta || "View details")}
          </div>
        </div>
      </article>`;
  }

  function getCollection(name) {
    const entries = catalog[name];
    return Array.isArray(entries) ? entries : [];
  }

  function renderStaticCatalogGrids() {
    document.querySelectorAll("[data-catalog-grid]:not([data-filter-grid])").forEach((grid) => {
      let entries = getCollection(grid.dataset.collection);
      const selectedIds = (grid.dataset.entryIds || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      if (selectedIds.length) {
        const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
        entries = selectedIds.map((id) => entriesById.get(id)).filter(Boolean);
      }

      if (grid.dataset.featured === "true") {
        entries = entries.filter((entry) => entry.featured);
      }
      const limit = Number.parseInt(grid.dataset.limit || "0", 10);
      if (Number.isFinite(limit) && limit > 0) entries = entries.slice(0, limit);
      grid.innerHTML = entries.length
        ? entries.map(renderCard).join("")
        : '<div class="ws-empty-state">No catalog entries are published in this section yet.</div>';
    });
  }

  function initializeFilterScope(scope) {
    const collectionName = scope.dataset.collection;
    const entries = getCollection(collectionName);
    const grid = scope.querySelector("[data-filter-grid]");
    const search = scope.querySelector("[data-filter-search]");
    const category = scope.querySelector("[data-filter-category]");
    const used = scope.querySelector("[data-filter-used]");
    const count = scope.querySelector("[data-filter-count]");
    const clear = scope.querySelector("[data-filter-clear]");

    if (!grid) return;

    if (category) {
      const categories = [...new Set(entries.map((entry) => entry.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      category.insertAdjacentHTML("beforeend", categories.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join(""));
    }

    const applyFilters = () => {
      const query = (search?.value || "").trim().toLowerCase();
      const categoryValue = category?.value || "";
      const usedOnly = Boolean(used?.checked);

      const filtered = entries.filter((entry) => {
        const searchable = [entry.name, entry.summary, entry.category, ...(entry.tags || [])].join(" ").toLowerCase();
        return (!query || searchable.includes(query))
          && (!categoryValue || entry.category === categoryValue)
          && (!usedOnly || entry.personallyUsed);
      });

      grid.innerHTML = filtered.length
        ? filtered.map(renderCard).join("")
        : '<div class="ws-empty-state"><strong>No matching entries.</strong><br>Clear a filter or try a broader search.</div>';

      if (count) {
        count.textContent = `${filtered.length} ${filtered.length === 1 ? "entry" : "entries"}`;
      }
    };

    [search, category, used].filter(Boolean).forEach((control) => {
      control.addEventListener(control.matches("input[type='search']") ? "input" : "change", applyFilters);
    });

    clear?.addEventListener("click", () => {
      if (search) search.value = "";
      if (category) category.value = "";
      if (used) used.checked = false;
      applyFilters();
      search?.focus();
    });

    applyFilters();
  }

  function initializeFilters() {
    document.querySelectorAll("[data-filter-scope]").forEach(initializeFilterScope);
  }

  function initializeOutboundTracking() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("[data-outbound-link]");
      if (!link) return;

      const detail = {
        event: "workshop_outbound_click",
        entryId: link.dataset.entryId || "unknown",
        entryType: link.dataset.entryType || "unknown",
        destination: link.dataset.destination || "external",
        sourcePage: window.location.pathname
      };

      window.dispatchEvent(new CustomEvent("workshop:outbound", { detail }));

      if (typeof window.gtag === "function") {
        window.gtag("event", detail.event, {
          entry_id: detail.entryId,
          entry_type: detail.entryType,
          destination: detail.destination,
          source_page: detail.sourcePage
        });
      }
    });
  }

  function initializeWorkshop() {
    renderHeader();
    renderFooter();
    initializeNavigation();
    renderStaticCatalogGrids();
    initializeFilters();
    initializeOutboundTracking();
  }

  function loadCatalogExtension() {
    if (window.WORKSHOP_BETA_APPLIED) {
      initializeWorkshop();
      return;
    }

    const script = document.createElement("script");
    script.src = pathFromRoot("assets/catalog-beta.js");
    script.addEventListener("load", initializeWorkshop, { once: true });
    script.addEventListener("error", initializeWorkshop, { once: true });
    document.head.appendChild(script);
  }

  loadCatalogExtension();
}());
