# CodeProgress AI

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Student profile dashboard with input form (name, email, university, graduation year, languages, topics)
- Code submission analyzer: paste code, select language, get analysis (complexity, edge cases, TLE risk, optimizations)
- Learning progress tracker: input problems solved, difficulty breakdown (easy/medium/hard), streak data, consistency score, optimization improvement %, projects
- Skill level classifier (Beginner / Intermediate / Advanced / Competitive) with justification
- Job role recommender (top 5 roles matching strengths)
- Career path suggestions based on profile
- Skill gap analysis with actionable advice
- 60-day personalized roadmap (week-by-week: topics, problems, projects, interview prep, optimization targets)
- ATS-friendly resume generator (auto-builds from profile + progress data)
- Resume Strength Score (out of 100) with category breakdown: Problem Solving, Consistency, Optimization, Language Depth, Project Strength, Advanced Problem Ratio
- Motivational closing summary with growth advice and next-focus recommendation

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend (Motoko):
   - Store student profiles (name, email, university, grad year, languages, topics, skills)
   - Store coding stats (total solved, easy/medium/hard counts, streak data, consistency score, optimization improvement %, projects list)
   - Store code submissions with analysis results
   - CRUD operations for profiles and submissions
   - Compute skill level classification logic
   - Generate job role recommendations based on language/topic strengths
   - Generate resume data structure from stored profile + stats
   - Compute resume strength score breakdown

2. Frontend:
   - Multi-step onboarding / profile setup form
   - Dashboard overview (skill level badge, stats summary, streak display)
   - Code Analyzer tab: code editor textarea, language selector, analysis results panel (complexity, edge cases, TLE risk, suggestions)
   - Progress tab: stats input form, charts for difficulty distribution and topic coverage
   - Career Insights tab: job role cards, career path suggestions, skill gap list
   - Roadmap tab: 60-day week-by-week roadmap display
   - Resume tab: live-generated ATS resume preview + strength score with breakdown
   - Consistent navigation with tabs across all sections
