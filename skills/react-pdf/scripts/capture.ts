import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "canvas";
import * as fs from "fs";
import * as path from "path";

// Suppress pdf.js warnings
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const msg = String(args[0]);
  if (msg.includes("UnknownErrorException") || msg.includes("standardFontDataUrl")) {
    return;
  }
  originalWarn.apply(console, args);
};


async function getPdfInfo(pdfPath: string) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await getDocument({ data }).promise;

  console.log(`\nFile: ${path.basename(pdfPath)}`);
  console.log(`Pages: ${pdf.numPages}`);

  // Get metadata
  const metadata = await pdf.getMetadata();
  if (metadata.info) {
    const info = metadata.info as Record<string, unknown>;
    if (info.Title) console.log(`Title: ${info.Title}`);
    if (info.Author) console.log(`Author: ${info.Author}`);
    if (info.Subject) console.log(`Subject: ${info.Subject}`);
    if (info.Creator) console.log(`Creator: ${info.Creator}`);
    if (info.Producer) console.log(`Producer: ${info.Producer}`);
    if (info.CreationDate) console.log(`Created: ${info.CreationDate}`);
    if (info.ModDate) console.log(`Modified: ${info.ModDate}`);
  }

  // List page dimensions
  console.log(`\nPage dimensions:`);
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    console.log(
      `  Page ${i}: ${Math.round(viewport.width)} x ${Math.round(viewport.height)} pt`
    );
  }

  await pdf.destroy();
}

async function capturePages(
  pdfPath: string,
  pageNums: number[],
  outputPattern: string
) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await getDocument({ data }).promise;

  for (const pageNum of pageNums) {
    if (pageNum < 1 || pageNum > pdf.numPages) {
      console.error(
        `Error: Page ${pageNum} does not exist. PDF has ${pdf.numPages} pages.`
      );
      continue;
    }

    const page = await pdf.getPage(pageNum);

    const scale = 1.0;
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext("2d");

    // @ts-expect-error - pdfjs render context types don't match node-canvas
    await page.render({ canvasContext: context, viewport }).promise;

    // Generate output path for this page
    const outputPath = pageNums.length > 1
      ? outputPattern.replace(/(\.[^.]+)$/, `-${pageNum}$1`)
      : outputPattern;

    // Determine format from extension
    const ext = path.extname(outputPath).toLowerCase();
    let buffer: Buffer;

    if (ext === ".png") {
      buffer = canvas.toBuffer("image/png");
    } else if (ext === ".jpg" || ext === ".jpeg") {
      buffer = canvas.toBuffer("image/jpeg", { quality: 0.9 });
    } else {
      // Default to PNG
      buffer = canvas.toBuffer("image/png");
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(
      `Captured page ${pageNum} to ${outputPath} (${Math.round(viewport.width)}x${Math.round(viewport.height)}px)`
    );
  }

  await pdf.destroy();
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`Usage:
  npx tsx capture.ts <pdf_file>                    - Show PDF info and pages
  npx tsx capture.ts <pdf_file> <pages> <output>  - Capture page(s) as image

Examples:
  npx tsx capture.ts document.pdf
  npx tsx capture.ts document.pdf 1 page.png
  npx tsx capture.ts document.pdf 1,2,3 pages.png`);
    process.exit(0);
  }

  const pdfPath = args[0];

  if (!fs.existsSync(pdfPath)) {
    console.error(`Error: File not found: ${pdfPath}`);
    process.exit(1);
  }

  if (args.length === 1) {
    // Just show info
    await getPdfInfo(pdfPath);
  } else if (args.length >= 3) {
    // Parse page numbers (supports comma-separated like 1,2,3)
    const pageNums = args[1].split(",").map((p) => parseInt(p.trim(), 10));
    if (pageNums.some(isNaN)) {
      console.error(`Error: Invalid page number(s): ${args[1]}`);
      process.exit(1);
    }
    const outputPath = args[2];
    await capturePages(pdfPath, pageNums, outputPath);
  } else {
    console.error("Error: Please provide both page number(s) and output file");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
