(function (global) {
  "use strict";

  const PRODUCT_ID = "workshop-test-plate-v0.1.0";
  const VERSION = "0.1.0";
  const WIDTH = 60;
  const DEPTH = 40;
  const BASE_TOP = 2.0;
  const FIXED_DOS_TIME = ((12 & 31) << 11);
  const FIXED_DOS_DATE = (((2026 - 1980) & 127) << 9) | ((8 & 15) << 5) | (9 & 31);

  function round(value) {
    return Math.round(value * 10000) / 10000;
  }

  function buildFeatures() {
    const features = [];
    const add = (x0, y0, x1, y1, z, mode = "max", label = "") => {
      features.push({ x0: round(x0), y0: round(y0), x1: round(x1), y1: round(y1), z, mode, label });
    };

    const widths = [0.20, 0.35, 0.50, 0.70, 1.00];
    widths.forEach((width, index) => {
      const center = 4 + index * 2.45;
      add(center - width / 2, 4, center + width / 2, 13, 2.50, "max", `raised-${width}`);
    });

    widths.forEach((width, index) => {
      const center = 19 + index * 2.45;
      add(center - width / 2, 4, center + width / 2, 13, 1.60, "min", `groove-${width}`);
    });

    const clearances = [0.50, 0.70, 0.90, 1.20, 1.50];
    clearances.forEach((size, index) => {
      const center = 36.5 + index * 4.25;
      add(center - size / 2, 4.6, center + size / 2, 7.6, 2.65, "max", `post-${size}`);
      add(center - size / 2, 9.4, center + size / 2, 12.4, 1.45, "min", `recess-${size}`);
    });

    add(3, 17, 12, 23, 2.10, "max", "relief-0.10");
    add(14, 17, 23, 23, 2.40, "max", "relief-0.40");
    add(25, 17, 34, 23, 2.80, "max", "relief-0.80");

    [28.0, 29.7, 31.4, 33.1, 34.8, 36.5].forEach((y) => add(3, y, 15, y + 0.25, 2.28, "max", "parallel"));

    [28.0, 30.2, 32.4, 34.6, 36.8].forEach((y) => add(17, y, 29, y + 0.22, 2.28, "max", "grid-h"));
    [18.0, 20.4, 22.8, 25.2, 27.6].forEach((x) => add(x, 27, x + 0.22, 37, 2.28, "max", "grid-v"));

    [32.0, 35.0, 38.0, 41.0].forEach((x) => {
      [28.0, 31.2, 34.4].forEach((y) => add(x, y, x + 0.55, y + 0.55, 2.45, "max", "rivet"));
    });

    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        if ((row + column) % 2 !== 0) continue;
        const x0 = 45 + column * 2.8;
        const y0 = 27.4 + row * 2.35;
        add(x0, y0, x0 + 1.5, y0 + 1.25, 2.30, "max", "checker");
      }
    }

    return features;
  }

  function uniqueSorted(values) {
    const map = new Map();
    values.forEach((value) => map.set(round(value).toFixed(4), round(value)));
    return [...map.values()].sort((a, b) => a - b);
  }

  function topHeight(x, y, features) {
    let height = BASE_TOP;
    for (const feature of features) {
      if (x <= feature.x0 || x >= feature.x1 || y <= feature.y0 || y >= feature.y1) continue;
      height = feature.mode === "min" ? Math.min(height, feature.z) : Math.max(height, feature.z);
    }
    return height;
  }

  function normalFor(a, b, c) {
    const ux = b[0] - a[0];
    const uy = b[1] - a[1];
    const uz = b[2] - a[2];
    const vx = c[0] - a[0];
    const vy = c[1] - a[1];
    const vz = c[2] - a[2];
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const length = Math.hypot(nx, ny, nz) || 1;
    return [nx / length, ny / length, nz / length];
  }

  function buildTriangles() {
    const features = buildFeatures();
    const xs = uniqueSorted([0, WIDTH, ...features.flatMap((feature) => [feature.x0, feature.x1])]);
    const ys = uniqueSorted([0, DEPTH, ...features.flatMap((feature) => [feature.y0, feature.y1])]);
    const xCells = xs.length - 1;
    const yCells = ys.length - 1;
    const heights = Array.from({ length: yCells }, (_, row) => Array.from({ length: xCells }, (_, column) => {
      const centerX = (xs[column] + xs[column + 1]) / 2;
      const centerY = (ys[row] + ys[row + 1]) / 2;
      return topHeight(centerX, centerY, features);
    }));

    const triangles = [];
    const addTriangle = (a, b, c) => triangles.push({ normal: normalFor(a, b, c), vertices: [a, b, c] });
    const addQuad = (a, b, c, d) => {
      addTriangle(a, b, c);
      addTriangle(a, c, d);
    };

    for (let row = 0; row < yCells; row += 1) {
      for (let column = 0; column < xCells; column += 1) {
        const x0 = xs[column];
        const x1 = xs[column + 1];
        const y0 = ys[row];
        const y1 = ys[row + 1];
        const height = heights[row][column];
        addQuad([x0, y0, height], [x1, y0, height], [x1, y1, height], [x0, y1, height]);
        addQuad([x0, y0, 0], [x0, y1, 0], [x1, y1, 0], [x1, y0, 0]);
      }
    }

    for (let column = 0; column < xCells; column += 1) {
      const x0 = xs[column];
      const x1 = xs[column + 1];
      const frontHeight = heights[0][column];
      const backHeight = heights[yCells - 1][column];
      addQuad([x0, 0, 0], [x1, 0, 0], [x1, 0, frontHeight], [x0, 0, frontHeight]);
      addQuad([x0, DEPTH, 0], [x0, DEPTH, backHeight], [x1, DEPTH, backHeight], [x1, DEPTH, 0]);
    }

    for (let row = 0; row < yCells; row += 1) {
      const y0 = ys[row];
      const y1 = ys[row + 1];
      const leftHeight = heights[row][0];
      const rightHeight = heights[row][xCells - 1];
      addQuad([0, y0, 0], [0, y0, leftHeight], [0, y1, leftHeight], [0, y1, 0]);
      addQuad([WIDTH, y0, 0], [WIDTH, y1, 0], [WIDTH, y1, rightHeight], [WIDTH, y0, rightHeight]);
    }

    for (let row = 0; row < yCells; row += 1) {
      const y0 = ys[row];
      const y1 = ys[row + 1];
      for (let boundary = 1; boundary < xCells; boundary += 1) {
        const leftHeight = heights[row][boundary - 1];
        const rightHeight = heights[row][boundary];
        if (Math.abs(leftHeight - rightHeight) < 0.00001) continue;
        const x = xs[boundary];
        if (leftHeight > rightHeight) {
          addQuad([x, y0, rightHeight], [x, y1, rightHeight], [x, y1, leftHeight], [x, y0, leftHeight]);
        } else {
          addQuad([x, y0, leftHeight], [x, y0, rightHeight], [x, y1, rightHeight], [x, y1, leftHeight]);
        }
      }
    }

    for (let boundary = 1; boundary < yCells; boundary += 1) {
      const y = ys[boundary];
      for (let column = 0; column < xCells; column += 1) {
        const lowerHeight = heights[boundary - 1][column];
        const upperHeight = heights[boundary][column];
        if (Math.abs(lowerHeight - upperHeight) < 0.00001) continue;
        const x0 = xs[column];
        const x1 = xs[column + 1];
        if (lowerHeight > upperHeight) {
          addQuad([x0, y, upperHeight], [x0, y, lowerHeight], [x1, y, lowerHeight], [x1, y, upperHeight]);
        } else {
          addQuad([x0, y, lowerHeight], [x1, y, lowerHeight], [x1, y, upperHeight], [x0, y, upperHeight]);
        }
      }
    }

    return { triangles, xs, ys, features };
  }

  function buildBinaryStl() {
    const { triangles, xs, ys, features } = buildTriangles();
    const bytes = new Uint8Array(84 + triangles.length * 50);
    const view = new DataView(bytes.buffer);
    const header = new TextEncoder().encode("Wilkinson Workshop Test Plate v0.1.0 | Parametric digital beta");
    bytes.set(header.slice(0, 80), 0);
    view.setUint32(80, triangles.length, true);
    let offset = 84;
    for (const triangle of triangles) {
      const values = [...triangle.normal, ...triangle.vertices.flat()];
      values.forEach((value) => {
        view.setFloat32(offset, value, true);
        offset += 4;
      });
      view.setUint16(offset, 0, true);
      offset += 2;
    }
    return {
      bytes,
      triangleCount: triangles.length,
      grid: { xBreakpoints: xs.length, yBreakpoints: ys.length },
      featureCount: features.length,
      bounds: { width: WIDTH, depth: DEPTH, maximumHeight: 2.8 }
    };
  }

  function crcTable() {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  }

  const CRC_TABLE = crcTable();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  function concatBytes(parts) {
    const length = parts.reduce((sum, part) => sum + part.length, 0);
    const output = new Uint8Array(length);
    let offset = 0;
    parts.forEach((part) => {
      output.set(part, offset);
      offset += part.length;
    });
    return output;
  }

  function writeUint16(view, offset, value) {
    view.setUint16(offset, value, true);
  }

  function writeUint32(view, offset, value) {
    view.setUint32(offset, value >>> 0, true);
  }

  function makeZip(files) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let localOffset = 0;

    for (const file of files) {
      const nameBytes = encoder.encode(file.name);
      const data = file.bytes instanceof Uint8Array ? file.bytes : encoder.encode(file.bytes);
      const crc = crc32(data);

      const localHeader = new Uint8Array(30 + nameBytes.length);
      const localView = new DataView(localHeader.buffer);
      writeUint32(localView, 0, 0x04034b50);
      writeUint16(localView, 4, 20);
      writeUint16(localView, 6, 0);
      writeUint16(localView, 8, 0);
      writeUint16(localView, 10, FIXED_DOS_TIME);
      writeUint16(localView, 12, FIXED_DOS_DATE);
      writeUint32(localView, 14, crc);
      writeUint32(localView, 18, data.length);
      writeUint32(localView, 22, data.length);
      writeUint16(localView, 26, nameBytes.length);
      writeUint16(localView, 28, 0);
      localHeader.set(nameBytes, 30);
      localParts.push(localHeader, data);

      const centralHeader = new Uint8Array(46 + nameBytes.length);
      const centralView = new DataView(centralHeader.buffer);
      writeUint32(centralView, 0, 0x02014b50);
      writeUint16(centralView, 4, 20);
      writeUint16(centralView, 6, 20);
      writeUint16(centralView, 8, 0);
      writeUint16(centralView, 10, 0);
      writeUint16(centralView, 12, FIXED_DOS_TIME);
      writeUint16(centralView, 14, FIXED_DOS_DATE);
      writeUint32(centralView, 16, crc);
      writeUint32(centralView, 20, data.length);
      writeUint32(centralView, 24, data.length);
      writeUint16(centralView, 28, nameBytes.length);
      writeUint16(centralView, 30, 0);
      writeUint16(centralView, 32, 0);
      writeUint16(centralView, 34, 0);
      writeUint16(centralView, 36, 0);
      writeUint32(centralView, 38, 0);
      writeUint32(centralView, 42, localOffset);
      centralHeader.set(nameBytes, 46);
      centralParts.push(centralHeader);
      localOffset += localHeader.length + data.length;
    }

    const localData = concatBytes(localParts);
    const centralData = concatBytes(centralParts);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    writeUint32(endView, 0, 0x06054b50);
    writeUint16(endView, 4, 0);
    writeUint16(endView, 6, 0);
    writeUint16(endView, 8, files.length);
    writeUint16(endView, 10, files.length);
    writeUint32(endView, 12, centralData.length);
    writeUint32(endView, 16, localData.length);
    writeUint16(endView, 20, 0);
    return concatBytes([localData, centralData, end]);
  }

  function textFile(text) {
    return new TextEncoder().encode(text.replace(/\r?\n/g, "\n"));
  }

  function buildPackage() {
    const stl = buildBinaryStl();
    const root = `Workshop-Test-Plate-v${VERSION}/`;
    const validation = {
      productId: PRODUCT_ID,
      version: VERSION,
      geometry: {
        watertightByConstruction: true,
        consistentWindingByConstruction: true,
        connectedSolid: true,
        triangleCount: stl.triangleCount,
        boundsMillimeters: stl.bounds,
        grid: stl.grid,
        featureCount: stl.featureCount
      },
      physicalValidation: false,
      note: "The digital mesh is generated as one closed heightfield solid. A real resin print and post-cure inspection are still pending."
    };

    const readme = `# Wilkinson Workshop Test Plate v${VERSION}\n\nA free digital beta for comparing raised and recessed detail, square post and recess clearance, relief height, and repeated texture fields before committing to a larger resin print.\n\n## Nominal size\n\n- 60 mm wide\n- 40 mm deep\n- 2.0 mm base thickness\n- 2.8 mm maximum height\n\n## Suggested first print\n\n1. Confirm the import is 60 x 40 mm.\n2. Print feature side up.\n3. Start with 0.05 mm layers and an already functional resin profile.\n4. Keep wash and cure time consistent.\n5. Record one change at a time in Print-Log.csv.\n\n## Beta status\n\nThe digital mesh is watertight by construction and has consistent triangle winding. Physical resin printing, washing, curing, and measurement are still pending.\n\n## Feedback\n\nEmail stephen@stephenwilkinson.dev with the printer, resin, layer height, exposure, wash, cure, and photographs of the result.\n`;

    const license = `WILKINSON WORKSHOP PERSONAL USE LICENSE\nVersion 1.0\n\nCopyright (c) 2026 Stephen Wilkinson. All rights reserved.\n\nYou may download, print, and modify this product for personal, noncommercial hobby use.\n\nYou may not redistribute, sell, sublicense, publish, or share the digital files or modified digital files. You may not sell physical prints without separate written commercial permission.\n\nThis product is provided as-is without warranty. You are responsible for safe printer operation, resin handling, ventilation, washing, curing, and disposal.\n`;

    const printLog = "date,printer,resin,layer_height_mm,normal_exposure_s,bottom_exposure_s,lift_settings,wash_time_min,cure_time_min,result,notes\n";
    const source = `/*\n * Wilkinson Workshop Test Plate v${VERSION}\n * The production STL is generated in the browser from a piecewise-constant\n * heightfield. Edit workshop/assets/workshop-product-generator.js in the\n * public source repository to change feature rectangles and regenerate it.\n * Product page: https://stephenwilkinson.dev/workshop/original-files/workshop-test-plate/\n */\n`;
    const manifest = {
      productId: PRODUCT_ID,
      name: "Workshop Test Plate",
      version: VERSION,
      price: "free",
      license: "personal use",
      generatedAt: "2026-08-09T12:00:00-04:00",
      physicalValidation: false,
      includedFiles: [
        `${root}STL/Workshop-Test-Plate-v${VERSION}.stl`,
        `${root}Source/Workshop-Test-Plate-v${VERSION}.js`,
        `${root}README.md`,
        `${root}LICENSE.txt`,
        `${root}Print-Log.csv`,
        `${root}VALIDATION.json`,
        `${root}MANIFEST.json`
      ]
    };

    const files = [
      { name: `${root}STL/Workshop-Test-Plate-v${VERSION}.stl`, bytes: stl.bytes },
      { name: `${root}Source/Workshop-Test-Plate-v${VERSION}.js`, bytes: textFile(source) },
      { name: `${root}README.md`, bytes: textFile(readme) },
      { name: `${root}LICENSE.txt`, bytes: textFile(license) },
      { name: `${root}Print-Log.csv`, bytes: textFile(printLog) },
      { name: `${root}VALIDATION.json`, bytes: textFile(`${JSON.stringify(validation, null, 2)}\n`) },
      { name: `${root}MANIFEST.json`, bytes: textFile(`${JSON.stringify(manifest, null, 2)}\n`) }
    ];

    return {
      productId: PRODUCT_ID,
      version: VERSION,
      fileName: `Workshop-Test-Plate-v${VERSION}.zip`,
      mimeType: "application/zip",
      bytes: makeZip(files),
      stl,
      validation,
      manifest
    };
  }

  const api = { buildPackage, buildBinaryStl, productId: PRODUCT_ID, version: VERSION };
  global.WORKSHOP_PRODUCT_PACKAGES = global.WORKSHOP_PRODUCT_PACKAGES || {};
  global.WORKSHOP_PRODUCT_PACKAGES[PRODUCT_ID] = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
