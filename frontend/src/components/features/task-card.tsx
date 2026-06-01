import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus, Priority } from "@/types";

// Presentational component — no hooks, no "use client".
// It renders inside a client list but is itself a pure render of props, so it
// stays a server-compatible component (zero client JS of its own).

const statusStyles: Record<TaskStatus, string> = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const priorityStyles: Record<Priority, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-red-100 text-red-700",
};

export function TaskCard({ task }: { task: Task }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{task.title}</CardTitle>
          <Badge
            variant="outline"
            className={cn("shrink-0 border-transparent", statusStyles[task.status])}
          >
            {statusLabels[task.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2">
        {task.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        ) : (
          <span className="text-sm italic text-muted-foreground">
            No description
          </span>
        )}
        <Badge
          variant="outline"
          className={cn("shrink-0 border-transparent", priorityStyles[task.priority])}
        >
          {task.priority}
        </Badge>
      </CardContent>
    </Card>
  );
}
