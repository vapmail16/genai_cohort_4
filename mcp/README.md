# MCP (Model Context Protocol) — Demos & Course Material

This folder contains MCP course material and **two runnable MCP server projects**, named for what they represent.

## Server projects

| Project | What it represents |
|---------|--------------------|
| **[utility-tools-server](./utility-tools-server/)** | MCP server that exposes **utility tools**: calculator, greet, get-time, plus server info and calculator resources. Single file, minimal. |
| **[knowledge-base-server](./knowledge-base-server/)** | MCP server that exposes a **knowledge base**: search, create, update, list articles, plus catalog and article-by-ID resources. In-memory store, no database. |
| **[demo-ui](./demo-ui/)** | **Simple demo UI** for the **utility-tools** server: spawns the server, lists tools, lets you call them from the browser. Good for a quick classroom demo. |
| **[knowledge-base-app](./knowledge-base-app/)** | **Proper app** for the **knowledge base**: full web UI with list, search, create, and edit articles. Uses the MCP knowledge-base server under the hood. Use this to demo the large project as a real application. |

Both use the official **@modelcontextprotocol/sdk** (TypeScript), **Zod** for validation, and **stdio** transport (Claude Desktop / MCP Inspector).

## AI agents angle

**The servers do not contain AI agents.** They only expose tools and resources.

The **AI agent** is the **MCP client** that connects to them—e.g. **Claude Desktop** or another LLM app. The client:

- **Discovers** tools and resources (names, descriptions, schemas)
- **Decides** which tool to call from the user’s message
- **Calls** tools and reads resources, then responds

So the “agent” (who decides what to do) is the client; these servers are the **capability layer** the agent uses. When you add either server to Claude Desktop, Claude is the agent that chooses and invokes the tools.

## How to demo to students

- **Small one (utility tools)** — use the **simple demo UI**: spawn the server, list tools, call them from the browser.
- **Large one (knowledge base)** — use the **proper app**: full web UI (list, search, create, edit articles).

### 1. Simple demo (utility-tools server)

```bash
cd mcp/demo-ui && npm install
cd ../utility-tools-server && npm install
cd mcp/demo-ui && npm run demo:utility
# Open http://localhost:3000
```

See **[demo-ui/README.md](./demo-ui/README.md)**.

### 2. Proper app (knowledge base)

```bash
cd mcp/knowledge-base-server && npm install
cd ../knowledge-base-app && npm install && npm start
# Open http://localhost:3001
```

See **[knowledge-base-app/README.md](./knowledge-base-app/README.md)**.

### 3. MCP Inspector (official debug UI)

Official tool to list and call tools (and resources) in a web UI:

```bash
cd mcp/utility-tools-server
npx @modelcontextprotocol/inspector npx tsx src/index.ts
# Opens a browser; list tools and call them there
```

### 4. Claude Desktop (AI agent deciding which tool to use)

To show **the AI choosing** which tool to call, add either server to Claude Desktop (see each server’s README for config). Then students chat in natural language and Claude calls the right tool.

---

## Quick start (run servers only)

```bash
# Utility tools server (calculator, greet, get-time)
cd mcp/utility-tools-server && npm install && npm run dev

# Knowledge base server (separate terminal)
cd mcp/knowledge-base-server && npm install && npm run dev
```

See each project’s README for tools, resources, Claude Desktop config, and the AI agent angle.

## Course content (reference)

- **course outline** — Lean 9-hour course outline (6 sections, 45 lectures).
- **Session 1–6** — Dry-run / lecture content for each section (Why MCP, First Server, Knowledge Base, API Wrapping, Production, Capstone).

These are reference materials only; the two server projects above are self-contained and runnable.
