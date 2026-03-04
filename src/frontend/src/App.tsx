import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Code2,
  FileText,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  Map as MapIcon,
  Terminal,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CareerInsightsTab } from "./components/CareerInsightsTab";
import { CodeAnalyzerTab } from "./components/CodeAnalyzerTab";
import { DashboardTab } from "./components/DashboardTab";
import { ProfileSetupDialog } from "./components/ProfileSetupDialog";
import { ProgressTab } from "./components/ProgressTab";
import { ResumeTab } from "./components/ResumeTab";
import { RoadmapTab } from "./components/RoadmapTab";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useCallerProfile } from "./hooks/useQueries";

const TABS = [
  {
    id: "dashboard",
    label: "Dashboard",
    shortLabel: "Dash",
    icon: LayoutDashboard,
  },
  { id: "analyzer", label: "Code Analyzer", shortLabel: "Code", icon: Code2 },
  {
    id: "progress",
    label: "Progress",
    shortLabel: "Progress",
    icon: TrendingUp,
  },
  { id: "career", label: "Career", shortLabel: "Career", icon: Briefcase },
  { id: "roadmap", label: "Roadmap", shortLabel: "Roadmap", icon: MapIcon },
  { id: "resume", label: "Resume", shortLabel: "Resume", icon: FileText },
];

function LoginScreen({
  onLogin,
  isLoggingIn,
}: { onLogin: () => void; isLoggingIn: boolean }) {
  return (
    <div className="min-h-screen bg-background grid-noise flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-primary">
            <Terminal className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              CodeProgress
              <span className="text-primary"> AI</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Career & Code Intelligence for Students
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 text-left">
          {[
            "Analyze code complexity & edge cases",
            "Track your DSA progress & streaks",
            "Get personalized career guidance",
            "Generate ATS-ready resume",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2.5 text-sm text-muted-foreground"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        <Button
          onClick={onLogin}
          disabled={isLoggingIn}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-5"
          data-ocid="auth.login_button"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In to Get Started
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground/60">
          Secured by Internet Identity · No passwords needed
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const { login, clear, isLoggingIn, isInitializing, identity } =
    useInternetIdentity();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);

  const callerProfileQuery = useCallerProfile();

  // Check if profile needs setup
  useEffect(() => {
    if (identity && !callerProfileQuery.isLoading && !profileChecked) {
      if (callerProfileQuery.data === null) {
        setShowProfileSetup(true);
      }
      setProfileChecked(true);
    }
  }, [
    identity,
    callerProfileQuery.data,
    callerProfileQuery.isLoading,
    profileChecked,
  ]);

  // Reset profile check on logout
  useEffect(() => {
    if (!identity) {
      setProfileChecked(false);
      setShowProfileSetup(false);
    }
  }, [identity]);

  // Loading screen
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-primary animate-pulse-glow" />
          </div>
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!identity) {
    return (
      <>
        <LoginScreen onLogin={login} isLoggingIn={isLoggingIn} />
        <Toaster theme="dark" />
      </>
    );
  }

  const principalStr = identity.getPrincipal().toString();
  const shortPrincipal = `${principalStr.slice(0, 5)}...${principalStr.slice(-3)}`;

  return (
    <div className="min-h-screen bg-background grid-noise">
      {/* Profile Setup Dialog */}
      <ProfileSetupDialog
        open={showProfileSetup}
        onSuccess={() => setShowProfileSetup(false)}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground text-lg leading-none">
              CodeProgress<span className="text-primary">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/30 border border-border">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                {shortPrincipal}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-foreground h-8"
              data-ocid="auth.logout_button"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden sm:inline text-xs">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Tab Navigation */}
          <TabsList className="bg-card border border-border h-auto p-1 flex flex-wrap gap-1 w-full">
            {TABS.map(({ id, label, shortLabel, icon: Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/30 rounded-md transition-all"
                data-ocid={`nav.${id}.tab`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="dashboard" className="mt-0">
            <DashboardTab />
          </TabsContent>

          <TabsContent value="analyzer" className="mt-0">
            <CodeAnalyzerTab />
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            <ProgressTab />
          </TabsContent>

          <TabsContent value="career" className="mt-0">
            <CareerInsightsTab />
          </TabsContent>

          <TabsContent value="roadmap" className="mt-0">
            <RoadmapTab />
          </TabsContent>

          <TabsContent value="resume" className="mt-0">
            <ResumeTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with{" "}
            <span className="text-primary">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster theme="dark" richColors />
    </div>
  );
}
