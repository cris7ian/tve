import assert from "node:assert/strict";
import test from "node:test";

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

test("renders the TVE live stream experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="es">/i);
  assert.match(html, /<title>TVE en directo<\/title>/i);
  assert.match(html, /youtube-nocookie\.com\/embed\/b4tE5aKhtlg/);
  assert.match(html, /autoplay=1/);
  assert.match(html, /controls=0/);
  assert.match(html, /disablekb=1/);
  assert.match(html, /enablejsapi=1/);
  assert.match(html, /aria-label="Reproducir TVE"/i);
  assert.equal(html.match(/<button\b/gi)?.length, 1);
  assert.doesNotMatch(html, /<form\b/i);
  assert.doesNotMatch(html, /allowFullScreen|allowfullscreen/i);
  assert.doesNotMatch(html, /href="https:\/\/www\.youtube\.com\/watch/);
  assert.match(html, /manifest\.webmanifest/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview/);
});
