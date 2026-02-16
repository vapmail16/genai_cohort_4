# MCP Demo UI (simple demo)

A **simple web frontend** to demo the **utility-tools** MCP server: list tools and call them from the browser (no Claude Desktop required). Best for the **small** project (calculator, greet, get-time).

For the **large** project (knowledge base), use the **proper app** instead: [../knowledge-base-app/README.md](../knowledge-base-app/README.md) — list, search, create, and edit articles in a full UI.

## What it does

1. Spawns an MCP server (utility-tools-server or knowledge-base-server) as a subprocess.
2. Connects to it as an MCP client and fetches the list of tools.
3. Serves a simple web page where you can fill in arguments and click **Call** for each tool.
4. Shows the tool result (or error) on the page.

Use this when you want to **demo tool behaviour** in a classroom without each student installing Claude Desktop.

## Prerequisites

- Node.js 18+
- The MCP server you want to demo must have its dependencies installed (`npm install` in that server folder).

## Quick start

**1. Install the demo UI and the server you want to demo:**

```bash
cd mcp/demo-ui && npm install
cd ../utility-tools-server && npm install
# or for knowledge base: cd ../knowledge-base-server && npm install
```

**2. Run the demo (pick one server):**

```bash
cd mcp/demo-ui

# Utility tools server (calculator, greet, get-time)
npm run demo:utility

# Knowledge base server (search, create, update, list articles)
npm run demo:knowledge
```

**3. Open in the browser:**

```
http://localhost:3000
```

You’ll see each tool with a form. Fill the inputs and click **Call** to run the tool and see the result.

## Alternative: MCP Inspector

For debugging or exploring tools without a custom UI, use the official **MCP Inspector** (web UI that lists tools and lets you call them):

```bash
cd mcp/utility-tools-server
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

Or for the knowledge base server:

```bash
cd mcp/knowledge-base-server
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

## Environment

- `DEMO_SERVER` — which server to spawn: `utility-tools-server` (default) or `knowledge-base-server`.
- `PORT` — HTTP port for the demo UI (default `3000`).

On Windows, set the env before running Node, e.g.:

```cmd
set DEMO_SERVER=knowledge-base-server
node server.js
```

## No AI in this UI

This UI does **not** use an AI to choose tools. You pick the tool and arguments yourself. To show **AI deciding which tool to use**, use **Claude Desktop** with the same MCP servers (see each server’s README for config).
