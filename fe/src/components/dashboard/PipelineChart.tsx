import { ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stages = [
  { name: "Prospect",   count: 38, value: "820tr", color: "#C4C0F0" },
  { name: "Qualified",  count: 26, value: "610tr", color: "#9B94E3" },
  { name: "Proposal",   count: 17, value: "480tr", color: "#7168CC" },
  { name: "Closed Won", count: 11, value: "340tr", color: "#534AB7" },
];
const maxCount = 38;

export function PipelineChart() {
  return (
    <Card className="shadow-none border-border/70 gap-0 py-0 h-full flex flex-col">
      <CardHeader className="border-b px-5 py-4">
        <div>
          <CardTitle className="text-sm tracking-tight">Pipeline Funnel</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Phân bổ deals theo giai đoạn
          </CardDescription>
        </div>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-primary hover:text-primary hover:bg-secondary/60 text-xs px-2"
          >
            Xem Pipeline
            <ArrowRight className="size-3" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-5 py-5 flex-1 space-y-4">
        {stages.map((stage, i) => {
          const widthPct = (stage.count / maxCount) * 100;
          const convRate =
            i > 0
              ? Math.round((stage.count / stages[i - 1].count) * 100)
              : null;

          return (
            <div key={stage.name} className="space-y-1.5">
              {/* Label row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="size-2 rounded-sm shrink-0"
                    style={{ background: stage.color }}
                  />
                  <span className="text-foreground" style={{ fontSize: 13 }}>
                    {stage.name}
                  </span>
                  {convRate !== null && (
                    <span className="text-muted-foreground bg-muted border border-border/50 px-1.5 py-px rounded-full" style={{ fontSize: 10 }}>
                      {convRate}% chuyển đổi
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-muted-foreground">
                    {stage.value}
                  </span>
                  <span
                    className="text-foreground tabular-nums w-6 text-right"
                    style={{ fontSize: 14, fontWeight: 600 }}
                  >
                    {stage.count}
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-6 bg-muted rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-700"
                  style={{ width: `${widthPct}%`, background: stage.color }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="border-t px-5 py-3 flex items-center justify-between">
        <div className="flex gap-4">
          {stages.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <div
                className="size-1.5 rounded-sm shrink-0"
                style={{ background: s.color }}
              />
              <span className="text-muted-foreground" style={{ fontSize: 11 }}>
                {s.name}
              </span>
            </div>
          ))}
        </div>
        <span className="text-muted-foreground" style={{ fontSize: 11 }}>
          Tổng: 92 deals · 2.25 tỷ
        </span>
      </CardFooter>
    </Card>
  );
}
