/**
 * MCP Utility Tools Server — Calculator + Greet + Get-Time tools and resources
 * Demonstrates: tools, Zod validation, static and templated resources, stdio transport.
 * The AI agent (MCP client, e.g. Claude) discovers these tools and decides which to call.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "mcp-utility-tools-server",
  version: "1.0.0",
});

// ——— Tool: Greet ———
server.tool(
  "greet",
  "Generate a personalised greeting. Use when the user wants to say hello or welcome someone.",
  {
    name: z.string().describe("The person's name"),
    style: z
      .enum(["formal", "casual", "enthusiastic"])
      .optional()
      .default("casual")
      .describe("Greeting style"),
  },
  async ({ name, style }) => {
    let greeting: string;
    switch (style) {
      case "formal":
        greeting = `Good day, ${name}. It is a pleasure to make your acquaintance.`;
        break;
      case "enthusiastic":
        greeting = `Hey ${name.toUpperCase()}! So great to meet you!`;
        break;
      default:
        greeting = `Hey ${name}! Nice to meet you.`;
    }
    return { content: [{ type: "text" as const, text: greeting }] };
  }
);

// ——— Tool: Get time ———
server.tool(
  "get-time",
  "Get current date and time. Use when the user asks what time it is or wants the current date.",
  {
    timezone: z
      .string()
      .optional()
      .default("UTC")
      .describe("IANA timezone (e.g. America/New_York, Europe/London)"),
    format: z
      .enum(["short", "long"])
      .optional()
      .default("long")
      .describe("short = time only, long = full date and time"),
  },
  async ({ timezone, format }) => {
    const now = new Date();
    let result: string;
    try {
      if (format === "short") {
        result = now.toLocaleTimeString("en-US", { timeZone: timezone });
      } else {
        result = now.toLocaleString("en-US", {
          timeZone: timezone,
          dateStyle: "full",
          timeStyle: "long",
        });
      }
    } catch {
      result = `Invalid timezone: ${timezone}. Using UTC: ${now.toUTCString()}`;
    }
    return { content: [{ type: "text" as const, text: result }] };
  }
);

// ——— Tool: Calculate ———
const calcHistory: Array<{ operation: string; a: number; b: number; result: number; timestamp: string }> = [];

server.tool(
  "calculate",
  "Perform basic math: add, subtract, multiply, divide. Use when the user asks to calculate, do math, or wants a numerical result.",
  {
    operation: z
      .enum(["add", "subtract", "multiply", "divide"])
      .describe("The mathematical operation"),
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  },
  async ({ operation, a, b }) => {
    if (operation === "divide" && b === 0) {
      return {
        content: [{ type: "text" as const, text: "Error: Division by zero is not allowed." }],
        isError: true,
      };
    }
    let result: number;
    switch (operation) {
      case "add":
        result = a + b;
        break;
      case "subtract":
        result = a - b;
        break;
      case "multiply":
        result = a * b;
        break;
      case "divide":
        result = a / b;
        break;
    }
    calcHistory.unshift({ operation, a, b, result, timestamp: new Date().toISOString() });
    if (calcHistory.length > 10) calcHistory.pop();
    const symbols: Record<string, string> = { add: "+", subtract: "-", multiply: "×", divide: "÷" };
    const text = `${a} ${symbols[operation]} ${b} = ${result}`;
    return { content: [{ type: "text" as const, text }] };
  }
);

// ——— Resource: Server info ———
server.resource(
  "server-info",
  "info://server",
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(
          {
            name: "MCP Small Demo",
            version: "1.0.0",
            tools: ["greet", "get-time", "calculate"],
            description: "Small MCP demo: calculator, greeting, and time tools",
          },
          null,
          2
        ),
      },
    ],
  })
);

// ——— Resource: Calculator operations ———
server.resource(
  "operations",
  "calc://operations",
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(
          {
            operations: [
              { name: "add", symbol: "+", description: "Addition" },
              { name: "subtract", symbol: "-", description: "Subtraction" },
              { name: "multiply", symbol: "×", description: "Multiplication" },
              { name: "divide", symbol: "÷", description: "Division (non-zero divisor)" },
            ],
          },
          null,
          2
        ),
      },
    ],
  })
);

// ——— Resource: Calculation history ———
server.resource(
  "history",
  "calc://history",
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({ calculations: calcHistory, count: calcHistory.length }, null, 2),
      },
    ],
  })
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Utility Tools Server running on stdio");
}

main().catch(console.error);
