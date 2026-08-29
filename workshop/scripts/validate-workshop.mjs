import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../..");
const workshopRoot = path.join(repositoryRoot, "workshop");
const failures = [];
const notes = [];

function fail(message) {
  failures.push(message);
}

function note(message) {
  notes.push(message);
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function relative(filePath) {
  return path.relative(repositoryRoot, filePath).split(path.sep).join("/");
}

function walk(directory, predicate = () => true) {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...walk(fullPath, predicate));
    else if (predicate(fullPath)) results.push(fullPath);
  }
  return results.sort();
}

function countMatches(text, expression) {
  return [...text.matchAll(expression)].length;
}

function stripCommentsAndStrings(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/"(?:\\.|[^"\\])*"/g, "")
    .replace(/'(?:\\.|[^'\\])*'/g, "");
}

function resolveLocalReference(htmlFile, rawReference) {
  const reference = rawReference.trim();
  if (
    !reference ||
    reference.startsWith("#") ||
    reference.startsWith("mailto:") ||
    reference.startsWith("tel:") ||
    reference.startsWith("data:") ||
    reference.startsWith("javascript:") ||
    /^https?:\/\//i.test(reference)
  ) {
    return null;
  }

  const cleanReference = reference.split("#")[0].split("?")[0];
  if (!cleanReference) return null;

  let resolved = path.resolve(path.dirname(htmlFile), cleanReference);
  if (cleanReference.endsWith("/")) resolved = path.join(resolved, "index.html");
  if (!path.extname(resolved) && fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
    resolved = path.join(resolved, "index.html");
  }
  return resolved;
}

function validateHtml() {
  const htmlFiles = walk(workshopRoot, (file) => file.endsWith(".html"));
  if (!htmlFiles.length) fail("No Workshop HTML files were found.");

  for (const file of htmlFiles) {
    const html = read(file);
    const fileLabel = relative(file);
    const h1Count = countMatches(html, /<h1\b/gi);
    if (h1Count !== 1) fail(`${fileLabel}: expected exactly one H1, found ${h1Count}.`);

    const ids = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    if (duplicateIds.length) fail(`${fileLabel}: duplicate IDs: ${duplicateIds.join(", ")}.`);

    const references = [...html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
    for (const reference of references) {
      const resolved = resolveLocalReference(file, reference);
      if (resolved && !fs.existsSync(resolved)) {
        fail(`${fileLabel}: missing local reference ${reference} -> ${relative(resolved)}.`);
      }
    }

    if (!/<meta\s+name=["']description["']/i.test(html)) {
      fail(`${fileLabel}: missing meta description.`);
    }
    if (!/<link\s+rel=["']canonical["']/i.test(html)) {
      fail(`${fileLabel}: missing canonical link.`);
    }
  }

  note(`Validated ${htmlFiles.length} Workshop HTML files.`);
}

function validateCss() {
  const cssFiles = walk(path.join(workshopRoot, "assets"), (file) => file.endsWith(".css"));
  for (const file of cssFiles) {
    const css = stripCommentsAndStrings(read(file));
    const opens = countMatches(css, /\{/g);
    const closes = countMatches(css, /\}/g);
    if (opens !== closes) fail(`${relative(file)}: unbalanced braces (${opens} opening, ${closes} closing).`);
  }
  note(`Validated ${cssFiles.length} Workshop CSS files.`);
}

function routeFromPublicUrl(url) {
  const parsed = new URL(url);
  if (!parsed.pathname.startsWith("/workshop/")) return null;
  const localPath = parsed.pathname.replace(/^\//, "");
  return path.join(repositoryRoot, localPath, "index.html");
}

function validateSitemap() {
  const sitemapPath = path.join(repositoryRoot, "sitemap.xml");
  const xml = read(sitemapPath);
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  const duplicates = [...new Set(locations.filter((url, index) => locations.indexOf(url) !== index))];
  if (duplicates.length) fail(`sitemap.xml: duplicate URLs: ${duplicates.join(", ")}.`);

  for (const location of locations) {
    let mapped;
    try {
      mapped = routeFromPublicUrl(location);
    } catch {
      fail(`sitemap.xml: invalid URL ${location}.`);
      continue;
    }
    if (mapped && !fs.existsSync(mapped)) {
      fail(`sitemap.xml: ${location} does not map to ${relative(mapped)}.`);
    }
  }

  if (locations.some((url) => url.includes("/workshop/preview/"))) {
    fail("sitemap.xml: the noindex Workshop preview route must not be indexed.");
  }

  note(`Validated ${locations.length} sitemap URLs.`);
}

function extractReleaseRecord(source) {
  const bytes = Number(source.match(/downloadBytes:\s*(\d+)/)?.[1]);
  const sha256 = source.match(/downloadSha256:\s*["']([a-f0-9]{64})["']/i)?.[1];
  const triangleCount = Number(source.match(/triangleCount:\s*(\d+)/)?.[1]);
  if (!Number.isFinite(bytes) || !sha256 || !Number.isFinite(triangleCount)) {
    fail("catalog-release.js: could not read the release byte count, SHA-256, and triangle count.");
  }
  return { bytes, sha256, triangleCount };
}

function validateRelease() {
  const generatorPath = path.join(workshopRoot, "assets/workshop-product-generator.js");
  const releasePath = path.join(workshopRoot, "assets/catalog-release.js");
  const generator = require(generatorPath);
  if (typeof generator.buildPackage !== "function") {
    fail("workshop-product-generator.js does not export buildPackage().");
    return;
  }

  const release = extractReleaseRecord(read(releasePath));
  const product = generator.buildPackage();
  const digest = crypto.createHash("sha256").update(product.bytes).digest("hex");

  if (product.bytes.length !== release.bytes) {
    fail(`Product package byte count changed: expected ${release.bytes}, generated ${product.bytes.length}.`);
  }
  if (digest !== release.sha256) {
    fail(`Product package SHA-256 changed: expected ${release.sha256}, generated ${digest}.`);
  }
  if (product.stl?.triangleCount !== release.triangleCount) {
    fail(`STL triangle count changed: expected ${release.triangleCount}, generated ${product.stl?.triangleCount}.`);
  }
  if (product.stl?.bounds?.width !== 60 || product.stl?.bounds?.depth !== 40 || product.stl?.bounds?.maximumHeight !== 2.8) {
    fail(`Unexpected STL bounds: ${JSON.stringify(product.stl?.bounds)}.`);
  }
  if (!String(product.fileName).endsWith(".zip")) fail("Generated product filename is not a ZIP archive.");
  if (product.bytes[0] !== 0x50 || product.bytes[1] !== 0x4b) fail("Generated package does not begin with a ZIP signature.");

  note(`Validated ${product.fileName}: ${product.bytes.length} bytes, ${digest}, ${product.stl.triangleCount} triangles.`);
}

function validateNoIndexedPreview() {
  const previewPath = path.join(workshopRoot, "preview/index.html");
  const preview = read(previewPath);
  if (!/<meta\s+name=["']robots["'][^>]+noindex/i.test(preview)) {
    fail("workshop/preview/index.html must remain noindex.");
  }
}

try {
  validateHtml();
  validateCss();
  validateSitemap();
  validateRelease();
  validateNoIndexedPreview();
} catch (error) {
  fail(error instanceof Error ? error.stack || error.message : String(error));
}

for (const message of notes) console.log(`✓ ${message}`);

if (failures.length) {
  console.error(`\nWorkshop validation failed with ${failures.length} problem${failures.length === 1 ? "" : "s"}:`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("\nWorkshop validation passed.");
