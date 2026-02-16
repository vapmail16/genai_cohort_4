# Knowledge Base App

A **proper web application** for the knowledge base: list articles, search, create, and edit — with a real UI. It uses the MCP knowledge-base server under the hood (spawns it, connects as client, reads resources and calls tools).

## What it is

- **Backend**: Express server that spawns the MCP knowledge-base server, connects as an MCP client, and exposes a REST API:
  - `GET /api/articles` — list (optional `?q=...` and `?status=...`)
  - `GET /api/articles/:id` — get one article
  - `POST /api/articles` — create
  - `PUT /api/articles/:id` — update
- **Frontend**: Single-page app with:
  - Article list with search and status filter
  - Article detail view (read)
  - New article form
  - Edit article form

Use this when you want to **demo the knowledge base as a real app** to students (not just “call tools from a form”).

## Prerequisites

- Node.js 18+
- The **knowledge-base-server** must have its dependencies installed (`npm install` in that folder).

## Quick start

```bash
cd mcp/knowledge-base-server && npm install
cd ../knowledge-base-app && npm install
cd knowledge-base-app && npm start
```

Open **http://localhost:3001** (or the port shown in the console).

## Port

Default port is **3001** so it doesn’t clash with the simple demo UI (3000). Set `PORT` to change it.

## Flow

1. The app backend starts and spawns the MCP knowledge-base server as a subprocess.
2. It connects to it as an MCP client and uses:
   - **Resources** for list and get: `kb://catalog`, `kb://article/{id}`
   - **Tools** for create and update: `create-article`, `update-article`
3. The frontend talks to the app’s REST API and renders list, detail, and forms.

So the same MCP server is used by:
- **This app** (human-facing UI)
- **Claude Desktop** or other MCP clients (AI agent)
