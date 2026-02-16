# MCP Utility Tools Server

An MCP (Model Context Protocol) server that exposes **utility tools** and **resources** over stdio: calculator, greeting, and current time.

## What it represents

- **Tools**: `greet`, `get-time`, `calculate` (add/subtract/multiply/divide)
- **Resources**: server info (`info://server`), calculator operations list (`calc://operations`), calculation history (`calc://history`)
- **Zod** input validation for tool parameters
- **Stdio transport** for use with Claude Desktop or MCP Inspector

## AI agents angle

**These servers do not contain an AI.** They only **expose** tools and resources.

The **AI agent** is the **MCP client** that connects to this server—for example **Claude Desktop** or another LLM application. That client:

1. **Discovers** the tools and resources (names, descriptions, input schemas)
2. **Decides** which tool to call based on the user’s message
3. **Calls** the tool with the right arguments and shows the result

When you add this server to Claude Desktop, **Claude is the agent**: it reads tool descriptions (e.g. “Use when the user asks to calculate something”), chooses `calculate` for “What is 7 times 8?” and `get-time` for “What time is it in Tokyo?”, and invokes them. This server is the **capability layer** the agent uses; the agent logic lives in the client.

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

The server runs on stdio (stdin/stdout). Use with:

- **Claude Desktop**: Add to `claude_desktop_config.json`:
  ```json
  {
    "mcpServers": {
      "mcp-utility-tools-server": {
        "command": "npx",
        "args": ["tsx", "src/index.ts"],
        "cwd": "/absolute/path/to/mcp/utility-tools-server"
      }
    }
  }
  ```
- **MCP Inspector**: `npx @modelcontextprotocol/inspector npx tsx src/index.ts`
- **Demo UI (web)**: From `mcp/demo-ui` run `npm run demo:utility`, then open http://localhost:3000 — see [../demo-ui/README.md](../demo-ui/README.md)

## Tools

| Tool         | Description |
|-------------|-------------|
| `greet`     | Generate a greeting (formal/casual/enthusiastic) for a name |
| `get-time`  | Current date/time in a given timezone (short or long format) |
| `calculate` | Basic math: add, subtract, multiply, divide (with division-by-zero handling) |

## Resources

| URI              | Description |
|------------------|-------------|
| `info://server`  | Server name, version, list of tools |
| `calc://operations` | Supported calculator operations |
| `calc://history` | Last 10 calculations |

## Project layout

```
utility-tools-server/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    └── index.ts   # Single-file server: tools + resources
```
