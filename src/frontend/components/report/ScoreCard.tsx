import { Card, CardContent } from "@/frontend/components/ui/card";
import type { Dictionary } from "@/shared/i18n/types";

interface ScoreCardProps {
  score: number;
  t: Dictionary;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
}

function getScoreStroke(score: number): string {
  if (score >= 70) return "stroke-green-600";
  if (score >= 40) return "stroke-yellow-500";
  return "stroke-red-500";
}

function getScoreLabel(score: number, t: Dictionary): string {
  if (score >= 70) return t.report.scoreGood;
  if (score >= 40) return t.report.scoreAverage;
  return t.report.scoreLow;
}

function getScoreContext(score: number, t: Dictionary): string {
  if (score >= 70) return t.report.scoreContext.good;
  if (score >= 40) return t.report.scoreContext.average;
  return t.report.scoreContext.low;
}

export function ScoreCard({ score, t }: ScoreCardProps) {
  const roundedScore = Math.round(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (roundedScore / 100) * circumference;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-48 w-48">
            <svg className="h-48 w-48 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`${getScoreStroke(roundedScore)} transition-[stroke-dashoffset] duration-1000 ease-out`}
                style={{
                  animation: "gauge-fill 1.2s ease-out forwards",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-4xl font-bold ${getScoreColor(roundedScore)}`}
              >
                {roundedScore}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
          <span
            className={`text-sm font-semibold ${getScoreColor(roundedScore)}`}
          >
            {getScoreLabel(roundedScore, t)}
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold">{t.report.visibilityScore}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {getScoreContext(roundedScore, t)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
