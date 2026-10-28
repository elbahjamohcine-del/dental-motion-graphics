// Renders the Instagram carousels (carousels/posts.mjs) to PNG, 1080 × 1350.
//   npm run carousels              → every post
//   npm run carousels -- 02        → only posts whose id contains "02"
// Output: carousels/export/<post>/slide-N.png + overview.jpg per post,
// and carousels/export/overview.jpg with all four posts.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { root } from "./shared.mjs";
import { brand, posts } from "../carousels/posts.mjs";
import { renderSlide } from "../carousels/template.mjs";

const W = 1080;
const H = 1350;
const filter = process.argv[2];
const htmlDir = path.join(root, "out/carousels");
const exportDir = path.join(root, "carousels/export");

// Fonts are the same bundled @fontsource files the videos use.
const fontCss = ["cairo/600", "cairo/700", "cairo/800", "tajawal/400", "tajawal/500", "tajawal/700"]
  .map((f) => `<link rel="stylesheet" href="${pathToFileURL(path.join(root, "node_modules/@fontsource", `${f}.css`)).href}">`)
  .join("\n");

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: W, height: H } });

const shoot = async (html, file, type = "png") => {
  const htmlFile = path.join(htmlDir, path.relative(exportDir, file).replace(/\.(png|jpg)$/, ".html"));
  fs.mkdirSync(path.dirname(htmlFile), { recursive: true });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(htmlFile, html);
  await page.goto(pathToFileURL(htmlFile).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, type, ...(type === "jpg" || type === "jpeg" ? { quality: 88 } : {}), fullPage: false });
};

// Fails loudly if any text overflows its slide (keeps the layout honest).
const checkOverflow = () =>
  page.evaluate(() => {
    const main = document.querySelector("main");
    const footer = document.querySelector(".bottom");
    const issues = [];
    if (main.scrollHeight > main.clientHeight + 1) issues.push(`main overflows by ${main.scrollHeight - main.clientHeight}px`);
    for (const el of main.querySelectorAll("*")) {
      if (el.ownerSVGElement) continue; // SVG internals may be clipped on purpose
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > 1080 - 40 || r.left < 40)) issues.push(`${el.className || el.tagName} outside side margin`);
      if (r.height && r.bottom > footer.getBoundingClientRect().top + 1) issues.push(`${el.className || el.tagName} overlaps footer`);
    }
    return [...new Set(issues)];
  });

const sheet = (images, cols, scale) => `<!doctype html><html><body style="margin:0;background:#E9EEF2">
<div style="display:grid;grid-template-columns:repeat(${cols},${W * scale}px);gap:24px;padding:24px;direction:rtl">
${images.map((src) => `<img src="${src}" style="width:${W * scale}px;height:${H * scale}px;border-radius:14px;box-shadow:0 4px 18px rgba(11,37,69,.12)">`).join("")}
</div></body></html>`;

let problems = 0;
const allSlides = [];
for (const post of posts.filter((p) => !filter || p.id.includes(filter))) {
  const files = [];
  for (const [index, slide] of post.slides.entries()) {
    const file = path.join(exportDir, post.id, `slide-${index + 1}.png`);
    await shoot(renderSlide({ post, slide, index, total: post.slides.length, brand, fontCss }), file);
    const issues = await checkOverflow();
    if (issues.length) {
      problems++;
      console.warn(`⚠ ${post.id} slide ${index + 1}: ${issues.join("; ")}`);
    }
    files.push(file);
    console.log(`✓ ${path.relative(root, file)}`);
  }
  allSlides.push(files);
  // Contact sheet of the post, in reading order (right to left).
  const s = 0.36;
  await page.setViewportSize({ width: Math.round(5 * W * s + 6 * 24), height: Math.round(H * s + 48) });
  await shoot(sheet(files.map((f) => pathToFileURL(f).href), 5, s), path.join(exportDir, post.id, "overview.jpg"), "jpeg");
  await page.setViewportSize({ width: W, height: H });
}

if (!filter) {
  const s = 0.3;
  await page.setViewportSize({ width: Math.round(5 * W * s + 6 * 24), height: Math.round(allSlides.length * (H * s + 24) + 24) });
  await shoot(sheet(allSlides.flat().map((f) => pathToFileURL(f).href), 5, s), path.join(exportDir, "overview.jpg"), "jpeg");
}

await browser.close();
if (problems) {
  console.error(`${problems} slide(s) with layout problems`);
  process.exit(1);
}
