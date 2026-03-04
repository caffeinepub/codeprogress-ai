import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  Building2,
  ChevronRight,
  Globe,
  Lightbulb,
  MapPin,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { SkillLevel } from "../backend.d";
import {
  useCareerPaths,
  useJobRoles,
  useSkillGaps,
  useSkillLevel,
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

function skillLevelDescription(level: SkillLevel): string {
  switch (level) {
    case SkillLevel.beginner:
      return "You're building your foundation. Focus on core data structures and algorithms. Consistency is your biggest asset right now.";
    case SkillLevel.intermediate:
      return "You have solid fundamentals and can tackle medium complexity problems. Time to deepen your knowledge in advanced topics like DP and graph algorithms.";
    case SkillLevel.advanced:
      return "You demonstrate strong algorithmic thinking and can solve complex problems efficiently. Focus on system design and advanced optimization techniques.";
    case SkillLevel.competitive:
      return "Elite problem-solving skills. You're ready for top-tier interviews and competitive programming contests at the highest level.";
    default:
      return "Keep coding and improving your skills!";
  }
}

const pathIcons: Record<string, React.ReactNode> = {
  "Product-Based": <Building2 className="w-5 h-5" />,
  "Service-Based": <Globe className="w-5 h-5" />,
  Startup: <TrendingUp className="w-5 h-5" />,
  Freelancing: <Briefcase className="w-5 h-5" />,
  "Remote Jobs": <MapPin className="w-5 h-5" />,
  "Higher Studies": <BookOpen className="w-5 h-5" />,
  "Government Tech": <Building2 className="w-5 h-5" />,
};

const jobRoleDescriptions: string[] = [
  "Strong algorithmic skills and problem-solving expertise align well",
  "Backend system design and API development matches your strengths",
  "Data processing and ML pipeline expertise based on your topics",
  "Full-stack capability demonstrated through project diversity",
  "Competitive programming background suits research-oriented roles",
];

export function CareerInsightsTab() {
  const skillLevelQuery = useSkillLevel();
  const jobRolesQuery = useJobRoles();
  const careerPathsQuery = useCareerPaths();
  const skillGapsQuery = useSkillGaps();

  const skillLevel = skillLevelQuery.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-chart-4/20 border border-chart-4/30 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-chart-4" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Career Insights
          </h2>
          <p className="text-xs text-muted-foreground">
            Personalized career guidance based on your profile
          </p>
        </div>
      </div>

      {/* Skill Level */}
      <Card
        className="bg-card border-border"
        data-ocid="career.skill_level.card"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Current Skill Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          {skillLevelQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-32 bg-muted/40" />
              <Skeleton className="h-4 w-full bg-muted/40" />
            </div>
          ) : skillLevel !== undefined ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Badge
                className={`text-sm px-4 py-1.5 border font-semibold ${skillLevelClass(skillLevel)}`}
              >
                <Trophy className="w-3.5 h-3.5 mr-1.5" />
                {skillLevelLabel(skillLevel)}
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {skillLevelDescription(skillLevel)}
              </p>
            </motion.div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Update your coding stats to see your skill level
            </p>
          )}
        </CardContent>
      </Card>

      {/* Job Roles */}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Recommended Job Roles
        </h3>
        <div className="space-y-2" data-ocid="career.job_roles.list">
          {jobRolesQuery.isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <Skeleton key={i} className="h-16 rounded-lg bg-muted/40" />
            ))
          ) : (jobRolesQuery.data?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center py-8 text-center rounded-lg border border-dashed border-border bg-muted/10">
              <Briefcase className="w-6 h-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Update your stats to get job recommendations
              </p>
            </div>
          ) : (
            jobRolesQuery.data?.slice(0, 5).map((role, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
                data-ocid={`career.job_roles.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {jobRoleDescriptions[i] ??
                        "Strong match based on your skills"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Career Paths */}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-chart-2" />
          Career Paths
        </h3>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          data-ocid="career.paths.list"
        >
          {careerPathsQuery.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <Skeleton key={i} className="h-24 rounded-lg bg-muted/40" />
            ))
          ) : (careerPathsQuery.data?.length ?? 0) === 0 ? (
            <div className="col-span-2 flex flex-col items-center py-8 text-center rounded-lg border border-dashed border-border bg-muted/10">
              <MapPin className="w-6 h-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Update your stats to see career path suggestions
              </p>
            </div>
          ) : (
            careerPathsQuery.data?.map((path, i) => (
              <motion.div
                key={path.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-4 rounded-lg bg-card border border-border hover:border-chart-2/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-chart-2/10 border border-chart-2/20 flex items-center justify-center text-chart-2 flex-shrink-0">
                    {pathIcons[path.name] ?? <TrendingUp className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {path.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {path.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Skill Gaps */}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-chart-4" />
          Skill Gaps to Address
        </h3>
        <div className="space-y-2" data-ocid="career.gaps.list">
          {skillGapsQuery.isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <Skeleton key={i} className="h-10 rounded-lg bg-muted/40" />
            ))
          ) : (skillGapsQuery.data?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center py-8 text-center rounded-lg border border-dashed border-border bg-muted/10">
              <Lightbulb className="w-6 h-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No skill gaps identified yet
              </p>
            </div>
          ) : (
            skillGapsQuery.data?.map((gap, i) => (
              <motion.div
                key={gap}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-chart-4/5 border border-chart-4/20 hover:border-chart-4/40 transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/90">{gap}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
