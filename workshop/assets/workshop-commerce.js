(function () {
  "use strict";

  const catalog = window.WORKSHOP_CATALOG || {};
  const body = document.body;
  const root = body?.dataset.root || "./";
  const collectionMap = [
    ["originalFiles", "Original files"],
    ["gear", "Gear"],
    ["creators", "Creators"],
    ["vendors", "Vendors"],
    ["guides", "Guides"],
    ["physicalProducts", "Physical products"]
  ];

  let scheduled = false;
  let catalogEventSent = false;

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

  function getCollection(name) {
    return Array.isArray(catalog[name]) ? catalog[name] : [];
  }

  function allEntries() {
    return collectionMap.flatMap(([key, label]) =>
      getCollection(key).map((entry) => ({ ...entry, collectionLabel: label }))
    );
  }

  function updateChrome() {
    const announcement = document.querySelector(".ws-announcement p");
    if (announcement && announcement.dataset.commerceReady !== "true") {
      announcement.innerHTML = "<strong>Commerce-ready beta</strong> Owned setup notes and workflow guides are live. Checkout remains external and no paid affiliate links are active.";
      announcement.dataset.commerceReady = "true";
    }

    const versionTarget = document.querySelector(".ws-footer-bottom span:last-child");
    const versionText = `Catalog version ${catalog.meta?.version || "unknown"}`;
    if (versionTarget && versionTarget.textContent !== versionText) {
      versionTarget.textContent = versionText;
    }
  }

  function configureInternalLink(link, entry) {
    link.href = pathFromRoot(entry.internalUrl);
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.removeAttribute("data-outbound-link");
    link.removeAttribute("data-destination");
  }

  function configureExternalLink(link, entry) {
    link.href = entry.url;
    link.target = "_blank";
    link.rel = entry.affiliate
      ? "sponsored nofollow noopener noreferrer"
      : "noopener noreferrer";
    link.dataset.outboundLink = "";
    link.dataset.entryId = entry.id;
    link.dataset.entryType = entry.type || "unknown";
    link.dataset.destination = entry.marketplace || "external";
  }

  function buildAction(entry) {
    if (entry.internalUrl || entry.url) {
      const link = document.createElement("a");
      link.className = "ws-button ws-button-secondary";
      link.textContent = entry.cta || "View details";
      if (entry.internalUrl) configureInternalLink(link, entry);
      else configureExternalLink(link, entry);
      return link;
    }

    const disabled = document.createElement("span");
    disabled.className = "ws-button ws-button-secondary ws-button-muted";
    disabled.setAttribute("aria-disabled", "true");
    disabled.textContent = entry.cta || "Link pending";
    return disabled;
  }

  function enhanceCards() {
    const entries = new Map(allEntries().map((entry) => [entry.id, entry]));

    document.querySelectorAll(".ws-card[data-entry-id]").forEach((card) => {
      const entry = entries.get(card.dataset.entryId);
      if (!entry || card.dataset.commerceEnhanced === "true") return;

      const titleLink = card.querySelector("h3 a");
      if (titleLink) {
        if (entry.internalUrl) configureInternalLink(titleLink, entry);
        else if (entry.url) configureExternalLink(titleLink, entry);
      }

      const action = card.querySelector(".ws-card-footer .ws-button, .ws-card-footer .ws-button-muted");
      if (action) action.replaceWith(buildAction(entry));

      const media = card.querySelector(".ws-card-media");
      if (media && entry.image && !media.querySelector("img")) {
        const icon = media.querySelector(".ws-card-icon");
        const image = document.createElement("img");
        image.src = pathFromRoot(entry.image);
        image.alt = entry.imageAlt || entry.name;
        image.width = 640;
        image.height = 360;
        image.loading = "lazy";
        image.decoding = "async";
        image.hidden = true;
        image.addEventListener("load", () => {
          image.hidden = false;
          media.classList.add("has-image");
          if (icon) icon.hidden = true;
        }, { once: true });
        image.addEventListener("error", () => image.remove(), { once: true });
        media.prepend(image);
      }

      card.dataset.commerceEnhanced = "true";
    });
  }

  function activateMediaSlots() {
    const mediaPlan = catalog.meta?.mediaPlan || [];

    document.querySelectorAll("[data-photo-target]").forEach((slot) => {
      if (slot.dataset.photoAttempted === "true") return;
      slot.dataset.photoAttempted = "true";

      const target = slot.dataset.photoTarget;
      const plan = mediaPlan.find((item) => item.filename === target);
      const image = document.createElement("img");
      image.src = pathFromRoot(target);
      image.alt = plan?.alt || "Original Wilkinson Workshop reference photograph.";
      image.loading = slot.closest(".ws-hero") ? "eager" : "lazy";
      image.decoding = "async";
      image.hidden = true;
      image.addEventListener("load", () => {
        image.hidden = false;
        image.className = "ws-media-slot-image";
        slot.querySelector(".ws-media-slot-inner")?.setAttribute("hidden", "");
        slot.classList.add("has-image");
      }, { once: true });
      image.addEventListener("error", () => image.remove(), { once: true });
      slot.prepend(image);
    });
  }

  function statusPill(status) {
    const labels = {
      ready: "Ready",
      needed: "Photo needed",
      "not-planned": "Not planned",
      "blocked-by-prototype": "Blocked by prototype",
      "confirmation-needed": "Confirm account",
      "not-active": "Not active",
      internal: "Internal page",
      external: "External reference",
      official: "Official reference",
      affiliate: "Paid link",
      "detail-and-official": "Detail plus official",
      "detail-and-external": "Detail plus external",
      "internal-pending-product-link": "Internal, product link pending",
      pending: "Link pending"
    };
    return `<span class="ws-status-pill" data-audit-status="${escapeHtml(status)}">${escapeHtml(labels[status] || status)}</span>`;
  }

  function renderDashboard() {
    const statsTarget = document.querySelector("[data-launch-dashboard]");
    const mediaTarget = document.querySelector("[data-media-plan]");
    const storefrontTarget = document.querySelector("[data-storefront-plan]");
    const auditTarget = document.querySelector("[data-link-audit]");
    if (!statsTarget && !mediaTarget && !storefrontTarget && !auditTarget) return;

    const entries = allEntries();
    const mediaPlan = catalog.meta?.mediaPlan || [];
    const storefrontPlan = catalog.meta?.storefrontPlan || [];

    if (statsTarget && statsTarget.dataset.rendered !== "true") {
      const stats = [
        [entries.length, "Catalog entries"],
        [entries.filter((entry) => entry.personallyUsed).length, "Personally used"],
        [entries.filter((entry) => entry.internalUrl || entry.url).length, "Working destinations"],
        [entries.filter((entry) => !entry.internalUrl && !entry.url).length, "Links still pending"],
        [mediaPlan.filter((item) => item.status !== "ready").length, "Media tasks open"],
        [entries.filter((entry) => entry.affiliate && entry.url).length, "Paid links active"]
      ];
      statsTarget.innerHTML = stats.map(([value, label]) =>
        `<article class="ws-dashboard-stat"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></article>`
      ).join("");
      statsTarget.dataset.rendered = "true";
    }

    if (mediaTarget && mediaTarget.dataset.rendered !== "true") {
      mediaTarget.innerHTML = mediaPlan.map((item) => `
        <article class="ws-media-plan-card">
          <div class="ws-media-plan-top"><span class="ws-priority">${escapeHtml(item.priority)}</span>${statusPill(item.status)}</div>
          <h3>${escapeHtml(item.target)}</h3>
          <code>${escapeHtml(item.filename)}</code>
          <dl>
            <div><dt>Ratio</dt><dd>${escapeHtml(item.aspect)}</dd></div>
            <div><dt>Minimum width</dt><dd>${escapeHtml(item.minimumWidth)} px</dd></div>
          </dl>
          <p>${escapeHtml(item.shot)}</p>
          <p class="ws-media-alt"><strong>Alt text:</strong> ${escapeHtml(item.alt)}</p>
        </article>`).join("");
      mediaTarget.dataset.rendered = "true";
    }

    if (storefrontTarget && storefrontTarget.dataset.rendered !== "true") {
      storefrontTarget.innerHTML = storefrontPlan.map((item) => `
        <article class="ws-storefront-card">
          <div class="ws-media-plan-top"><h3>${escapeHtml(item.name)}</h3>${statusPill(item.status)}</div>
          <p>${escapeHtml(item.role)}</p>
          <p><strong>Next action:</strong> ${escapeHtml(item.nextAction)}</p>
        </article>`).join("");
      storefrontTarget.dataset.rendered = "true";
    }

    if (auditTarget && auditTarget.dataset.rendered !== "true") {
      const rows = entries.map((entry) => {
        const status = entry.linkStatus || (entry.affiliate && entry.url
          ? "affiliate"
          : entry.internalUrl
            ? "internal"
            : entry.url
              ? "external"
              : "pending");
        return `
          <tr>
            <td><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.collectionLabel)}</small></td>
            <td>${statusPill(status)}</td>
            <td>${escapeHtml(entry.marketplace || "No destination recorded")}</td>
            <td>${escapeHtml(entry.lastVerified || catalog.meta?.updated || "Not recorded")}</td>
          </tr>`;
      }).join("");

      auditTarget.innerHTML = `
        <div class="ws-audit-table-wrap">
          <table class="ws-audit-table">
            <thead><tr><th>Entry</th><th>Link state</th><th>Destination</th><th>Checked</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
      auditTarget.dataset.rendered = "true";
    }
  }

  function run() {
    scheduled = false;
    if (!body) return;
    body.dataset.catalogVersion = catalog.meta?.version || "unknown";
    body.dataset.commerceReady = "true";
    updateChrome();
    enhanceCards();
    activateMediaSlots();
    renderDashboard();

    if (!catalogEventSent && document.querySelector(".ws-site-header")) {
      catalogEventSent = true;
      window.dispatchEvent(new CustomEvent("workshop:catalog-ready", {
        detail: {
          version: catalog.meta?.version || "unknown",
          entries: allEntries().length
        }
      }));
    }
  }

  function scheduleRun() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(run);
  }

  const observer = new MutationObserver(scheduleRun);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", scheduleRun, { once: true });
  window.addEventListener("load", scheduleRun, { once: true });
  scheduleRun();

  window.WORKSHOP_COMMERCE_READY = true;
}());
