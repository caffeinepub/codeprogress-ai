import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Code2,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { RoadmapEntry } from "../backend.d";
import { useRoadmap } from "../hooks/useQueries";

function WeekCard({ entry, index }: { entry: RoadmapEntry; index: number }) {
  const weekNum = Number(entry.weekNumber);
  const problemsTarget = Number(entry.problemsTargetCount);
  const optTarget = entry.optimizationTargetPercent;

  // Color cycle for week numbers
  const colors = [
    {
      bg: "oklch(0.72 0.19 155 / 0.12)",
      border: "oklch(0.72 0.19 155 / 0.35)",
      text: "oklch(0.72 0.19 155)",
    },
    {
      bg: "oklch(0.65 0.2 260 / 0.12)",
      border: "oklch(0.65 0.2 260 / 0.35)",
      text: "oklch(0.65 0.2 260)",
    },
    {
      bg: "oklch(0.72 0.2 85 / 0.12)",
      border: "oklch(0.72 0.2 85 / 0.35)",
      text: "oklch(0.72 0.2 85)",
    },
    {
      bg: "oklch(0.7 0.21 40 / 0.12)",
      border: "oklch(0.7 0.21 40 / 0.35)",
      text: "oklch(0.7 0.21 40)",
    },
    {
      bg: "oklch(0.72 0.2 300 / 0.12)",
      border: "oklch(0.72 0.2 300 / 0.35)",
      text: "oklch(0.72 0.2 300)",
    },
  ];
  const c = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="p-4 rounded-lg bg-card border hover:shadow-glow-sm transition-all"
      style={
        {
          borderColor: c.border,
          "--week-accent": c.text,
        } as React.CSSProperties
      }
      data-ocid={`roadmap.week.item.${index + 1}`}
    >
      {/* Week Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center font-display font-bold text-sm"
            style={{ background: c.bg, color: c.text }}
          >
            W{weekNum}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Week {weekNum}
            </p>
            <p className="text-xs text-muted-foreground">
              Days {(weekNum - 1) * 7 + 1}–{Math.min(weekNum * 7, 60)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Target</p>
          <p
            className="font-display font-bold text-sm"
            style={{ color: c.text }}
          >
            {problemsTarget} problems
          </p>
        </div>
      </div>

      {/* Topics */}
      {entry.topics.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Topics
          </p>
          <div className="flex flex-wrap gap-1.5">
            {entry.topics.map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: c.bg,
                  color: c.text,
                  border: `1px solid ${c.border}`,
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Project + Interview + Optimization */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        {entry.projectSuggestion && (
          <div className="flex items-start gap-2">
            <Code2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs text-muted-foreground">Project: </span>
              <span className="text-xs text-foreground/90">
                {entry.projectSuggestion}
              </span>
            </div>
          </div>
        )}
        {entry.interviewFocus && (
          <div className="flex items-start gap-2">
            <Target className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs text-muted-foreground">Interview: </span>
              <span className="text-xs text-foreground/90">
                {entry.interviewFocus}
              </span>
            </div>
          </div>
        )}
        {optTarget > 0 && (
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <div>
              <span className="text-xs text-muted-foreground">
                Optimization target:{" "}
              </span>
              <span className="text-xs font-semibold" style={{ color: c.text }}>
                +{optTarget}%
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Sample roadmap for empty state
const SAMPLE_ROADMAP: RoadmapEntry[] = [
  {
    weekNumber: BigInt(1),
    topics: ["Arrays", "Strings", "Two Pointers"],
    problemsTargetCount: BigInt(15),
    projectSuggestion: "Build a string manipulation utility library",
    interviewFocus: "Basic array traversal and string parsing patterns",
    optimizationTargetPercent: 10,
  },
  {
    weekNumber: BigInt(2),
    topics: ["Linked Lists", "Stacks", "Queues"],
    problemsTargetCount: BigInt(12),
    projectSuggestion: "Implement a custom stack-based calculator",
    interviewFocus: "Pointer manipulation, dummy nodes",
    optimizationTargetPercent: 15,
  },
  {
    weekNumber: BigInt(3),
    topics: ["Binary Search", "Sorting", "Divide & Conquer"],
    problemsTargetCount: BigInt(14),
    projectSuggestion: "Build a search engine index sorter",
    interviewFocus: "Template for binary search on answer space",
    optimizationTargetPercent: 20,
  },
  {
    weekNumber: BigInt(4),
    topics: ["Trees", "BST", "DFS/BFS"],
    problemsTargetCount: BigInt(16),
    projectSuggestion: "Implement a file system tree explorer",
    interviewFocus: "Tree traversal patterns, recursion",
    optimizationTargetPercent: 25,
  },
  {
    weekNumber: BigInt(5),
    topics: ["Graphs", "Topological Sort", "Union Find"],
    problemsTargetCount: BigInt(14),
    projectSuggestion: "Social network graph visualizer",
    interviewFocus: "Graph BFS/DFS, cycle detection",
    optimizationTargetPercent: 30,
  },
  {
    weekNumber: BigInt(6),
    topics: ["Dynamic Programming", "Memoization", "Tabulation"],
    problemsTargetCount: BigInt(12),
    projectSuggestion: "Build a text autocomplete with DP",
    interviewFocus: "DP state definition and transitions",
    optimizationTargetPercent: 35,
  },
  {
    weekNumber: BigInt(7),
    topics: ["Heaps", "Priority Queue", "Greedy"],
    problemsTargetCount: BigInt(13),
    projectSuggestion: "Event scheduling system with priority queue",
    interviewFocus: "When to use greedy vs DP",
    optimizationTargetPercent: 40,
  },
  {
    weekNumber: BigInt(8),
    topics: ["Backtracking", "Trie", "Advanced DP"],
    problemsTargetCount: BigInt(11),
    projectSuggestion: "Word puzzle solver using Trie",
    interviewFocus: "Backtracking pruning strategies",
    optimizationTargetPercent: 45,
  },
  {
    weekNumber: BigInt(9),
    topics: ["System Design", "Mock Interviews", "Hard Problems"],
    problemsTargetCount: BigInt(10),
    projectSuggestion: "Design and implement a URL shortener",
    interviewFocus: "Scalability, trade-offs, communication",
    optimizationTargetPercent: 50,
  },
];

export function RoadmapTab() {
  const roadmapQuery = useRoadmap();

  const roadmap =
    roadmapQuery.data && roadmapQuery.data.length > 0
      ? roadmapQuery.data
      : SAMPLE_ROADMAP;

  const isUsingSample = !roadmapQuery.data || roadmapQuery.data.length === 0;

  return (
    <div className="space-y-6" data-ocid="roadmap.page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-chart-3/20 border border-chart-3/30 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-chart-3" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              60-Day Roadmap
            </h2>
            <p className="text-xs text-muted-foreground">
              Week-by-week learning plan to accelerate your growth
            </p>
          </div>
        </div>
        {isUsingSample && !roadmapQuery.isLoading && (
          <span className="text-xs text-muted-foreground bg-muted/30 border border-border px-2.5 py-1 rounded-full">
            Sample plan
          </span>
        )}
      </div>

      {/* Progress overview */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            Roadmap Progress
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronRight className="w-3 h-3" />
            {roadmap.length} weeks · 60 days
          </div>
        </div>
        <div className="flex gap-1">
          {roadmap.slice(0, 9).map((entry) => (
            <div
              key={entry.weekNumber.toString()}
              className="flex-1 h-1.5 rounded-full bg-muted/30"
              title={`Week ${Number(entry.weekNumber)}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
          <span>Day 1</span>
          <span>Day 60</span>
        </div>
      </div>

      {/* Week Cards */}
      {roadmapQuery.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <Skeleton key={i} className="h-56 rounded-lg bg-muted/40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmap.slice(0, 9).map((entry, i) => (
            <WeekCard key={Number(entry.weekNumber)} entry={entry} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
