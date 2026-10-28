/**
 * Headless check for the four pages that slipped through on the live site.
 * Fails when a page scrolls sideways, or when SVG text draws outside its node.
 * Screenshots land in --out (default artifacts/visual).
 *
 *   node scripts/visual-check.mjs
 *   node scripts/visual-check.mjs --base https://openendo.org --out artifacts/before --shots-only
 */
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join, normalize, resolve } from "node:path";

const args = process.argv.slice(2);
const shotsOnly = args.includes("--shots-only");
const baseFlag = value("--base");
const outDir = resolve(value("--out") ?? "artifacts/visual");
const root = resolve(".output/public");

const PAGES = [
  { path: "/", name: "home", h1: [40, 52] },
  { path: "/learn/how-it-works", name: "how", h1: [34, 44] },
  { path: "/access", name: "access", h1: [34, 44] },
  { path: "/learn/managing-symptoms", name: "symptoms", h1: [34, 44] },
];
const WIDTHS = [375, 768, 1024, 1440];
const SHOT_WIDTHS = new Set([375, 1440]);

const INSPECT = `(() => {
  const root = document.documentElement;
  const pageOverflow = root.scrollWidth > root.clientWidth + 1;
  const wide = [];
  for (const el of document.querySelectorAll("body *")) {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    if (style.position === "fixed") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    if (rect.right <= root.clientWidth + 1 && rect.left >= -1) continue;
    const childOverflows = [...el.children].some((child) => {
      const box = child.getBoundingClientRect();
      return box.right > root.clientWidth + 1 || box.left < -1;
    });
    if (childOverflows) continue;
    const label = (el.innerText || el.textContent || el.tagName).trim().replace(/\\s+/g, " ").slice(0, 80);
    wide.push(label || el.tagName);
    if (wide.length >= 6) break;
  }
  const svgFails = [];
  for (const text of document.querySelectorAll("svg text")) {
    let box;
    try {
      box = text.getBBox();
    } catch {
      continue;
    }
    const svg = text.ownerSVGElement;
    if (!svg) continue;
    const vb = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width ? svg.viewBox.baseVal : null;
    const width = vb ? vb.width : Number(svg.getAttribute("width")) || 0;
    const height = vb ? vb.height : Number(svg.getAttribute("height")) || 0;
    const ox = vb ? vb.x : 0;
    const oy = vb ? vb.y : 0;
    const label = (text.textContent || "").trim().slice(0, 60);
    if (width && height) {
      const outside =
        box.x < ox - 1 ||
        box.y < oy - 1 ||
        box.x + box.width > ox + width + 1 ||
        box.y + box.height > oy + height + 1;
      if (outside) svgFails.push(label || "svg text");
    }
    const rect = text.parentElement && text.parentElement.querySelector("rect");
    if (rect) {
      const node = rect.getBBox();
      const clip =
        box.x < node.x - 1 ||
        box.y < node.y - 1 ||
        box.x + box.width > node.x + node.width + 1 ||
        box.y + box.height > node.y + node.height + 1;
      if (clip) svgFails.push("node:" + (label || "svg text"));
    }
  }
  const h1 = document.querySelector("h1");
  const h1Size = h1 ? Number.parseFloat(getComputedStyle(h1).fontSize) : 0;
  return {
    pageOverflow,
    scrollWidth: root.scrollWidth,
    clientWidth: root.clientWidth,
    wide,
    svgFails,
    h1Size,
    text: document.body.innerText,
    html: document.documentElement.innerHTML,
  };
})()`;

function value(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

function chromePath() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH))
    return process.env.CHROME_PATH;
  for (const candidate of [
    "/usr/bin/google-chrome",
    "/usr/local/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error("Chrome not found. Set CHROME_PATH.");
}

function startServer() {
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".png": "image/png",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
  };
  return new Promise((resolveServer, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url ?? "/", "http://127.0.0.1");
        let pathname = decodeURIComponent(url.pathname);
        const candidates = [];
        const rel = pathname.replace(/^\/+/, "");
        if (pathname.endsWith("/")) candidates.push(`${rel}index.html`);
        else {
          candidates.push(rel);
          candidates.push(`${rel}/index.html`);
          candidates.push(`${rel}.html`);
        }
        let body = null;
        let file = "";
        for (const candidate of candidates) {
          const next = normalize(join(root, candidate));
          if (!next.startsWith(root)) continue;
          try {
            body = await readFile(next);
            file = next;
            break;
          } catch {
            /* try the next candidate */
          }
        }
        if (!body || !file) {
          res.writeHead(404);
          res.end("not found");
          return;
        }
        res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
        res.end(body);
      } catch (error) {
        res.writeHead(500);
        res.end(String(error));
      }
    });
    server.listen(0, "127.0.0.1", () => resolveServer(server));
    server.on("error", reject);
  });
}

