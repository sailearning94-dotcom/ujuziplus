"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const STREAK_DAYS = 12;
const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const ACTIVE = [true, true, true, true, true, false, true];

export function LearningStreak() {
  return (
    <Card>
      <CardTitle className="mb-4 flex items-center gap-2">
        <Flame className="h-5 w-5 text-orange-500" />
        Learning streak
      </CardTitle>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{STREAK_DAYS}</span>
        <span className="text-sm text-gray-500">days in a row</span>
      </div>
      <div className="mt-4 flex justify-between gap-1">
        {WEEK.map((day, i) => (
          <div key={`${day}-${i}`} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "h-8 w-8 rounded-full text-xs font-medium flex items-center justify-center",
                ACTIVE[i] ? "bg-brand text-white" : "bg-gray-100 text-gray-400"
              )}
            >
              {ACTIVE[i] ? "✓" : ""}
            </div>
            <span className="text-[10px] text-gray-500">{day}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-500">Complete any lesson today to keep your streak</p>
    </Card>
  );
}
