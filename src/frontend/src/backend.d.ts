import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ResumeStrengthBreakdown {
    problemSolving: number;
    projectStrength: number;
    consistency: number;
    languageDepth: number;
    advancedProblemRatio: number;
    optimization: number;
}
export type Time = bigint;
export interface CodeSubmission {
    problemTitle: string;
    optimizationSuggestions: Array<Optimization>;
    language: Language;
    codeText: string;
    edgeCases: Array<EdgeCase>;
    tleRiskLevel: TleRiskLevel;
    timeComplexity: Complexity;
    submissionTime: Time;
    submissionId: SubmissionId;
    spaceComplexity: Complexity;
}
export type InterviewFocus = string;
export type Language = string;
export type ProjectName = string;
export type SubmissionId = bigint;
export type Complexity = string;
export type JobRole = string;
export interface ComprehensiveUserRecordView {
    roadmap: Array<RoadmapEntry>;
    codingStats: CodingStats;
    skillGaps: Array<string>;
    submissions: Array<CodeSubmission>;
    recommendedJobRoles: Array<JobRole>;
    resumeData: ResumeData;
    careerPathSuggestions: Array<CareerPath>;
    skillLevel: SkillLevel;
    profile: StudentProfile;
}
export interface CareerPath {
    name: string;
    description: string;
}
export interface ResumeData {
    keyStrengths: Array<string>;
    strengthBreakdown: ResumeStrengthBreakdown;
    technicalSkills: Array<string>;
    projects: Array<Project>;
    strengthScore: number;
    codingAchievements: string;
    header: ResumeHeader;
}
export type EdgeCase = string;
export type ProjectSuggestion = string;
export interface ResumeHeader {
    name: string;
    graduationYear: bigint;
    email: string;
    university: string;
}
export interface RoadmapEntry {
    problemsTargetCount: bigint;
    optimizationTargetPercent: OptimizationTarget;
    interviewFocus: InterviewFocus;
    weekNumber: WeekNumber;
    topics: Array<Topic>;
    projectSuggestion: ProjectSuggestion;
}
export interface CodingStats {
    totalEasyProblemsSolved: bigint;
    totalHardProblemsSolved: bigint;
    totalMediumProblemsSolved: bigint;
    totalProblemsSolved: bigint;
    optimizationImprovementPercent: bigint;
    completedProjects: Array<Project>;
    longestStreakDays: bigint;
    consistencyScore: bigint;
    currentDayStreak: bigint;
}
export type UserId = Principal;
export interface StudentProfile {
    primaryLanguages: Array<Language>;
    name: string;
    graduationYear: bigint;
    email: string;
    university: string;
    focusTopics: Array<Topic>;
}
export type OptimizationTarget = number;
export type TechStack = string;
export type WeekNumber = bigint;
export type Topic = string;
export interface Project {
    name: ProjectName;
    description: string;
    techStack: Array<TechStack>;
}
export type Optimization = string;
export enum SkillLevel {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced",
    competitive = "competitive"
}
export enum TleRiskLevel {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptCycles(): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllUserRecords(): Promise<Array<ComprehensiveUserRecordView>>;
    getAllUserRecordsByEmail(): Promise<Array<ComprehensiveUserRecordView>>;
    getCallerUserProfile(): Promise<StudentProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCareerPathSuggestions(): Promise<Array<CareerPath>>;
    getCodingStats(): Promise<CodingStats>;
    getProfile(): Promise<StudentProfile>;
    getRecommendedJobRoles(): Promise<Array<string>>;
    getResumeData(): Promise<ResumeData>;
    getResumeStrengthBreakdown(): Promise<ResumeStrengthBreakdown>;
    getResumeStrengthScore(): Promise<number>;
    getRoadmap(): Promise<Array<RoadmapEntry>>;
    getSkillGaps(): Promise<Array<string>>;
    getSkillLevel(): Promise<SkillLevel>;
    getSubmissionById(submissionId: SubmissionId): Promise<CodeSubmission>;
    getUserProfile(user: Principal): Promise<StudentProfile | null>;
    getUserRecordById(userId: UserId): Promise<ComprehensiveUserRecordView>;
    getVersion(): Promise<string>;
    getWalletBalance(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    listSubmissionsPaginated(pageSize: bigint, pageIndex: bigint): Promise<Array<CodeSubmission>>;
    saveCallerUserProfile(profile: StudentProfile): Promise<void>;
    submitCode(language: string, problemTitle: string, codeText: string, timeComplexity: string, spaceComplexity: string, tleRisk: TleRiskLevel, edgeCases: Array<string>, optimizations: Array<string>): Promise<CodeSubmission>;
    updateCodingStats(totalProblems: bigint, easy: bigint, medium: bigint, hard: bigint, longestStreak: bigint, currentStreak: bigint, consistency: bigint, optimization: bigint, completedProjects: Array<Project>): Promise<CodingStats>;
    updateProfile(name: string, email: string, university: string, graduationYear: bigint, primaryLanguages: Array<string>, focusTopics: Array<string>): Promise<StudentProfile>;
}
