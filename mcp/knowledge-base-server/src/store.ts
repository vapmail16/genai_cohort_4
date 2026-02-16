/**
 * In-memory knowledge base store (no database required).
 * Replace with Prisma + PostgreSQL for production.
 */

export type ArticleStatus = "draft" | "published" | "archived";

export interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  author: string;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
}

const articles = new Map<string, Article>();

let idCounter = 1;

function nextId(): string {
  return `art-${String(idCounter++).padStart(4, "0")}`;
}

export function createArticle(data: Omit<Article, "id" | "createdAt" | "updatedAt">): Article {
  const now = new Date().toISOString();
  const id = nextId();
  const article: Article = {
    id,
    ...data,
    tags: data.tags.map((t) => t.toLowerCase().trim()),
    createdAt: now,
    updatedAt: now,
  };
  articles.set(id, article);
  return article;
}

export function getArticle(id: string): Article | undefined {
  return articles.get(id);
}

export function updateArticle(
  id: string,
  data: Partial<Pick<Article, "title" | "content" | "summary" | "tags" | "status">>
): Article | undefined {
  const existing = articles.get(id);
  if (!existing) return undefined;
  const updated: Article = {
    ...existing,
    ...data,
    tags: data.tags ?? existing.tags,
    updatedAt: new Date().toISOString(),
  };
  articles.set(id, updated);
  return updated;
}

export function searchArticles(options: {
  query: string;
  status?: ArticleStatus | "all";
  limit: number;
  tags?: string[];
}): Article[] {
  const { query, status = "published", limit, tags } = options;
  const q = query.toLowerCase().trim();
  let results = Array.from(articles.values());

  if (status !== "all") {
    results = results.filter((a) => a.status === status);
  }
  if (tags && tags.length > 0) {
    const tagSet = new Set(tags.map((t) => t.toLowerCase()));
    results = results.filter((a) => a.tags.some((t) => tagSet.has(t)));
  }
  if (q) {
    results = results.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some((t) => t.includes(q))
    );
  }

  results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return results.slice(0, limit);
}

export function listArticles(options: {
  status?: ArticleStatus | "all";
  limit: number;
}): Article[] {
  const { status = "published", limit } = options;
  let results = Array.from(articles.values());
  if (status !== "all") {
    results = results.filter((a) => a.status === status);
  }
  results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return results.slice(0, limit);
}

/** Seed a few demo articles so the server isn't empty. */
export function seedDemoArticles(): void {
  if (articles.size > 0) return;
  const now = new Date().toISOString();
  const demos: Omit<Article, "id" | "createdAt" | "updatedAt">[] = [
    {
      title: "Getting Started with MCP",
      content: "The Model Context Protocol (MCP) lets AI applications discover and use tools and resources in a standard way. This article covers setup and your first MCP server.",
      summary: "Introduction to MCP: what it is and how to build your first server.",
      tags: ["mcp", "ai", "tutorial"],
      author: "Demo",
      status: "published",
    },
    {
      title: "Building TypeScript MCP Servers",
      content: "Use the official @modelcontextprotocol/sdk with TypeScript. Register tools with Zod schemas, expose resources, and connect via stdio or HTTP.",
      summary: "TypeScript and the MCP SDK for building servers.",
      tags: ["typescript", "mcp", "sdk"],
      author: "Demo",
      status: "published",
    },
    {
      title: "Tool Design Best Practices",
      content: "Good tool descriptions help the AI choose the right tool. Use clear parameter names, sensible defaults, and describe when to use each tool.",
      summary: "How to design MCP tools that AI can use reliably.",
      tags: ["mcp", "design", "best-practices"],
      author: "Demo",
      status: "published",
    },
  ];
  demos.forEach((d) => {
    const id = nextId();
    const article: Article = { id, ...d, createdAt: now, updatedAt: now };
    articles.set(id, article);
  });
  idCounter = demos.length + 1;
}
