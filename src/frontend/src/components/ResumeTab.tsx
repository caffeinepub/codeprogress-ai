import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, Trophy } from "lucide-react";
import { motion } from "motion/react";
import {
  useResumeData,
  useResumeStrengthBreakdown,
  useResumeStrengthScore,
} from "../hooks/useQueries";

function scoreColor(score: number): string {
  if (score >= 70) return "oklch(0.72 0.19 155)";
  if (score >= 40) return "oklch(0.78 0.2 80)";
  return "oklch(0.65 0.24 25)";
}

function ScoreGauge({ score }: { score: number }) {
  const color = scoreColor(score);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg width="128" height="128" className="-rotate-90" aria-hidden="true">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="oklch(0.28 0.015 240)"
          strokeWidth="10"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-display font-bold text-2xl"
          style={{ color }}
        >
          {score}
        </motion.p>
        <p className="text-xs text-muted-foreground">/ 100</p>
      </div>
    </div>
  );
}

function BreakdownBar({ label, score }: { label: string; score: number }) {
  const color = scoreColor(score);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-mono font-semibold" style={{ color }}>
          {score}/100
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

const motivationalLines = [
  "Every line of code you write is an investment in your future self.",
  "Consistency compounds — show up daily and the results will surprise you.",
  "Your next breakthrough is just one problem away.",
];

export function ResumeTab() {
  const resumeQuery = useResumeData();
  const scoreQuery = useResumeStrengthScore();
  const breakdownQuery = useResumeStrengthBreakdown();

  const resume = resumeQuery.data;
  const score = scoreQuery.data ?? 0;
  const breakdown = breakdownQuery.data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-chart-5/20 border border-chart-5/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-chart-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Resume
            </h2>
            <p className="text-xs text-muted-foreground">
              ATS-friendly auto-generated resume
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="border-border text-muted-foreground hover:text-foreground"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Print / Export
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Resume Preview */}
        <div className="lg:col-span-3" data-ocid="resume.preview.panel">
          {resumeQuery.isLoading ? (
            <div className="space-y-4 p-6 rounded-lg bg-card border border-border">
              <Skeleton className="h-6 w-48 bg-muted/40" />
              <Skeleton className="h-4 w-64 bg-muted/40" />
              <Skeleton className="h-px w-full bg-muted/40" />
              <Skeleton className="h-4 w-32 bg-muted/40" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                  <Skeleton key={i} className="h-3 w-full bg-muted/40" />
                ))}
              </div>
            </div>
          ) : !resume ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-dashed border-border bg-muted/10">
              <FileText className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Set up your profile and stats to generate resume
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 rounded-lg bg-white text-gray-900 border border-gray-200 shadow-lg print:shadow-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {/* Header */}
              <div className="text-center pb-4 border-b border-gray-300 mb-4">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {resume.header.name}
                </h1>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-600">
                  <span>{resume.header.email}</span>
                  <span>·</span>
                  <span>{resume.header.university}</span>
                  <span>·</span>
                  <span>
                    Expected {resume.header.graduationYear.toString()}
                  </span>
                </div>
              </div>

              {/* Technical Skills */}
              {resume.technicalSkills.length > 0 && (
                <section className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">
                    Technical Skills
                  </h2>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {resume.technicalSkills.join(" · ")}
                  </p>
                </section>
              )}

              {/* Coding Achievements */}
              {resume.codingAchievements && (
                <section className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">
                    Coding Achievements
                  </h2>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {resume.codingAchievements}
                  </p>
                </section>
              )}

              {/* Projects */}
              {resume.projects.length > 0 && (
                <section className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">
                    Projects
                  </h2>
                  <div className="space-y-3">
                    {resume.projects.map((proj) => (
                      <div key={proj.name}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-sm font-bold text-gray-900">
                            {proj.name}
                          </h3>
                          {proj.techStack.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {proj.techStack.join(", ")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-700 mt-0.5">
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Key Strengths */}
              {resume.keyStrengths.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">
                    Key Strengths
                  </h2>
                  <ul className="space-y-0.5">
                    {resume.keyStrengths.map((strength) => (
                      <li
                        key={strength}
                        className="text-sm text-gray-800 flex items-start gap-2"
                      >
                        <span className="text-gray-400 mt-1 flex-shrink-0">
                          ▪
                        </span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </motion.div>
          )}
        </div>

        {/* Strength Score Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div
            className="p-5 rounded-lg bg-card border border-border"
            data-ocid="resume.score.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Resume Strength
              </h3>
            </div>

            {scoreQuery.isLoading ? (
              <div className="flex justify-center py-4">
                <Skeleton className="w-32 h-32 rounded-full bg-muted/40" />
              </div>
            ) : (
              <ScoreGauge score={Math.round(score)} />
            )}

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                {score >= 70
                  ? "Strong resume — ready for top-tier applications"
                  : score >= 40
                    ? "Good foundation — focus on weak areas to improve"
                    : "Keep building — more practice will boost your score"}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div
            className="p-5 rounded-lg bg-card border border-border space-y-3"
            data-ocid="resume.score.breakdown"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Score Breakdown
            </h3>
            {breakdownQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                  <Skeleton key={i} className="h-4 bg-muted/40" />
                ))}
              </div>
            ) : !breakdown ? (
              <p className="text-xs text-muted-foreground">
                Update your stats to see score breakdown
              </p>
            ) : (
              <div className="space-y-3">
                <BreakdownBar
                  label="Problem Solving"
                  score={Math.round(breakdown.problemSolving)}
                />
                <BreakdownBar
                  label="Consistency"
                  score={Math.round(breakdown.consistency)}
                />
                <BreakdownBar
                  label="Optimization"
                  score={Math.round(breakdown.optimization)}
                />
                <BreakdownBar
                  label="Language Depth"
                  score={Math.round(breakdown.languageDepth)}
                />
                <BreakdownBar
                  label="Project Strength"
                  score={Math.round(breakdown.projectStrength)}
                />
                <BreakdownBar
                  label="Advanced Problems"
                  score={Math.round(breakdown.advancedProblemRatio)}
                />
              </div>
            )}
          </div>

          {/* Motivational Lines */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
            {motivationalLines.map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2"
              >
                <span className="text-primary mt-0.5 flex-shrink-0">◆</span>
                {line}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
