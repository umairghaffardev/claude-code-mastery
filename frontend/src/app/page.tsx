import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          🤖 Claude Code Mastery
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          A full-stack starter project to learn Claude Code, Agent Skills, MCP,
          Hooks, and Subagents.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard"
            className="p-6 border rounded-lg hover:bg-accent transition-colors text-left"
          >
            <h2 className="text-xl font-semibold mb-2">📊 Dashboard</h2>
            <p className="text-muted-foreground text-sm">
              Overview of tasks and agent activity
            </p>
          </Link>

          <Link
            href="/tasks"
            className="p-6 border rounded-lg hover:bg-accent transition-colors text-left"
          >
            <h2 className="text-xl font-semibold mb-2">✅ Tasks</h2>
            <p className="text-muted-foreground text-sm">
              CRUD task manager — practice target for Claude Code
            </p>
          </Link>

          <Link
            href="/agents"
            className="p-6 border rounded-lg hover:bg-accent transition-colors text-left"
          >
            <h2 className="text-xl font-semibold mb-2">🤖 Agents</h2>
            <p className="text-muted-foreground text-sm">
              View configured subagents and their capabilities
            </p>
          </Link>

          <Link
            href="/mcp"
            className="p-6 border rounded-lg hover:bg-accent transition-colors text-left"
          >
            <h2 className="text-xl font-semibold mb-2">🔌 MCP Servers</h2>
            <p className="text-muted-foreground text-sm">
              View connected MCP servers and their status
            </p>
          </Link>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Start by running{" "}
          <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
            claude
          </code>{" "}
          in the project root and pasting the prompt from{" "}
          <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
            PROMPT.md
          </code>
        </p>
      </div>
    </div>
  );
}
