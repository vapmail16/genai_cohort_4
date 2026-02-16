/**
 * Demo UI backend: spawns an MCP server, connects as MCP client, exposes REST API + serves HTML.
 * Run: DEMO_SERVER=utility-tools-server node server.js  (or knowledge-base-server)
 * Then open http://localhost:3000
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_ROOT = path.resolve(__dirname, "..");
const SERVER_NAME = process.env.DEMO_SERVER || "utility-tools-server";
const SERVER_PATH = path.join(MCP_ROOT, SERVER_NAME);
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
    { name: "demo-ui-client", version: "1.0.0" },
    { capabilities: {} }
  );
  await client.connect(transport);
  return client;
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/server", (req, res) => {
  res.json({ name: SERVER_NAME, path: SERVER_PATH });
});

app.get("/api/tools", async (req, res) => {
  try {
    const c = await ensureConnected();
    const result = await c.listTools();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/call", async (req, res) => {
  const { name, arguments: args } = req.body || {};
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Missing tool name" });
  }
  try {
    const c = await ensureConnected();
    const result = await c.callTool({ name, arguments: args || {} });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.error(`Demo UI: http://localhost:${PORT}`);
  console.error(`MCP server: ${SERVER_NAME} (from ${SERVER_PATH})`);
});
