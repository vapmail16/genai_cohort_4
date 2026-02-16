/**
 * MCP Knowledge Base Server
 * Tools: search-articles, create-article, update-article, list-articles
 * Resources: catalog, article by id.
 * The AI agent (MCP client, e.g. Claude) discovers these tools and decides which to call.
 */
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  createArticle,
  getArticle,
  updateArticle,
  searchArticles,
  listArticles,
  seedDemoArticles,
} from "./store.js";

seedDemoArticles();

const server = new McpServer({
  name: "mcp-knowledge-base-server",
  version: "1.0.0",
});

// ——— Tool: Search articles ———
server.tool(
  "search-articles",
  `Search the knowledge base for articles matching a keyword query. Searches across title, content, and tags. Use when the user wants to find articles about a topic.`,
  {
    query: z
      .string()
      .min(1)
      .max(200)
      .describe("Search keywords"),
    status: z
      .enum(["published", "draft", "archived", "all"])
      .optional()
      .default("published")
      .describe("Filter by status. Default: published only"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .default(10)
      .describe("Max results (1-20)"),
    tags: z.array(z.string().max(30)).optional().describe("Filter by tags"),
  },
  async ({ query, status, limit, tags }) => {
    const results = searchArticles({ query, status, limit, tags });
    if (results.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `No articles found matching "${query}". Try different keywords or broaden filters.`,
          },
        ],
      };
    }
    const text = results
      .map(
        (a) =>
          `- **${a.title}** (${a.id})\n  ${a.summary ?? a.content.slice(0, 100) + "..."}\n  Tags: ${a.tags.join(", ")}`
      )
      .join("\n\n");
    return { content: [{ type: "text" as const, text }] };
  }
);

// ——— Tool: Create article ———
server.tool(
  "create-article",
  `Create a new article in the knowledge base. Use when the user wants to add content, write an article, or save information. Created as draft by default.`,
  {
    title: z.string().min(3).max(200).describe("Article title"),
    content: z.string().min(10).describe("Article content"),
    summary: z.string().max(500).optional().describe("Brief summary (1-2 sentences)"),
    tags: z
      .array(z.string().max(30))
      .min(1)
      .max(10)
      .describe("Tags (e.g. ['docker', 'devops'])"),
    author: z.string().optional().default("AI Assistant").describe("Author name"),
    status: z.enum(["draft", "published"]).optional().default("draft").describe("Status"),
  },
  async ({ title, content, summary, tags, author, status }) => {
    const article = createArticle({ title, content, summary, tags, author, status });
    return {
      content: [
        {
          type: "text" as const,
          text: `Article created.\n**Title:** ${article.title}\n**ID:** ${article.id}\n**Status:** ${article.status}\n**Tags:** ${article.tags.join(", ")}`,
        },
      ],
    };
  }
);

// ——— Tool: Update article ———
server.tool(
  "update-article",
  `Update an existing article. Use when the user wants to edit, publish, or archive. Need the article ID — use search-articles first.`,
  {
    id: z.string().describe("Article ID (from search-articles)"),
    title: z.string().min(3).max(200).optional().describe("New title"),
    content: z.string().min(10).optional().describe("New content"),
    summary: z.string().max(500).optional().describe("New summary"),
    tags: z.array(z.string().max(30)).optional().describe("New tags (replaces existing)"),
    status: z.enum(["draft", "published", "archived"]).optional().describe("New status"),
  },
  async ({ id, title, content, summary, tags, status }) => {
    const existing = getArticle(id);
    if (!existing) {
      return {
        content: [{ type: "text" as const, text: `Article "${id}" not found. Use search-articles to find IDs.` }],
        isError: true,
      };
    }
    const updated = updateArticle(id, { title, content, summary, tags, status });
    if (!updated) {
      return {
        content: [{ type: "text" as const, text: "Update failed." }],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text" as const,
          text: `Article updated.\n**Title:** ${updated.title}\n**ID:** ${updated.id}\n**Status:** ${updated.status}\n**Updated:** ${updated.updatedAt}`,
        },
      ],
    };
  }
);

// ——— Tool: List articles ———
server.tool(
  "list-articles",
  `List articles in the knowledge base. Use when the user wants to see what's available or browse by status.`,
  {
    status: z
      .enum(["published", "draft", "archived", "all"])
      .optional()
      .default("published")
      .describe("Filter by status"),
    limit: z.number().int().min(1).max(50).optional().default(20).describe("Max results"),
  },
  async ({ status, limit }) => {
    const results = listArticles({ status, limit });
    const text =
      results.length === 0
        ? "No articles found."
        : results
            .map((a) => `- **${a.title}** (${a.id}) — ${a.status} — ${a.tags.join(", ")}`)
            .join("\n");
    return { content: [{ type: "text" as const, text }] };
  }
);

// ——— Resource: Catalog ———
server.resource(
  "catalog",
  "kb://catalog",
  async (uri) => {
    const articles = listArticles({ status: "all", limit: 100 });
    const catalog = articles.map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      tags: a.tags,
      status: a.status,
      updatedAt: a.updatedAt,
    }));
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify({ articles: catalog, count: catalog.length }, null, 2),
        },
      ],
    };
  }
);

// ——— Resource: Article by ID (template) ———
const articleDetailTemplate = new ResourceTemplate("kb://article/{id}", { list: undefined });
server.resource(
  "article-detail",
  articleDetailTemplate,
  {
    description: "Read a single article by ID",
    mimeType: "application/json",
  },
  async (uri, variables) => {
    const id = variables.id;
    const article = getArticle(id);
    if (!article) {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/plain",
            text: `Article "${id}" not found.`,
          },
        ],
      };
    }
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(article, null, 2),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Knowledge Base Server running on stdio");
}

main().catch(console.error);
