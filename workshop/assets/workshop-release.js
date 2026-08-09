(function () {
  "use strict";

  const catalog = window.WORKSHOP_CATALOG || {};
  const body = document.body;
  const root = body?.dataset.root || "./";
  let scheduled = false;

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

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return "";
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getReleaseEntry() {
    return (catalog.originalFiles || []).find((entry) => entry.id === "workshop-test-plate");
  }

  function syncReleaseCard() {
    const entry = getReleaseEntry();
    const card = document.querySelector('.ws-card[data-entry-id="workshop-test-plate"]');
    if (!entry || !card) return;

    const status = card.querySelector(".ws-card-status");
    if (status) {
      status.textContent = entry.status;
      status.dataset.statusTone = entry.statusTone || "ready";
    }

    const summary = card.querySelector(".ws-card-body > p");
    if (summary) summary.textContent = entry.summary;

    const details = card.querySelector(".ws-card-details");
    if (details) {
      details.innerHTML = [
        `Category: ${entry.category}`,
        `Destination: ${entry.marketplace}`,
        `Release: ${entry.priceLabel}`
      ].map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }

    const meta = card.querySelector(".ws-card-meta");
    if (meta && !meta.querySelector(".ws-badge-beta")) {
      meta.insertAdjacentHTML("beforeend", '<span class="ws-badge ws-badge-beta">Digital beta</span>');
    }

    const verified = card.querySelector(".ws-card-verified");
    if (verified) verified.textContent = `Released ${entry.releaseDate}`;

    const action = card.querySelector(".ws-card-footer .ws-button, .ws-card-footer .ws-button-muted");
    if (action && action.tagName !== "A") {
      const link = document.createElement("a");
      link.className = "ws-button ws-button-secondary";
      link.href = pathFromRoot(entry.internalUrl);
      link.textContent = entry.cta;
      action.replaceWith(link);
    } else if (action) {
      action.href = pathFromRoot(entry.internalUrl);
      action.textContent = entry.cta;
      action.removeAttribute("target");
      action.removeAttribute("rel");
    }

    card.dataset.releaseEnhanced = "true";
  }

  function updateChrome() {
    const announcement = document.querySelector(".ws-announcement p");
    if (announcement) {
      announcement.innerHTML = '<strong>First free STL beta available</strong> Download the Workshop Test Plate v0.1.0. Geometry is validated; physical print testing is still pending.';
    }

    const version = document.querySelector(".ws-footer-bottom span:last-child");
    if (version) version.textContent = `Catalog version ${catalog.meta?.version || "0.4.0"}`;
  }

  function updateHomepageBoard() {
    if (body?.dataset.page !== "home") return;
    const item = document.querySelector(".ws-release-list li:first-child");
    if (!item) return;
    const copy = item.querySelector("span:nth-child(2)");
    const state = item.querySelector(".ws-release-state");
    if (copy) copy.innerHTML = "<strong>Original files</strong><small>First free digital beta available</small>";
    if (state) state.textContent = "Download";
  }

  function insertOriginalFilesCallout() {
    if (body?.dataset.page !== "original-files") return;
    const container = document.querySelector("[data-filter-scope][data-collection='originalFiles']");
    if (!container || container.querySelector(".ws-release-alert")) return;
    const entry = getReleaseEntry();
    if (!entry) return;
    container.insertAdjacentHTML("afterbegin", `
      <aside class="ws-release-alert" aria-label="New digital beta">
        <div>
          <span class="ws-badge ws-badge-beta">New free beta</span>
          <h2>Workshop Test Plate v${escapeHtml(entry.releaseVersion)}</h2>
          <p>Download the first complete Workshop product package, including STL, editable CadQuery source, a print log, license, checksums, and geometry validation.</p>
        </div>
        <a class="ws-button" href="${escapeHtml(pathFromRoot(entry.internalUrl))}">Open the release</a>
      </aside>`);
  }

  function renderReleasePlan() {
    const target = document.querySelector("[data-release-plan]");
    if (!target || target.dataset.rendered === "true") return;
    const releases = catalog.meta?.productReleases || [];
    target.innerHTML = releases.map((release) => `
      <article class="ws-release-card">
        <div class="ws-release-card-head">
          <div>
            <p class="ws-section-kicker">Downloadable product</p>
            <h3>${escapeHtml(release.name)} v${escapeHtml(release.version)}</h3>
          </div>
          <span class="ws-status-pill" data-audit-status="${release.physicalValidation ? "ready" : "needed"}">${release.physicalValidation ? "Print validated" : "Physical test pending"}</span>
        </div>
        <p>Package contents: ${escapeHtml(release.included.join(", "))}.</p>
        <dl class="ws-release-facts">
          <div><dt>Archive</dt><dd>${escapeHtml(formatBytes(release.downloadBytes))}</dd></div>
          <div><dt>SHA-256</dt><dd><code>${escapeHtml(release.sha256.slice(0, 16))}…</code></dd></div>
        </dl>
        <div class="ws-inline-actions">
          <a class="ws-button" href="${escapeHtml(pathFromRoot(release.packageManifestUrl || release.downloadUrl))}" data-download-package data-package-manifest="${escapeHtml(pathFromRoot(release.packageManifestUrl || release.downloadUrl))}" data-product-id="${escapeHtml(release.id)}"><span data-download-label>Download package</span></a>
          <a class="ws-button ws-button-secondary" href="${escapeHtml(pathFromRoot("original-files/workshop-test-plate/"))}">Open product page</a>
        </div>
      </article>`).join("");
    target.dataset.rendered = "true";
  }

  function bytesFromBase64(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  async function sha256Hex(bytes) {
    if (!window.crypto?.subtle) return "";
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
  }

  function dispatchDownloadEvent(link, manifest) {
    const detail = {
      event: "workshop_download",
      productId: link.dataset.productId || manifest.productId || "unknown",
      sourcePage: window.location.pathname,
      href: link.dataset.packageManifest || link.getAttribute("href") || "",
      version: manifest.releaseVersion || "unknown"
    };
    window.dispatchEvent(new CustomEvent("workshop:download", { detail }));
    if (typeof window.gtag === "function") {
      window.gtag("event", detail.event, {
        product_id: detail.productId,
        source_page: detail.sourcePage,
        release_version: detail.version
      });
    }
  }

  async function preparePackage(link) {
    const label = link.querySelector("[data-download-label]") || link;
    const status = link.closest(".ws-download-block")?.querySelector("[data-download-status]");
    const originalLabel = label.textContent;
    link.setAttribute("aria-disabled", "true");
    label.textContent = "Preparing package...";
    if (status) status.textContent = "Loading and verifying the versioned ZIP archive.";

    try {
      const manifestUrl = new URL(link.dataset.packageManifest || link.href, document.baseURI);
      const response = await fetch(manifestUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`Manifest request failed (${response.status}).`);
      const manifest = await response.json();
      const parts = [];
      for (const chunkName of manifest.chunks || []) {
        const chunkResponse = await fetch(new URL(chunkName, manifestUrl), { cache: "no-store" });
        if (!chunkResponse.ok) throw new Error(`Package chunk failed (${chunkResponse.status}).`);
        parts.push((await chunkResponse.text()).trim());
      }
      const bytes = bytesFromBase64(parts.join(""));
      if (bytes.byteLength !== manifest.byteLength) {
        throw new Error("Package byte count did not match the release manifest.");
      }
      const digest = await sha256Hex(bytes);
      if (digest && digest !== manifest.sha256) {
        throw new Error("Package SHA-256 did not match the release manifest.");
      }
      const objectUrl = URL.createObjectURL(new Blob([bytes], { type: manifest.mimeType || "application/zip" }));
      const download = document.createElement("a");
      download.href = objectUrl;
      download.download = manifest.fileName || "Workshop-Test-Plate.zip";
      document.body.appendChild(download);
      download.click();
      download.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
      dispatchDownloadEvent(link, manifest);
      label.textContent = "Download started";
      if (status) status.textContent = digest ? "Archive byte count and SHA-256 verified." : "Archive byte count verified. SHA-256 verification was unavailable in this browser.";
    } catch (error) {
      label.textContent = "Download failed, retry";
      if (status) status.textContent = error instanceof Error ? error.message : "The package could not be prepared.";
      console.error("Workshop package download failed", error);
    } finally {
      link.removeAttribute("aria-disabled");
      window.setTimeout(() => {
        if (label.textContent === "Download started") label.textContent = originalLabel;
      }, 3500);
    }
  }

  function initializeDownloadTracking() {
    if (!body || body.dataset.downloadTracking === "true") return;
    body.dataset.downloadTracking = "true";
    document.addEventListener("click", (event) => {
      const link = event.target.closest("[data-download-package]");
      if (!link) return;
      event.preventDefault();
      if (link.getAttribute("aria-disabled") === "true") return;
      preparePackage(link);
    });
  }

  function run() {
    scheduled = false;
    if (!body) return;
    body.dataset.releaseVersion = catalog.meta?.version || "0.4.0";
    updateChrome();
    syncReleaseCard();
    updateHomepageBoard();
    insertOriginalFilesCallout();
    renderReleasePlan();
    initializeDownloadTracking();
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
  window.addEventListener("workshop:release-patch", scheduleRun);
  scheduleRun();
}());
