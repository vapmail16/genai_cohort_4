# MCP Knowledge Base Server

An MCP (Model Context Protocol) server that exposes a **knowledge base** via tools and resources: search, create, update, list articles, plus a catalog and per-article resources.

## What it represents

- **Tools**: `search-articles`, `create-article`, `update-article`, `list-articles`
- **Resources**: article catalog (`kb://catalog`), article by ID (`kb://article/{id}`) via URI template
- **In-memory store** (no database) so the demo runs with no setup; replace with Prisma + PostgreSQL for production
- **Zod** validation and clear tool descriptions for the AI
- **Stdio transport** for Claude Desktop or MCP Inspector

## AI agents angle

**This server does not contain an AI.** It only **exposes** tools and resources.

The **AI agent** is the **MCP client** that connects to this server—for example **Claude Desktop** or another LLM application. That client:

1. **Discovers** the tools and resources (e.g. search-articles, create-article, kb://catalog)
2. **Decides** which tool to call from the user’s intent (e.g. “find articles about MCP” → `search-articles`, “add a new article” → `create-article`)
3. **Chains** tools when needed (e.g. search first to get an ID, then update-article)
4. **Reads** resources for context (e.g. kb://catalog before answering “what’s in the knowledge base?”)

When you add this server to Claude Desktop, **Claude is the agent**: it chooses which tool to use, fills in parameters from the conversation, and combines results. This server is the **capability layer** the agent uses; the agent logic lives in the client.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
# or: npx tsx src/index.ts
```

The server starts with a few demo articles so you can search and read immediately.

### Use with Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mcp-knowledge-base-server": {
      "command": "npx",
      "args": ["tsx", "src/index.ts"],
      "cwd": "/absolute/path/to/mcp/knowledge-base-server"
    }
  }
}
```

### Use with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

### Use with the proper Knowledge Base App (recommended for demos)

For a **full app** (list, search, create, edit articles) instead of a simple tool-caller form, use the dedicated app:

```bash
cd mcp/knowledge-base-app && npm install && npm start
# Open http://localhost:3001
```

See **[../knowledge-base-app/README.md](../knowledge-base-app/README.md)**.

### Use with simple Demo UI (tool-caller form)

From `mcp/demo-ui` run `npm run demo:knowledge`, then open http://localhost:3000. See [../demo-ui/README.md](../demo-ui/README.md).

## Tools

| Tool              | Description |
|-------------------|-------------|
| `search-articles` | Keyword search across title, content, tags. Optional status and tag filters. |
| `create-article` | Create a new article (title, content, summary, tags, author, status). Defaults to draft. |
| `update-article` | Update an article by ID (partial updates; use search-articles to get IDs). |
| `list-articles`  | List articles with optional status filter. |

## Resources

| URI                 | Description |
|---------------------|-------------|
| `kb://catalog`      | JSON list of all articles (id, title, summary, tags, status, updatedAt). |
| `kb://article/{id}` | JSON for a single article by ID (e.g. `kb://article/art-0001`). |

## Project layout

```
knowledge-base-server/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts   # Server: tools + resources
    └── store.ts   # In-memory article store (replace with DB in production)
```

## Extending

- **Database**: Replace `store.ts` with Prisma (or another client) and keep the same function signatures.
- **Semantic search**: Add an embeddings tool (e.g. OpenAI + pgvector) alongside keyword search.
- **Auth / audit**: Add authentication and audit logging as in the course Section 5.
