import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CareerPath,
  CodeSubmission,
  CodingStats,
  Project,
  ResumeData,
  ResumeStrengthBreakdown,
  RoadmapEntry,
  SkillLevel,
  StudentProfile,
  TleRiskLevel,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Profile ──────────────────────────────────────────────────────────────

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<StudentProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<StudentProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      university,
      graduationYear,
      primaryLanguages,
      focusTopics,
    }: {
      name: string;
      email: string;
      university: string;
      graduationYear: bigint;
      primaryLanguages: string[];
      focusTopics: string[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProfile(
        name,
        email,
        university,
        graduationYear,
        primaryLanguages,
        focusTopics,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      void queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      void queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

// ─── Coding Stats ─────────────────────────────────────────────────────────

export function useCodingStats() {
  const { actor, isFetching } = useActor();
  return useQuery<CodingStats>({
    queryKey: ["codingStats"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getCodingStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateCodingStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      totalProblems,
      easy,
      medium,
      hard,
      longestStreak,
      currentStreak,
      consistency,
      optimization,
      completedProjects,
    }: {
      totalProblems: bigint;
      easy: bigint;
      medium: bigint;
      hard: bigint;
      longestStreak: bigint;
      currentStreak: bigint;
      consistency: bigint;
      optimization: bigint;
      completedProjects: Project[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateCodingStats(
        totalProblems,
        easy,
        medium,
        hard,
        longestStreak,
        currentStreak,
        consistency,
        optimization,
        completedProjects,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["codingStats"] });
      void queryClient.invalidateQueries({ queryKey: ["skillLevel"] });
      void queryClient.invalidateQueries({ queryKey: ["jobRoles"] });
      void queryClient.invalidateQueries({ queryKey: ["careerPaths"] });
      void queryClient.invalidateQueries({ queryKey: ["skillGaps"] });
      void queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      void queryClient.invalidateQueries({ queryKey: ["resumeData"] });
    },
  });
}

// ─── Code Submissions ─────────────────────────────────────────────────────

export function useSubmissions(pageSize = 10, pageIndex = 0) {
  const { actor, isFetching } = useActor();
  return useQuery<CodeSubmission[]>({
    queryKey: ["submissions", pageSize, pageIndex],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubmissionsPaginated(
        BigInt(pageSize),
        BigInt(pageIndex),
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      language,
      problemTitle,
      codeText,
      timeComplexity,
      spaceComplexity,
      tleRisk,
      edgeCases,
      optimizations,
    }: {
      language: string;
      problemTitle: string;
      codeText: string;
      timeComplexity: string;
      spaceComplexity: string;
      tleRisk: TleRiskLevel;
      edgeCases: string[];
      optimizations: string[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitCode(
        language,
        problemTitle,
        codeText,
        timeComplexity,
        spaceComplexity,
        tleRisk,
        edgeCases,
        optimizations,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

// ─── Career & Skills ──────────────────────────────────────────────────────

export function useSkillLevel() {
  const { actor, isFetching } = useActor();
  return useQuery<SkillLevel>({
    queryKey: ["skillLevel"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getSkillLevel();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useJobRoles() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["jobRoles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecommendedJobRoles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCareerPaths() {
  const { actor, isFetching } = useActor();
  return useQuery<CareerPath[]>({
    queryKey: ["careerPaths"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCareerPathSuggestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSkillGaps() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["skillGaps"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSkillGaps();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Roadmap ──────────────────────────────────────────────────────────────

export function useRoadmap() {
  const { actor, isFetching } = useActor();
  return useQuery<RoadmapEntry[]>({
    queryKey: ["roadmap"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRoadmap();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Resume ───────────────────────────────────────────────────────────────

export function useResumeData() {
  const { actor, isFetching } = useActor();
  return useQuery<ResumeData>({
    queryKey: ["resumeData"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getResumeData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useResumeStrengthScore() {
  const { actor, isFetching } = useActor();
  return useQuery<number>({
    queryKey: ["resumeScore"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getResumeStrengthScore();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useResumeStrengthBreakdown() {
  const { actor, isFetching } = useActor();
  return useQuery<ResumeStrengthBreakdown>({
    queryKey: ["resumeBreakdown"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getResumeStrengthBreakdown();
    },
    enabled: !!actor && !isFetching,
  });
}
