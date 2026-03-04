import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type UserId = Principal;
  type SubmissionId = Nat64;

  type PrimaryKey = UserId;

  type Language = Text;
  type Topic = Text;
  type TechStack = Text;
  type ProjectName = Text;
  type Complexity = Text;
  type EdgeCase = Text;
  type Optimization = Text;
  type Problem = Text;
  type WeekNumber = Nat; // Week number (1-9)
  type ProjectSuggestion = Text;
  type InterviewFocus = Text;
  type OptimizationTarget = Nat8; // Percentage

  type CodingStats = {
    totalProblemsSolved : Nat;
    totalEasyProblemsSolved : Nat;
    totalMediumProblemsSolved : Nat;
    totalHardProblemsSolved : Nat;
    longestStreakDays : Nat;
    currentDayStreak : Nat;
    consistencyScore : Nat; // 0-100
    optimizationImprovementPercent : Nat; // 0-100
    completedProjects : [Project];
  };

  type CodeSubmission = {
    submissionId : SubmissionId;
    language : Language;
    problemTitle : Text;
    codeText : Text;
    timeComplexity : Complexity;
    spaceComplexity : Complexity;
    tleRiskLevel : TleRiskLevel;
    edgeCases : [EdgeCase];
    optimizationSuggestions : [Optimization];
    submissionTime : Time.Time;
  };

  type TleRiskLevel = {
    #low;
    #medium;
    #high;
  };

  module TleRiskLevel {
    public func compare(left : TleRiskLevel, right : TleRiskLevel) : Order.Order {
      let toNat8 = func(x : TleRiskLevel) : Nat8 {
        switch (x) {
          case (#low) { 0 };
          case (#medium) { 1 };
          case (#high) { 2 };
        };
      };
      Nat8.compare(toNat8(left), toNat8(right));
    };
  };

  type Project = {
    name : ProjectName;
    description : Text;
    techStack : [TechStack];
  };

  type SkillLevel = {
    #beginner;
    #intermediate;
    #advanced;
    #competitive;
  };

  module SkillLevel {
    public func compare(left : SkillLevel, right : SkillLevel) : Order.Order {
      let toNat8 = func(x : SkillLevel) : Nat8 {
        switch (x) {
          case (#beginner) { 0 };
          case (#intermediate) { 1 };
          case (#advanced) { 2 };
          case (#competitive) { 3 };
        };
      };
      Nat8.compare(toNat8(left), toNat8(right));
    };
  };

  type JobRole = Text;

  type CareerPath = {
    name : Text;
    description : Text;
  };

  type RoadmapEntry = {
    weekNumber : WeekNumber;
    topics : [Topic];
    problemsTargetCount : Nat;
    projectSuggestion : ProjectSuggestion;
    interviewFocus : InterviewFocus;
    optimizationTargetPercent : OptimizationTarget;
  };

  type ResumeHeader = {
    name : Text;
    email : Text;
    university : Text;
    graduationYear : Nat;
  };

  type ResumeStrengthBreakdown = {
    problemSolving : Nat8;
    consistency : Nat8;
    optimization : Nat8;
    languageDepth : Nat8;
    projectStrength : Nat8;
    advancedProblemRatio : Nat8;
  };

  type ResumeData = {
    header : ResumeHeader;
    technicalSkills : [Text]; // Sorted by strength
    codingAchievements : Text;
    projects : [Project];
    keyStrengths : [Text];
    strengthScore : Nat8; // 0-100
    strengthBreakdown : ResumeStrengthBreakdown;
  };

  type StudentProfile = {
    name : Text;
    email : Text;
    university : Text;
    graduationYear : Nat;
    primaryLanguages : [Language];
    focusTopics : [Topic];
  };

  type ComprehensiveUserRecord = {
    profile : StudentProfile;
    codingStats : CodingStats;
    submissions : [CodeSubmission];
    skillLevel : SkillLevel;
    recommendedJobRoles : [JobRole];
    careerPathSuggestions : [CareerPath];
    skillGaps : [Text];
    roadmap : [RoadmapEntry];
    resumeData : ResumeData;
  };

  type ComprehensiveUserRecordView = {
    profile : StudentProfile;
    codingStats : CodingStats;
    submissions : [CodeSubmission];
    skillLevel : SkillLevel;
    recommendedJobRoles : [JobRole];
    careerPathSuggestions : [CareerPath];
    skillGaps : [Text];
    roadmap : [RoadmapEntry];
    resumeData : ResumeData;
  };

  module ComprehensiveUserRecordView {
    public func compare(left : ComprehensiveUserRecordView, right : ComprehensiveUserRecordView) : Order.Order {
      Text.compare(left.profile.email, right.profile.email);
    };
  };

  // In-memory storage for user records and submission IDs
  let userRecords = Map.empty<PrimaryKey, ComprehensiveUserRecord>();
  var currentSubmissionId : SubmissionId = 0;

  // Authorization System
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var walletBalance = 0;

  public shared ({ caller }) func acceptCycles() : async () {
    walletBalance += 0;
  };

  public query ({ caller }) func getWalletBalance() : async Nat {
    walletBalance;
  };

  public query ({ caller }) func getVersion() : async Text {
    "1.0.0";
  };

  // PRIVATE UTILITY FOLLOWING METHODS
  func paginateSubmissions(submissions : [CodeSubmission], pageSize : Nat, pageIndex : Nat) : [CodeSubmission] {
    let total = submissions.size();
    if (pageSize == 0 or pageIndex * pageSize >= total) { return [] };
    let start = pageIndex * pageSize;
    let end = if (start + pageSize > total) { total } else { start + pageSize };
    Array.tabulate(end - start, func(i) { submissions[start + i] });
  };

  func getNextSubmissionId() : SubmissionId {
    currentSubmissionId += 1;
    currentSubmissionId;
  };

  func getCompleteUserRecord(caller : Principal) : ComprehensiveUserRecord {
    switch (userRecords.get(caller)) {
      case (null) { Runtime.trap("No existing user record found! ") };
      case (?record) { record };
    };
  };

  // 1. PROFILE MANAGEMENT

  public shared ({ caller }) func updateProfile(name : Text, email : Text, university : Text, graduationYear : Nat, primaryLanguages : [Text], focusTopics : [Text]) : async StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    let profile : StudentProfile = {
      name;
      email;
      university;
      graduationYear;
      primaryLanguages;
      focusTopics;
    };

    let existingRecord = getCompleteUserRecord(caller);

    let updatedRecord : ComprehensiveUserRecord = {
      profile;
      codingStats = existingRecord.codingStats;
      submissions = existingRecord.submissions;
      skillLevel = existingRecord.skillLevel;
      recommendedJobRoles = existingRecord.recommendedJobRoles;
      careerPathSuggestions = existingRecord.careerPathSuggestions;
      skillGaps = existingRecord.skillGaps;
      roadmap = existingRecord.roadmap;
      resumeData = existingRecord.resumeData;
    };

    userRecords.add(caller, updatedRecord);
    profile;
  };

  public query ({ caller }) func getProfile() : async StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    getCompleteUserRecord(caller).profile;
  };

  // 2. CODING STATS MANAGEMENT

  public shared ({ caller }) func updateCodingStats(totalProblems : Nat, easy : Nat, medium : Nat, hard : Nat, longestStreak : Nat, currentStreak : Nat, consistency : Nat, optimization : Nat, completedProjects : [Project]) : async CodingStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update coding stats");
    };

    let stats : CodingStats = {
      totalProblemsSolved = totalProblems;
      totalEasyProblemsSolved = easy;
      totalMediumProblemsSolved = medium;
      totalHardProblemsSolved = hard;
      longestStreakDays = longestStreak;
      currentDayStreak = currentStreak;
      consistencyScore = consistency;
      optimizationImprovementPercent = optimization;
      completedProjects;
    };

    let existingRecord = getCompleteUserRecord(caller);

    let updatedRecord : ComprehensiveUserRecord = {
      profile = existingRecord.profile;
      codingStats = stats;
      submissions = existingRecord.submissions;
      skillLevel = existingRecord.skillLevel;
      recommendedJobRoles = existingRecord.recommendedJobRoles;
      careerPathSuggestions = existingRecord.careerPathSuggestions;
      skillGaps = existingRecord.skillGaps;
      roadmap = existingRecord.roadmap;
      resumeData = existingRecord.resumeData;
    };

    userRecords.add(caller, updatedRecord);
    stats;
  };

  public query ({ caller }) func getCodingStats() : async CodingStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view coding stats");
    };
    getCompleteUserRecord(caller).codingStats;
  };

  // 3. CODE SUBMISSIONS

  public shared ({ caller }) func submitCode(language : Text, problemTitle : Text, codeText : Text, timeComplexity : Text, spaceComplexity : Text, tleRisk : TleRiskLevel, edgeCases : [Text], optimizations : [Text]) : async CodeSubmission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit code");
    };

    let submission : CodeSubmission = {
      submissionId = getNextSubmissionId();
      language;
      problemTitle;
      codeText;
      timeComplexity;
      spaceComplexity;
      tleRiskLevel = tleRisk;
      edgeCases;
      optimizationSuggestions = optimizations;
      submissionTime = Time.now();
    };

    let existingRecord = getCompleteUserRecord(caller);

    let updatedRecord : ComprehensiveUserRecord = {
      profile = existingRecord.profile;
      codingStats = existingRecord.codingStats;
      submissions = existingRecord.submissions.concat([submission]);
      skillLevel = existingRecord.skillLevel;
      recommendedJobRoles = existingRecord.recommendedJobRoles;
      careerPathSuggestions = existingRecord.careerPathSuggestions;
      skillGaps = existingRecord.skillGaps;
      roadmap = existingRecord.roadmap;
      resumeData = existingRecord.resumeData;
    };

    userRecords.add(caller, updatedRecord);
    submission;
  };

  public query ({ caller }) func listSubmissionsPaginated(pageSize : Nat, pageIndex : Nat) : async [CodeSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list submissions");
    };
    paginateSubmissions(getCompleteUserRecord(caller).submissions, pageSize, pageIndex);
  };

  public query ({ caller }) func getSubmissionById(submissionId : SubmissionId) : async CodeSubmission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view submissions");
    };
    switch (getCompleteUserRecord(caller).submissions.find(func(sub) { sub.submissionId == submissionId })) {
      case (null) { Runtime.trap("Submission not found: " # submissionId.toText()) };
      case (?submission) { submission };
    };
  };

  // 4. SKILL ANALYSIS

  public query ({ caller }) func getSkillLevel() : async SkillLevel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view skill level");
    };
    getCompleteUserRecord(caller).skillLevel;
  };

  public query ({ caller }) func getRecommendedJobRoles() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view recommended job roles");
    };
    getCompleteUserRecord(caller).recommendedJobRoles;
  };

  public query ({ caller }) func getCareerPathSuggestions() : async [CareerPath] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view career path suggestions");
    };
    getCompleteUserRecord(caller).careerPathSuggestions;
  };

  public query ({ caller }) func getSkillGaps() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view skill gaps");
    };
    getCompleteUserRecord(caller).skillGaps;
  };

  // 5. ROADMAP

  public query ({ caller }) func getRoadmap() : async [RoadmapEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view roadmap");
    };
    getCompleteUserRecord(caller).roadmap;
  };

  // 6. RESUME DATA

  public query ({ caller }) func getResumeData() : async ResumeData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resume data");
    };
    getCompleteUserRecord(caller).resumeData;
  };

  public query ({ caller }) func getResumeStrengthScore() : async Nat8 {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resume strength score");
    };
    getCompleteUserRecord(caller).resumeData.strengthScore;
  };

  public query ({ caller }) func getResumeStrengthBreakdown() : async ResumeStrengthBreakdown {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resume strength breakdown");
    };
    getCompleteUserRecord(caller).resumeData.strengthBreakdown;
  };

  // ADMIN-ONLY FUNCTIONS

  public query ({ caller }) func getAllUserRecords() : async [ComprehensiveUserRecordView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user records");
    };
    getAllUserRecordsInternal();
  };

  public query ({ caller }) func getAllUserRecordsByEmail() : async [ComprehensiveUserRecordView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user records");
    };
    getAllUserRecordsInternal().sort();
  };

  public query ({ caller }) func getUserRecordById(userId : UserId) : async ComprehensiveUserRecordView {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own record or must be admin");
    };
    convertToComprehensiveUserRecordView(getCompleteUserRecord(userId));
  };

  // HELPER FUNCTIONS

  func getAllUserRecordsInternal() : [ComprehensiveUserRecordView] {
    userRecords.entries().toArray().map(func((_, record)) { convertToComprehensiveUserRecordView(record) });
  };

  func convertToComprehensiveUserRecordView(record : ComprehensiveUserRecord) : ComprehensiveUserRecordView {
    let profile = record.profile;
    let codingStats = record.codingStats;
    let submissions = record.submissions;
    let skillLevel = record.skillLevel;
    let recommendedJobRoles = record.recommendedJobRoles;
    let careerPathSuggestions = record.careerPathSuggestions;
    let skillGaps = record.skillGaps;
    let roadmap = record.roadmap;
    let resumeData = record.resumeData;

    {
      profile;
      codingStats;
      submissions;
      skillLevel;
      recommendedJobRoles;
      careerPathSuggestions;
      skillGaps;
      roadmap;
      resumeData;
    };
  };

  // USER PROFILE MANAGEMENT (Required by frontend)

  public query ({ caller }) func getCallerUserProfile() : async ?StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (userRecords.get(caller)) {
      case (null) { null };
      case (?record) { ?record.profile };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?StudentProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userRecords.get(user)) {
      case (null) { null };
      case (?record) { ?record.profile };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let existingRecordOpt = userRecords.get(caller);

    let updatedRecord : ComprehensiveUserRecord = switch (existingRecordOpt) {
      case (null) {
        // Create new record with default values
        {
          profile;
          codingStats = {
            totalProblemsSolved = 0;
            totalEasyProblemsSolved = 0;
            totalMediumProblemsSolved = 0;
            totalHardProblemsSolved = 0;
            longestStreakDays = 0;
            currentDayStreak = 0;
            consistencyScore = 0;
            optimizationImprovementPercent = 0;
            completedProjects = [];
          };
          submissions = [];
          skillLevel = #beginner;
          recommendedJobRoles = [];
          careerPathSuggestions = [];
          skillGaps = [];
          roadmap = [];
          resumeData = {
            header = {
              name = profile.name;
              email = profile.email;
              university = profile.university;
              graduationYear = profile.graduationYear;
            };
            technicalSkills = [];
            codingAchievements = "";
            projects = [];
            keyStrengths = [];
            strengthScore = 0;
            strengthBreakdown = {
              problemSolving = 0;
              consistency = 0;
              optimization = 0;
              languageDepth = 0;
              projectStrength = 0;
              advancedProblemRatio = 0;
            };
          };
        };
      };
      case (?existingRecord) {
        {
          profile;
          codingStats = existingRecord.codingStats;
          submissions = existingRecord.submissions;
          skillLevel = existingRecord.skillLevel;
          recommendedJobRoles = existingRecord.recommendedJobRoles;
          careerPathSuggestions = existingRecord.careerPathSuggestions;
          skillGaps = existingRecord.skillGaps;
          roadmap = existingRecord.roadmap;
          resumeData = existingRecord.resumeData;
        };
      };
    };

    userRecords.add(caller, updatedRecord);
  };
};
