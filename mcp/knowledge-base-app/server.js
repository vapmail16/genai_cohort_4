/**
 * Knowledge Base App — backend
 * Spawns the MCP knowledge-base server, connects as client, exposes REST API for the app.
 * List/get articles via MCP resources; create/update via MCP tools.
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_PATH = path.resolve(__dirname, "..", "knowledge-base-server");
const SERVER_INDEX = path.join(SERVER_PATH, "src", "index.ts");

let client = null;
let transport = null;

async function ensureConnected() {
  if (client) return client;
  transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "src/index.ts"],
    cwd: SERVER_PATH,
  });
  client = new Client(
    { name: "knowledge-base-app", version: "1.0.0" },
    { capabilities: {} }
  );
  await client.connect(transport);
  return client;
}

function getTextFromToolResult(result) {
  const content = result?.content;
  if (Array.isArray(content) && content[0]?.text) return content[0].text;
  if (content?.text) return content.text;
  return "";
}

function parseIdFromCreateResponse(text) {
  const m = text.match(/\*\*ID:\*\*\s*(\S+)/);
  return m ? m[1].trim() : null;
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// GET /api/articles — list (from catalog resource)
app.get("/api/articles", async (req, res) => {
  try {
    const c = await ensureConnected();
    const result = await c.readResource({ uri: "kb://catalog" });
    const contents = result?.contents || [];
    const first = contents[0];
    if (!first?.text) return res.status(500).json({ error: "Empty catalog" });
    const data = JSON.parse(first.text);
    const { q, status, limit } = req.query;
    let articles = data.articles || [];
    if (q && String(q).trim()) {
      const qq = String(q).toLowerCase();
      articles = articles.filter(
        (a) =>
          (a.title || "").toLowerCase().includes(qq) ||
          (a.summary || "").toLowerCase().includes(qq) ||
          (a.tags || []).some((t) => t.toLowerCase().includes(qq))
      );
    }
    if (status && status !== "all") {
      articles = articles.filter((a) => a.status === status);
    }
    const lim = Math.min(Number(limit) || 50, 100);
    articles = articles.slice(0, lim);
    res.json({ articles, count: articles.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/articles/:id — single article (from resource)
app.get("/api/articles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const c = await ensureConnected();
    const result = await c.readResource({ uri: `kb://article/${id}` });
    const contents = result?.contents || [];
    const first = contents[0];
    if (!first?.text) return res.status(404).json({ error: "Article not found" });
    if (first.mimeType === "text/plain") return res.status(404).json({ error: first.text });
    res.json(JSON.parse(first.text));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/articles — create (call MCP tool, then read resource for full article)
app.post("/api/articles", async (req, res) => {
  const { title, content, summary, tags, author, status } = req.body || {};
  if (!title || !content || !tags || !Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ error: "title, content, and at least one tag required" });
  }
  try {
    const c = await ensureConnected();
    const result = await c.callTool({
      name: "create-article",
      arguments: {
        title: String(title).trim(),
        content: String(content).trim(),
        summary: summary ? String(summary).trim() : undefined,
        tags: tags.map((t) => String(t).trim()).filter(Boolean),
        author: author ? String(author).trim() : undefined,
        status: status || "draft",
      },
    });
    const text = getTextFromToolResult(result);
    const id = parseIdFromCreateResponse(text);
    if (!id) return res.status(500).json({ error: "Create succeeded but could not get article ID" });
    const articleResult = await c.readResource({ uri: `kb://article/${id}` });
    const artContents = articleResult?.contents || [];
    const artText = artContents[0]?.text;
    if (!artText) return res.status(201).json({ id, message: "Created" });
    res.status(201).json(JSON.parse(artText));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/articles/:id — update (call MCP tool, then read resource)
app.put("/api/articles/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, summary, tags, status } = req.body || {};
  try {
    const c = await ensureConnected();
    const args = { id };
    if (title !== undefined) args.title = String(title).trim();
    if (content !== undefined) args.content = String(content).trim();
    if (summary !== undefined) args.summary = String(summary).trim();
    if (tags !== undefined) args.tags = Array.isArray(tags) ? tags.map((t) => String(t).trim()).filter(Boolean) : undefined;
    if (status !== undefined) args.status = status;
    await c.callTool({ name: "update-article", arguments: args });
    const articleResult = await c.readResource({ uri: `kb://article/${id}` });
    const artContents = articleResult?.contents || [];
    const artText = artContents[0]?.text;
    if (!artText || artContents[0]?.mimeType === "text/plain") return res.status(404).json({ error: "Article not found" });
    res.json(JSON.parse(artText));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.error(`Knowledge Base App: http://localhost:${PORT}`);
  console.error("(MCP knowledge-base-server runs as subprocess)");
});
