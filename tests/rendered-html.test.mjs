import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const appRoot = new URL("../app/", import.meta.url);
const previewRoot = new URL("../app/_sites-preview/", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function readSourceTree(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const sources = [];

  for (const entry of entries) {
    const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);

    if (entry.isDirectory()) {
      sources.push(await readSourceTree(url));
    } else if (/\.(?:css|ts|tsx)$/.test(entry.name)) {
      sources.push(await readFile(url, "utf8"));
    }
  }

  return sources.join("\n");
}

function getMetaContent(html, name) {
  const tag = html
    .match(/<meta\b[^>]*>/gi)
    ?.find((candidate) =>
      new RegExp(`\\bname=["']${name}["']`, "i").test(candidate),
    );

  return tag?.match(/\bcontent=["']([^"']*)["']/i)?.[1] ?? "";
}

test("server-renders Chen Shaoji's finished portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const description = getMetaContent(html, "description");

  assert.match(
    html,
    /<title>[^<]*陈少极[^<]*Shaoji Chen[^<]*<\/title>/i,
  );
  assert.match(description, /陈少极/);
  assert.match(description, /厦门大学|Xiamen University/i);

  assert.match(html, /厦门大学本科生\s*·\s*信息与计算科学/);
  assert.match(
    html,
    /在数学与图形之间，探索清晰而有趣的数字表达。/,
  );
  assert.match(html, /href=["']mailto:hello@example\.com["']/i);
  assert.match(
    html,
    /href=["']https:\/\/github\.com\/Chensj1028\/?["']/i,
  );

  assert.doesNotMatch(html, /codex-preview|Building your site|SkeletonPreview/i);
  assert.doesNotMatch(
    html,
    /<section\b[^>]*(?:id|data-section)=["']projects?["']/i,
  );
  assert.doesNotMatch(html, /<a\b[^>]*\bdownload(?:\s|=|>)/i);
  assert.doesNotMatch(html, />\s*(?:精选项目|Projects|下载简历|Download Resume)\s*</i);
});

test("keeps bilingual, time-zone, and motion preferences in source", async () => {
  const [appSource, packageJson] = await Promise.all([
    readSourceTree(appRoot),
    readFile(new URL("package.json", projectRoot), "utf8"),
  ]);

  assert.match(appSource, /\b(?:copy|translations|content)\s*=\s*\{/i);
  assert.match(appSource, /\bzh\s*:\s*\{/);
  assert.match(appSource, /\ben\s*:\s*\{/);
  assert.match(appSource, /Asia\/Shanghai/);
  assert.match(appSource, /prefers-reduced-motion\s*:\s*reduce/i);

  assert.doesNotMatch(appSource, /SkeletonPreview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(previewRoot));
});
