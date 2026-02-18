export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  days: string[][]; // Each day is an array of verse references
}

export const READING_PLANS: ReadingPlan[] = [
  {
    id: "gospels-30",
    name: "The Gospels in 30 Days",
    description: "Walk through the life of Jesus across all four Gospels.",
    days: [
      ["Matthew 1-2"],
      ["Matthew 3-4"],
      ["Matthew 5-7"],
      ["Matthew 8-10"],
      ["Matthew 11-13"],
      ["Matthew 14-16"],
      ["Matthew 17-19"],
      ["Matthew 20-22"],
      ["Matthew 23-25"],
      ["Matthew 26-28"],
      ["Mark 1-3"],
      ["Mark 4-6"],
      ["Mark 7-9"],
      ["Mark 10-12"],
      ["Mark 13-14"],
      ["Mark 15-16"],
      ["Luke 1-2"],
      ["Luke 3-4"],
      ["Luke 5-7"],
      ["Luke 8-10"],
      ["Luke 11-13"],
      ["Luke 14-16"],
      ["Luke 17-19"],
      ["Luke 20-22"],
      ["Luke 23-24"],
      ["John 1-3"],
      ["John 4-6"],
      ["John 7-9"],
      ["John 10-14"],
      ["John 15-21"],
    ],
  },
  {
    id: "psalms-30",
    name: "Psalms of Comfort — 30 Days",
    description: "Find peace and encouragement through the Psalms.",
    days: [
      ["Psalm 1-5"],
      ["Psalm 6-10"],
      ["Psalm 11-15"],
      ["Psalm 16-18"],
      ["Psalm 19-21"],
      ["Psalm 22-24"],
      ["Psalm 25-27"],
      ["Psalm 28-30"],
      ["Psalm 31-33"],
      ["Psalm 34-36"],
      ["Psalm 37-39"],
      ["Psalm 40-42"],
      ["Psalm 43-45"],
      ["Psalm 46-48"],
      ["Psalm 49-51"],
      ["Psalm 52-55"],
      ["Psalm 56-59"],
      ["Psalm 60-63"],
      ["Psalm 64-67"],
      ["Psalm 68-69"],
      ["Psalm 70-72"],
      ["Psalm 73-76"],
      ["Psalm 77-78"],
      ["Psalm 79-83"],
      ["Psalm 84-89"],
      ["Psalm 90-95"],
      ["Psalm 96-102"],
      ["Psalm 103-106"],
      ["Psalm 107-118"],
      ["Psalm 119-150"],
    ],
  },
  {
    id: "proverbs-31",
    name: "Proverbs — A Chapter a Day",
    description: "Gain wisdom with one chapter of Proverbs each day for a month.",
    days: Array.from({ length: 31 }, (_, i) => [`Proverbs ${i + 1}`]),
  },
  {
    id: "romans-14",
    name: "Romans in 14 Days",
    description: "Dive deep into Paul's letter to the Romans.",
    days: [
      ["Romans 1"],
      ["Romans 2"],
      ["Romans 3"],
      ["Romans 4"],
      ["Romans 5"],
      ["Romans 6"],
      ["Romans 7"],
      ["Romans 8"],
      ["Romans 9"],
      ["Romans 10"],
      ["Romans 11"],
      ["Romans 12"],
      ["Romans 13-14"],
      ["Romans 15-16"],
    ],
  },
];

const PLAN_PROGRESS_KEY = "selah_reading_plan_progress";

export interface PlanProgress {
  planId: string;
  startedAt: string;
  completedDays: number[];
}

export function getPlanProgress(): PlanProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PLAN_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePlanProgress(progress: PlanProgress[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAN_PROGRESS_KEY, JSON.stringify(progress));
}

export function startPlan(planId: string): void {
  const all = getPlanProgress();
  if (all.find((p) => p.planId === planId)) return;
  all.push({ planId, startedAt: new Date().toISOString(), completedDays: [] });
  savePlanProgress(all);
}

export function toggleDay(planId: string, dayIndex: number): void {
  const all = getPlanProgress();
  const plan = all.find((p) => p.planId === planId);
  if (!plan) return;
  const idx = plan.completedDays.indexOf(dayIndex);
  if (idx >= 0) {
    plan.completedDays.splice(idx, 1);
  } else {
    plan.completedDays.push(dayIndex);
  }
  savePlanProgress(all);
}

export function removePlan(planId: string): void {
  const all = getPlanProgress().filter((p) => p.planId !== planId);
  savePlanProgress(all);
}
