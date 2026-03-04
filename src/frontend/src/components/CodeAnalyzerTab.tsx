import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Eye,
  Loader2,
  Plus,
  Send,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TleRiskLevel } from "../backend.d";
import type { CodeSubmission } from "../backend.d";
import { useSubmissions, useSubmitCode } from "../hooks/useQueries";

const LANGUAGES = [
  "Python",
  "Java",
  "C++",
  "JavaScript",
  "Go",
  "Rust",
  "C",
  "TypeScript",
];

function TleBadge({ risk }: { risk: TleRiskLevel }) {
  const config: Record<
    TleRiskLevel,
    { cls: string; icon: React.ReactNode; label: string }
  > = {
    [TleRiskLevel.low]: {
      cls: "tle-low",
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: "Low TLE Risk",
    },
    [TleRiskLevel.medium]: {
      cls: "tle-medium",
      icon: <Clock className="w-3 h-3" />,
      label: "Medium TLE Risk",
    },
    [TleRiskLevel.high]: {
      cls: "tle-high",
      icon: <AlertTriangle className="w-3 h-3" />,
      label: "High TLE Risk",
    },
  };
  const { cls, icon, label } = config[risk];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
}

function SubmissionCard({ sub }: { sub: CodeSubmission }) {
  const [open, setOpen] = useState(false);
  const date = new Date(Number(sub.submissionTime) / 1_000_000);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 hover:border-border/80 transition-all text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Code2 className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {sub.problemTitle}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {sub.language} · {sub.timeComplexity} · {sub.spaceComplexity}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <TleBadge risk={sub.tleRiskLevel} />
            <span className="text-xs text-muted-foreground hidden md:block">
              {date.toLocaleDateString()}
            </span>
            {open ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 pb-3 mt-1 space-y-3">
          {/* Code */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
              Code
            </p>
            <pre className="text-xs text-foreground/90 font-mono bg-background/80 border border-border rounded-md p-3 overflow-x-auto max-h-48">
              {sub.codeText}
            </pre>
          </div>

          {/* Edge Cases */}
          {sub.edgeCases.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                Edge Cases
              </p>
              <ul className="space-y-1">
                {sub.edgeCases.map((ec) => (
                  <li
                    key={ec}
                    className="flex items-start gap-2 text-xs text-foreground/80"
                  >
                    <Eye className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    {ec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Optimizations */}
          {sub.optimizationSuggestions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                Optimization Suggestions
              </p>
              <ul className="space-y-1">
                {sub.optimizationSuggestions.map((opt) => (
                  <li
                    key={opt}
                    className="flex items-start gap-2 text-xs text-foreground/80"
                  >
                    <Zap className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function CodeAnalyzerTab() {
  const [language, setLanguage] = useState("Python");
  const [problemTitle, setProblemTitle] = useState("");
  const [codeText, setCodeText] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("O(n)");
  const [spaceComplexity, setSpaceComplexity] = useState("O(1)");
  const [tleRisk, setTleRisk] = useState<TleRiskLevel>(TleRiskLevel.low);
  const [edgeCases, setEdgeCases] = useState<string[]>([""]);
  const [optimizations, setOptimizations] = useState<string[]>([""]);
  const [lastResult, setLastResult] = useState<CodeSubmission | null>(null);

  const submitCode = useSubmitCode();
  const submissionsQuery = useSubmissions(10, 0);

  const updateEdgeCase = (i: number, val: string) => {
    setEdgeCases((prev) => prev.map((v, idx) => (idx === i ? val : v)));
  };

  const removeEdgeCase = (i: number) => {
    setEdgeCases((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateOptimization = (i: number, val: string) => {
    setOptimizations((prev) => prev.map((v, idx) => (idx === i ? val : v)));
  };

  const removeOptimization = (i: number) => {
    setOptimizations((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemTitle.trim()) {
      toast.error("Please enter a problem title");
      return;
    }
    if (!codeText.trim()) {
      toast.error("Please enter your code");
      return;
    }

    try {
      const result = await submitCode.mutateAsync({
        language,
        problemTitle: problemTitle.trim(),
        codeText: codeText.trim(),
        timeComplexity: timeComplexity.trim() || "O(n)",
        spaceComplexity: spaceComplexity.trim() || "O(1)",
        tleRisk,
        edgeCases: edgeCases.filter((e) => e.trim()),
        optimizations: optimizations.filter((o) => o.trim()),
      });
      setLastResult(result);
      toast.success("Code submitted and analyzed!");
    } catch {
      toast.error("Failed to submit code. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Code Analyzer
          </h2>
          <p className="text-xs text-muted-foreground">
            Submit code for analysis and complexity review
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
          {/* Problem Title + Language */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Problem Title
              </Label>
              <Input
                placeholder="Two Sum"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                className="bg-input border-border text-foreground font-mono text-sm"
                data-ocid="analyzer.input"
              />
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger
                  className="bg-input border-border text-foreground"
                  data-ocid="analyzer.language.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang} className="font-mono">
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Code Textarea */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Code
            </Label>
            <Textarea
              placeholder="# Paste your solution here&#10;def twoSum(nums, target):&#10;    seen = {}&#10;    for i, n in enumerate(nums):&#10;        if target - n in seen:&#10;            return [seen[target - n], i]&#10;        seen[n] = i"
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              className="min-h-48 font-mono text-sm bg-background/60 border-border text-foreground resize-y terminal-bg"
              data-ocid="analyzer.code.textarea"
            />
          </div>

          {/* Complexity + TLE */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Time Complexity
              </Label>
              <Input
                placeholder="O(n)"
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
                className="bg-input border-border text-foreground font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Space Complexity
              </Label>
              <Input
                placeholder="O(1)"
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
                className="bg-input border-border text-foreground font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                TLE Risk
              </Label>
              <Select
                value={tleRisk}
                onValueChange={(v) => setTleRisk(v as TleRiskLevel)}
              >
                <SelectTrigger
                  className="bg-input border-border text-foreground"
                  data-ocid="analyzer.tle.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value={TleRiskLevel.low} className="text-primary">
                    Low
                  </SelectItem>
                  <SelectItem
                    value={TleRiskLevel.medium}
                    className="text-yellow-400"
                  >
                    Medium
                  </SelectItem>
                  <SelectItem
                    value={TleRiskLevel.high}
                    className="text-destructive"
                  >
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Edge Cases */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Edge Cases
            </Label>
            {edgeCases.map((ec, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: dynamic ordered list
              <div key={i} className="flex gap-2">
                <Input
                  placeholder={`Edge case ${i + 1}: e.g., empty array, single element...`}
                  value={ec}
                  onChange={(e) => updateEdgeCase(i, e.target.value)}
                  className="bg-input border-border text-foreground text-sm"
                />
                {edgeCases.length > 1 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeEdgeCase(i)}
                    className="h-9 w-9 flex-shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEdgeCases((prev) => [...prev, ""])}
              className="text-primary hover:text-primary/80 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Edge Case
            </Button>
          </div>

          {/* Optimizations */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Optimization Suggestions
            </Label>
            {optimizations.map((opt, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: dynamic ordered list
              <div key={i} className="flex gap-2">
                <Input
                  placeholder={`Suggestion ${i + 1}: e.g., use hashmap instead of nested loop...`}
                  value={opt}
                  onChange={(e) => updateOptimization(i, e.target.value)}
                  className="bg-input border-border text-foreground text-sm"
                />
                {optimizations.length > 1 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeOptimization(i)}
                    className="h-9 w-9 flex-shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOptimizations((prev) => [...prev, ""])}
              className="text-primary hover:text-primary/80 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Suggestion
            </Button>
          </div>

          <Button
            type="submit"
            disabled={submitCode.isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            data-ocid="analyzer.submit_button"
          >
            {submitCode.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit & Analyze
              </>
            )}
          </Button>
        </form>

        {/* Results Panel */}
        <div
          className="lg:col-span-2 space-y-4"
          data-ocid="analyzer.results.panel"
        >
          <AnimatePresence>
            {lastResult && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-lg bg-primary/5 border border-primary/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Analysis Complete
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Problem</span>
                    <span className="text-foreground font-mono font-medium">
                      {lastResult.problemTitle}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Language</span>
                    <span className="text-foreground font-mono">
                      {lastResult.language}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Time</span>
                    <span className="text-foreground font-mono">
                      {lastResult.timeComplexity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Space</span>
                    <span className="text-foreground font-mono">
                      {lastResult.spaceComplexity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-muted-foreground">TLE Risk</span>
                    <TleBadge risk={lastResult.tleRiskLevel} />
                  </div>
                </div>

                {lastResult.edgeCases.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                      Edge Cases ({lastResult.edgeCases.length})
                    </p>
                    <ul className="space-y-1">
                      {lastResult.edgeCases.map((ec) => (
                        <li
                          key={ec}
                          className="text-xs text-foreground/80 flex items-start gap-1.5"
                        >
                          <Eye className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                          {ec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lastResult.optimizationSuggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                      Optimizations ({lastResult.optimizationSuggestions.length}
                      )
                    </p>
                    <ul className="space-y-1">
                      {lastResult.optimizationSuggestions.map((opt) => (
                        <li
                          key={opt}
                          className="text-xs text-foreground/80 flex items-start gap-1.5"
                        >
                          <Zap className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Past Submissions */}
          <div data-ocid="analyzer.submissions.list">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Past Submissions
            </h3>
            {submissionsQuery.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                  <Skeleton key={i} className="h-12 rounded-lg bg-muted/40" />
                ))}
              </div>
            ) : (submissionsQuery.data?.length ?? 0) === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 rounded-lg border border-dashed border-border bg-muted/10">
                <Code2 className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">
                  No submissions yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {submissionsQuery.data?.map((sub) => (
                  <SubmissionCard key={sub.submissionId.toString()} sub={sub} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
