import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import type { Recommendation } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/types";

interface RecommendationListProps {
  recommendations: Recommendation[];
  t: Dictionary;
}

function priorityVariant(
  priority: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    default:
      return "outline";
  }
}

function priorityOrder(priority: string): number {
  switch (priority) {
    case "high":
      return 0;
    case "medium":
      return 1;
    default:
      return 2;
  }
}

function priorityBorder(priority: string): string {
  switch (priority) {
    case "high":
      return "border-l-red-500";
    case "medium":
      return "border-l-yellow-500";
    default:
      return "border-l-green-500";
  }
}

function translatePriority(priority: string, t: Dictionary): string {
  const key = priority as keyof typeof t.labels;
  return t.labels[key] ?? priority;
}

export function RecommendationList({
  recommendations,
  t,
}: RecommendationListProps) {
  const sorted = [...recommendations].sort(
    (a, b) => priorityOrder(a.priority) - priorityOrder(b.priority)
  );

  return (
    <div className="space-y-3">
      {sorted.map((rec, index) => (
        <Card
          key={index}
          className={`border-l-4 ${priorityBorder(rec.priority)}`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                {index + 1}
              </span>
              <div className="flex flex-1 items-center justify-between gap-2">
                <CardTitle className="text-sm font-medium">
                  {rec.title}
                </CardTitle>
                <Badge variant={priorityVariant(rec.priority)}>
                  {translatePriority(rec.priority, t)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-14">
            <p className="text-sm text-muted-foreground">{rec.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
