import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { SkillLevel, TleRiskLevel } from "../backend.d";
import type { CodeSubmission } from "../backend.d";
import {
  useCodingStats,
  useProfile,
  useSkillLevel,
  useSubmissions,
} from "../hooks/useQueries";

function skillLevelLabel(level: SkillLevel): string {
  switch (level) {
    case SkillLevel.beginner:
      return "Beginner";
    case SkillLevel.intermediate:
      return "Intermediate";
    case SkillLevel.advanced:
      return "Advanced";
    case SkillLevel.competitive:
      return "Competitive";
    default:
      return "Unknown";
  }
}

function skillLevelClass(level: SkillLevel): string {
  switch (level) {
    case SkillLevel.beginner:
      return "skill-beginner";
    case SkillLevel.intermediate:
      return "skill-intermediate";
    case SkillLevel.advanced:
      return "skill-advanced";
    case SkillLevel.competitive:
      return "skill-competitive";
    default:
      return "";
  }
}

function TleBadge({ risk }: { risk: TleRiskLevel }) {
  const classes: Record<TleRiskLevel, string> = {
    [TleRiskLevel.low]: "tle-low",
    [TleRiskLevel.medium]: "tle-medium",
    [TleRiskLevel.high]: "tle-high",
  };
  const icons: Record<TleRiskLevel, React.ReactNode> = {
    [TleRiskLevel.low]: <CheckCircle2 className="w-3 h-3" />,
    [TleRiskLevel.medium]: <Clock className="w-3 h-3" />,
    [TleRiskLevel.high]: <AlertTriangle className="w-3 h-3" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${classes[risk]}`}
    >
      {icons[risk]}
      {risk.toUpperCase()} TLE
    </span>
  );
}

function SubmissionRow({ sub, index }: { sub: CodeSubmission; index: number }) {
  const date = new Date(Number(sub.submissionTime) / 1_000_000);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Code2 className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {sub.problemTitle}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {sub.language} · {sub.timeComplexity}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        <TleBadge risk={sub.tleRiskLevel} />
        <span className="text-xs text-muted-foreground hidden sm:block">
          {date.toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}

export function DashboardTab() {
  const profileQuery = useProfile();
  const statsQuery = useCodingStats();
  const skillQuery = useSkillLevel();
  const submissionsQuery = useSubmissions(5, 0);

  const isLoading =
    profileQuery.isLoading || statsQuery.isLoading || skillQuery.isLoading;

  const stats = statsQuery.data;
  const profile = profileQuery.data;
  const skillLevel = skillQuery.data;
  const submissions = submissionsQuery.data ?? [];

  const difficultyTotal = stats
    ? Number(stats.totalEasyProblemsSolved) +
      Number(stats.totalMediumProblemsSolved) +
      Number(stats.totalHardProblemsSolved)
    : 0;

  const easyPct =
    difficultyTotal > 0
      ? (Number(stats?.totalEasyProblemsSolved ?? 0) / difficultyTotal) * 100
      : 0;
  const medPct =
    difficultyTotal > 0
      ? (Number(stats?.totalMediumProblemsSolved ?? 0) / difficultyTotal) * 100
      : 0;
  const hardPct =
    difficultyTotal > 0
      ? (Number(stats?.totalHardProblemsSolved ?? 0) / difficultyTotal) * 100
      : 0;

  return (
    <div className="space-y-6 animate-slide-in-up" data-ocid="dashboard.page">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 bg-muted/40" />
              <Skeleton className="h-4 w-40 bg-muted/40" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Welcome back, {profile?.name?.split(" ")[0] ?? "Coder"} 👋
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {profile?.university} · Class of{" "}
                {profile?.graduationYear?.toString()}
              </p>
            </motion.div>
          )}
        </div>

        {skillLevel !== undefined && !skillQuery.isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Badge
              className={`px-4 py-1.5 text-sm font-semibold border ${skillLevelClass(skillLevel)}`}
              data-ocid="dashboard.skill_badge"
            >
              <Trophy className="w-3.5 h-3.5 mr-1.5" />
              {skillLevelLabel(skillLevel)}
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        data-ocid="dashboard.stats.card"
      >
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <Skeleton key={i} className="h-24 rounded-lg bg-muted/40" />
          ))
        ) : (
          <>
            <StatCard
              icon={<Target className="w-5 h-5 text-primary" />}
              label="Total Problems"
              value={stats?.totalProblemsSolved?.toString() ?? "0"}
              accent="primary"
              delay={0}
            />
            <StatCard
              icon={
                <CheckCircle2
                  className="w-5 h-5"
                  style={{ color: "oklch(0.7 0.18 155)" }}
                />
              }
              label="Easy"
              value={stats?.totalEasyProblemsSolved?.toString() ?? "0"}
              sub={`${easyPct.toFixed(0)}% of solved`}
              delay={0.05}
            />
            <StatCard
              icon={
                <BarChart3
                  className="w-5 h-5"
                  style={{ color: "oklch(0.78 0.2 80)" }}
                />
              }
              label="Medium"
              value={stats?.totalMediumProblemsSolved?.toString() ?? "0"}
              sub={`${medPct.toFixed(0)}% of solved`}
              delay={0.1}
            />
            <StatCard
              icon={
                <Zap
                  className="w-5 h-5"
                  style={{ color: "oklch(0.65 0.24 25)" }}
                />
              }
              label="Hard"
              value={stats?.totalHardProblemsSolved?.toString() ?? "0"}
              sub={`${hardPct.toFixed(0)}% of solved`}
              delay={0.15}
            />
            <StatCard
              icon={
                <Flame
                  className="w-5 h-5"
                  style={{ color: "oklch(0.78 0.22 50)" }}
                />
              }
              label="Current Streak"
              value={`${stats?.currentDayStreak?.toString() ?? "0"} days`}
              delay={0.2}
            />
            <StatCard
              icon={
                <Trophy
                  className="w-5 h-5"
                  style={{ color: "oklch(0.72 0.2 85)" }}
                />
              }
              label="Longest Streak"
              value={`${stats?.longestStreakDays?.toString() ?? "0"} days`}
              delay={0.25}
            />
            <StatCard
              icon={
                <BarChart3
                  className="w-5 h-5"
                  style={{ color: "oklch(0.65 0.2 260)" }}
                />
              }
              label="Consistency"
              value={`${stats?.consistencyScore?.toString() ?? "0"}%`}
              delay={0.3}
            />
            <StatCard
              icon={<Zap className="w-5 h-5 text-primary" />}
              label="Optimization"
              value={`+${stats?.optimizationImprovementPercent?.toString() ?? "0"}%`}
              delay={0.35}
            />
          </>
        )}
      </div>

      {/* Difficulty Distribution */}
      {stats && !statsQuery.isLoading && difficultyTotal > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Difficulty Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <DiffBar
                label="Easy"
                count={Number(stats.totalEasyProblemsSolved)}
                pct={easyPct}
                color="oklch(0.7 0.18 155)"
              />
              <DiffBar
                label="Medium"
                count={Number(stats.totalMediumProblemsSolved)}
                pct={medPct}
                color="oklch(0.78 0.2 80)"
              />
              <DiffBar
                label="Hard"
                count={Number(stats.totalHardProblemsSolved)}
                pct={hardPct}
                color="oklch(0.65 0.24 25)"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Submissions */}
      <div data-ocid="dashboard.submissions.list">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          Recent Submissions
        </h2>
        {submissionsQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <Skeleton key={i} className="h-14 rounded-lg bg-muted/40" />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center rounded-lg border border-dashed border-border bg-muted/10">
            <Code2 className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-sm">No submissions yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Head to Code Analyzer to submit your first solution
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {submissions.map((sub, i) => (
              <SubmissionRow
                key={sub.submissionId.toString()}
                sub={sub}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Projects */}
      {stats && stats.completedProjects.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            Projects ({stats.completedProjects.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.completedProjects.slice(0, 4).map((proj, i) => (
              <motion.div
                key={proj.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg bg-card border border-border"
              >
                <p className="font-medium text-foreground text-sm">
                  {proj.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {proj.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary border border-primary/20 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors ${accent === "primary" ? "glow-primary" : ""}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-8 h-8 rounded-md bg-muted/40 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-xl font-display font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function DiffBar({
  label,
  count,
  pct,
  color,
}: { label: string; count: number; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-12 text-right">
        {label}
      </span>
      <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-16 font-mono">
        {count} ({pct.toFixed(0)}%)
      </span>
    </div>
  );
}
