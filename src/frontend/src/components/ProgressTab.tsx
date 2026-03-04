import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, FolderGit2, Loader2, Plus, Save, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Project } from "../backend.d";
import { useCodingStats, useUpdateCodingStats } from "../hooks/useQueries";

interface ProjectForm {
  name: string;
  description: string;
  techStack: string;
}

export function ProgressTab() {
  const statsQuery = useCodingStats();
  const updateStats = useUpdateCodingStats();

  // Form state
  const [totalProblems, setTotalProblems] = useState("0");
  const [easy, setEasy] = useState("0");
  const [medium, setMedium] = useState("0");
  const [hard, setHard] = useState("0");
  const [longestStreak, setLongestStreak] = useState("0");
  const [currentStreak, setCurrentStreak] = useState("0");
  const [consistency, setConsistency] = useState("0");
  const [optimization, setOptimization] = useState("0");
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<ProjectForm>({
    name: "",
    description: "",
    techStack: "",
  });

  // Sync from backend
  useEffect(() => {
    if (statsQuery.data) {
      const s = statsQuery.data;
      setTotalProblems(s.totalProblemsSolved.toString());
      setEasy(s.totalEasyProblemsSolved.toString());
      setMedium(s.totalMediumProblemsSolved.toString());
      setHard(s.totalHardProblemsSolved.toString());
      setLongestStreak(s.longestStreakDays.toString());
      setCurrentStreak(s.currentDayStreak.toString());
      setConsistency(s.consistencyScore.toString());
      setOptimization(s.optimizationImprovementPercent.toString());
      setProjects(s.completedProjects);
    }
  }, [statsQuery.data]);

  const addProject = () => {
    if (!newProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    const techStack = newProject.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setProjects((prev) => [
      ...prev,
      {
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        techStack,
      },
    ]);
    setNewProject({ name: "", description: "", techStack: "" });
  };

  const removeProject = (i: number) => {
    setProjects((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStats.mutateAsync({
        totalProblems: BigInt(Number.parseInt(totalProblems) || 0),
        easy: BigInt(Number.parseInt(easy) || 0),
        medium: BigInt(Number.parseInt(medium) || 0),
        hard: BigInt(Number.parseInt(hard) || 0),
        longestStreak: BigInt(Number.parseInt(longestStreak) || 0),
        currentStreak: BigInt(Number.parseInt(currentStreak) || 0),
        consistency: BigInt(Number.parseInt(consistency) || 0),
        optimization: BigInt(Number.parseInt(optimization) || 0),
        completedProjects: projects,
      });
      toast.success("Stats updated successfully!");
    } catch {
      toast.error("Failed to update stats. Please try again.");
    }
  };

  // Difficulty bar data
  const easyN = Number.parseInt(easy) || 0;
  const medN = Number.parseInt(medium) || 0;
  const hardN = Number.parseInt(hard) || 0;
  const sumEMH = easyN + medN + hardN;

  const easyPct = sumEMH > 0 ? (easyN / sumEMH) * 100 : 0;
  const medPct = sumEMH > 0 ? (medN / sumEMH) * 100 : 0;
  const hardPct = sumEMH > 0 ? (hardN / sumEMH) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-chart-2/20 border border-chart-2/30 flex items-center justify-center">
          <FolderGit2 className="w-5 h-5 text-chart-2" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Coding Progress
          </h2>
          <p className="text-xs text-muted-foreground">
            Update your stats and track your growth
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Problems Grid */}
        <div className="p-4 rounded-lg bg-card border border-border space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Problems Solved
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Total</Label>
              <Input
                type="number"
                min="0"
                value={totalProblems}
                onChange={(e) => setTotalProblems(e.target.value)}
                className="bg-input border-border text-foreground font-mono text-center text-lg font-bold"
                data-ocid="progress.total.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                className="text-xs"
                style={{ color: "oklch(0.7 0.18 155)" }}
              >
                Easy
              </Label>
              <Input
                type="number"
                min="0"
                value={easy}
                onChange={(e) => setEasy(e.target.value)}
                className="bg-input border-border font-mono text-center text-lg font-bold"
                style={{ color: "oklch(0.7 0.18 155)" }}
                data-ocid="progress.easy.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                className="text-xs"
                style={{ color: "oklch(0.78 0.2 80)" }}
              >
                Medium
              </Label>
              <Input
                type="number"
                min="0"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="bg-input border-border font-mono text-center text-lg font-bold"
                style={{ color: "oklch(0.78 0.2 80)" }}
                data-ocid="progress.medium.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                className="text-xs"
                style={{ color: "oklch(0.65 0.24 25)" }}
              >
                Hard
              </Label>
              <Input
                type="number"
                min="0"
                value={hard}
                onChange={(e) => setHard(e.target.value)}
                className="bg-input border-border font-mono text-center text-lg font-bold"
                style={{ color: "oklch(0.65 0.24 25)" }}
                data-ocid="progress.hard.input"
              />
            </div>
          </div>

          {/* Distribution bar */}
          {sumEMH > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2 pt-1"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Distribution
              </p>
              <div className="h-3 rounded-full overflow-hidden flex bg-muted/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${easyPct}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full"
                  style={{ backgroundColor: "oklch(0.7 0.18 155)" }}
                  title={`Easy: ${easyN}`}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${medPct}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="h-full"
                  style={{ backgroundColor: "oklch(0.78 0.2 80)" }}
                  title={`Medium: ${medN}`}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${hardPct}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="h-full"
                  style={{ backgroundColor: "oklch(0.65 0.24 25)" }}
                  title={`Hard: ${hardN}`}
                />
              </div>
              <div className="flex gap-4 text-xs">
                <span style={{ color: "oklch(0.7 0.18 155)" }}>
                  Easy: {easyN} ({easyPct.toFixed(0)}%)
                </span>
                <span style={{ color: "oklch(0.78 0.2 80)" }}>
                  Medium: {medN} ({medPct.toFixed(0)}%)
                </span>
                <span style={{ color: "oklch(0.65 0.24 25)" }}>
                  Hard: {hardN} ({hardPct.toFixed(0)}%)
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Streaks & Metrics */}
        <div className="p-4 rounded-lg bg-card border border-border space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Streaks & Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Flame
                  className="w-3.5 h-3.5"
                  style={{ color: "oklch(0.78 0.22 50)" }}
                />
                Current Streak
              </Label>
              <Input
                type="number"
                min="0"
                value={currentStreak}
                onChange={(e) => setCurrentStreak(e.target.value)}
                className="bg-input border-border text-foreground font-mono text-center"
                data-ocid="progress.streak.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Longest Streak
              </Label>
              <Input
                type="number"
                min="0"
                value={longestStreak}
                onChange={(e) => setLongestStreak(e.target.value)}
                className="bg-input border-border text-foreground font-mono text-center"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Consistency (0-100)
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={consistency}
                onChange={(e) => setConsistency(e.target.value)}
                className="bg-input border-border text-foreground font-mono text-center"
                data-ocid="progress.consistency.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Optimization %
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={optimization}
                onChange={(e) => setOptimization(e.target.value)}
                className="bg-input border-border text-foreground font-mono text-center"
                data-ocid="progress.optimization.input"
              />
            </div>
          </div>

          {/* Visual streaks */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-3 p-3 rounded-md bg-muted/20">
              <Flame
                className="w-8 h-8"
                style={{ color: "oklch(0.78 0.22 50)" }}
              />
              <div>
                <p className="text-xl font-display font-bold text-foreground">
                  {currentStreak}
                </p>
                <p className="text-xs text-muted-foreground">day streak</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-muted/20">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                {consistency}
              </div>
              <div>
                <p className="text-xl font-display font-bold text-foreground">
                  {consistency}%
                </p>
                <p className="text-xs text-muted-foreground">consistency</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="p-4 rounded-lg bg-card border border-border space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Projects ({projects.length})
          </h3>

          {/* Add new project */}
          <div className="space-y-2 p-3 rounded-md bg-muted/20 border border-dashed border-border">
            <p className="text-xs text-muted-foreground font-medium">
              Add New Project
            </p>
            <Input
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject((p) => ({ ...p, name: e.target.value }))
              }
              className="bg-input border-border text-foreground text-sm"
              data-ocid="progress.project.input"
            />
            <Input
              placeholder="Short description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject((p) => ({ ...p, description: e.target.value }))
              }
              className="bg-input border-border text-foreground text-sm"
            />
            <Input
              placeholder="Tech stack (comma-separated: React, Node.js, PostgreSQL)"
              value={newProject.techStack}
              onChange={(e) =>
                setNewProject((p) => ({ ...p, techStack: e.target.value }))
              }
              className="bg-input border-border text-foreground text-sm"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addProject}
              className="w-full border-primary/40 text-primary hover:bg-primary/10"
              data-ocid="progress.add_project.button"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Project
            </Button>
          </div>

          {/* Projects list */}
          {statsQuery.isLoading ? (
            <div className="space-y-2" data-ocid="progress.projects.list">
              {Array.from({ length: 2 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-16 rounded-lg bg-muted/40" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-6 rounded-lg border border-dashed border-border bg-muted/10"
              data-ocid="progress.projects.list"
            >
              <p className="text-xs text-muted-foreground">
                No projects yet. Add your first project above.
              </p>
            </div>
          ) : (
            <div className="space-y-2" data-ocid="progress.projects.list">
              {projects.map((proj, i) => (
                <motion.div
                  key={proj.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start justify-between p-3 rounded-lg bg-muted/20 border border-border group"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-sm font-medium text-foreground">
                      {proj.name}
                    </p>
                    {proj.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {proj.description}
                      </p>
                    )}
                    {proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary border border-primary/20 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeProject(i)}
                    className="w-7 h-7 flex-shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={updateStats.isPending}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          data-ocid="progress.save_button"
        >
          {updateStats.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Stats
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