async function debuggerUrl(port) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        const json = await res.json();
        return json.webSocketDebuggerUrl;
      }
    } catch {
      /* chrome is still starting */
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
  }
  throw new Error("Chrome did not open a debugger port");
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let seq = 0;
  const pending = new Map();
  const waits = new Map();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve: done, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else done(message.result);
      return;
    }
    if (message.method) {
      const list = waits.get(message.method) ?? [];
      waits.set(message.method, []);
      for (const done of list) done(message.params);
    }
  });
  function send(method, params = {}) {
    const id = ++seq;
    return new Promise((done, reject) => {
      pending.set(id, { resolve: done, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  function waitEvent(method, timeout = 20000) {
    return new Promise((done, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), timeout);
      const list = waits.get(method) ?? [];
      list.push((params) => {
        clearTimeout(timer);
        done(params);
      });
      waits.set(method, list);
    });
  }
  return new Promise((done, reject) => {
    ws.addEventListener("open", () => done({ send, waitEvent, ws }));
    ws.addEventListener("error", () => reject(new Error("chrome socket failed")));
  });
}

function contentProblems(page, report) {
  const problems = [];
  const { h1Size, text, html, pageOverflow, wide, svgFails, scrollWidth, clientWidth } = report;
  if (h1Size < page.h1[0] - 0.5 || h1Size > page.h1[1] + 0.5) {
    problems.push(`h1 is ${h1Size}px, expected ${page.h1[0]}–${page.h1[1]}`);
  }
  if (pageOverflow || wide.length > 0) {
    problems.push(
      `horizontal overflow ${scrollWidth} > ${clientWidth}${wide.length ? `: ${wide.join(" | ")}` : ""}`,
    );
  }
  if (svgFails.length > 0) problems.push(`SVG text overflows its node: ${svgFails.join(" | ")}`);
  if (page.name === "home" && text.includes("and no circulating or")) {
    problems.push("research headline is cut mid-sentence");
  }
  if (page.name === "access") {
    if (/READ THIS FIRST/i.test(text)) problems.push("READ THIS FIRST box is still on the page");
    if (/Data updated/i.test(text)) problems.push("file updated date is still on the page");
    if (/7 Sep 2026/.test(text)) problems.push("7 Sep 2026 contradicts the review date");
    if (!text.includes("28 Oct 2026")) problems.push("reviewed date 28 Oct 2026 is missing");
    if (/unverified placeholder/i.test(text))
      problems.push("placeholder label is still on the page");
    if (!html.includes("<details")) problems.push("About this data is not a collapsed section");
    if (!html.includes("OpenEndo access.json"))
      problems.push("access.json provenance link is missing");
  }
  if (page.name === "symptoms") {
    if (/NICE says/i.test(text)) problems.push("a sentence still starts with NICE says");
    if (/ESHRE says/i.test(text)) problems.push("a sentence still starts with ESHRE says");
    if (/WHO says/i.test(text)) problems.push("a sentence still starts with WHO says");
  }
  return problems;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  let server = null;
  let origin = baseFlag?.replace(/\/$/, "");
  if (!origin) {
    if (!existsSync(join(root, "index.html"))) {
      throw new Error("Missing .output/public. Run npm run build first.");
    }
    server = await startServer();
    const address = server.address();
    origin = `http://127.0.0.1:${address.port}`;
  }

  const port = 9400 + Math.floor(Math.random() * 500);
  const userData = await mkdtemp(join(tmpdir(), "oe-chrome-"));
  const chrome = spawn(
    chromePath(),
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userData}`,
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  const failures = [];
  try {
    const version = await debuggerUrl(port);
    const browser = await connect(version);
    const { targetId } = await browser.send("Target.createTarget", { url: "about:blank" });
    const { webSocketDebuggerUrl } = await (
      await fetch(`http://127.0.0.1:${port}/json/list`)
    )
      .json()
      .then((list) => list.find((item) => item.id === targetId));
    const pageSocket = await connect(webSocketDebuggerUrl);
    await pageSocket.send("Page.enable");
    await pageSocket.send("Runtime.enable");

    for (const width of WIDTHS) {
      await pageSocket.send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 1200,
        deviceScaleFactor: 1,
        mobile: width < 500,
      });
      for (const page of PAGES) {
        const loaded = pageSocket.waitEvent("Page.loadEventFired");
        await pageSocket.send("Page.navigate", { url: `${origin}${page.path}` });
        await loaded;
        await pageSocket.send("Runtime.evaluate", {
          expression: "document.fonts.ready",
          awaitPromise: true,
        });
        const evaluated = await pageSocket.send("Runtime.evaluate", {
          expression: INSPECT,
          returnByValue: true,
        });
        const report = evaluated.result?.value;
        if (!report) {
          failures.push(`${page.name} ${width}: page did not return a report`);
          continue;
        }
        if (report.text.includes("not found") && report.h1Size === 0) {
          failures.push(`${page.name} ${width}: page did not render (${page.path})`);
          continue;
        }
        for (const problem of contentProblems(page, report)) {
          failures.push(`${page.name} ${width}: ${problem}`);
        }
        if (SHOT_WIDTHS.has(width)) {
          const metrics = await pageSocket.send("Page.getLayoutMetrics");
          const size = metrics.cssContentSize ?? metrics.contentSize;
          const shot = await pageSocket.send("Page.captureScreenshot", {
            format: "png",
            captureBeyondViewport: true,
            clip: {
              x: 0,
              y: 0,
              width,
              height: Math.min(size?.height ?? 1200, 4200),
              scale: 1,
            },
          });
          const file = join(outDir, `${page.name}-${width}.png`);
          await writeFile(file, Buffer.from(shot.data, "base64"));
          console.log(`wrote ${file} h1=${report.h1Size}px`);
        }
      }
    }
    browser.ws.close();
    pageSocket.ws.close();
  } finally {
    chrome.kill("SIGKILL");
    if (server) server.close();
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 200));
    await rm(userData, { recursive: true, force: true }).catch(() => {});
  }

  if (failures.length > 0) {
    console.error(failures.map((line) => `- ${line}`).join("\n"));
    if (!shotsOnly) process.exitCode = 1;
    return;
  }
  console.log("visual check passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
