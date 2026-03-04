import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, Loader2, Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveProfile } from "../hooks/useQueries";

const LANGUAGES = [
  "Python",
  "Java",
  "C++",
  "JavaScript",
  "TypeScript",
  "Go",
  "Rust",
  "C",
  "Kotlin",
  "Swift",
];

const TOPICS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Binary Search",
  "Sorting",
  "Recursion",
  "Backtracking",
  "Hashing",
  "Heaps",
  "Stacks",
  "Queues",
  "Trie",
  "System Design",
  "OOP",
  "Databases",
];

interface ProfileSetupDialogProps {
  open: boolean;
  onSuccess: () => void;
}

export function ProfileSetupDialog({
  open,
  onSuccess,
}: ProfileSetupDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customLang, setCustomLang] = useState("");
  const [customTopic, setCustomTopic] = useState("");

  const saveProfile = useSaveProfile();

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const addCustomLang = () => {
    const trimmed = customLang.trim();
    if (trimmed && !selectedLanguages.includes(trimmed)) {
      setSelectedLanguages((prev) => [...prev, trimmed]);
    }
    setCustomLang("");
  };

  const addCustomTopic = () => {
    const trimmed = customTopic.trim();
    if (trimmed && !selectedTopics.includes(trimmed)) {
      setSelectedTopics((prev) => [...prev, trimmed]);
    }
    setCustomTopic("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !email.trim() ||
      !university.trim() ||
      !graduationYear
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (selectedLanguages.length === 0) {
      toast.error("Please select at least one programming language");
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        university: university.trim(),
        graduationYear: BigInt(Number.parseInt(graduationYear)),
        primaryLanguages: selectedLanguages,
        focusTopics: selectedTopics,
      });
      toast.success("Profile created! Welcome to CodeProgress AI");
      onSuccess();
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <Dialog open={open} data-ocid="profile.dialog">
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl text-foreground">
                Set Up Your Profile
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Tell us about yourself to personalize your experience
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="prof-name" className="text-foreground/80 text-sm">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="prof-name"
                placeholder="Arjun Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-border text-foreground"
                data-ocid="profile.name.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="prof-email"
                className="text-foreground/80 text-sm"
              >
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="prof-email"
                type="email"
                placeholder="arjun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border text-foreground"
                data-ocid="profile.email.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-uni" className="text-foreground/80 text-sm">
                University <span className="text-destructive">*</span>
              </Label>
              <Input
                id="prof-uni"
                placeholder="IIT Bombay"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="bg-input border-border text-foreground"
                data-ocid="profile.university.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-year" className="text-foreground/80 text-sm">
                Graduation Year <span className="text-destructive">*</span>
              </Label>
              <Input
                id="prof-year"
                type="number"
                placeholder="2026"
                min="2024"
                max="2035"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="bg-input border-border text-foreground"
                data-ocid="profile.year.input"
              />
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm">
              Primary Languages <span className="text-destructive">*</span>
            </Label>
            <div
              className="flex flex-wrap gap-2"
              data-ocid="profile.languages.input"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                    selectedLanguages.includes(lang)
                      ? "bg-primary/20 border-primary/60 text-primary"
                      : "bg-muted/30 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            {selectedLanguages.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedLanguages
                  .filter((l) => !LANGUAGES.includes(l))
                  .map((lang) => (
                    <Badge
                      key={lang}
                      variant="outline"
                      className="text-xs border-primary/40 text-primary gap-1"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className="ml-0.5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom language..."
                value={customLang}
                onChange={(e) => setCustomLang(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomLang();
                  }
                }}
                className="bg-input border-border text-foreground text-sm h-8"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addCustomLang}
                className="h-8 border-border"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Topics */}
          <div className="space-y-2">
            <Label className="text-foreground/80 text-sm">Focus Topics</Label>
            <div
              className="flex flex-wrap gap-2"
              data-ocid="profile.topics.input"
            >
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`px-2.5 py-1 rounded text-xs font-sans border transition-all ${
                    selectedTopics.includes(topic)
                      ? "bg-accent/20 border-accent/60 text-accent"
                      : "bg-muted/30 border-border text-muted-foreground hover:border-accent/30 hover:text-foreground"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom topic..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTopic();
                  }
                }}
                className="bg-input border-border text-foreground text-sm h-8"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addCustomTopic}
                className="h-8 border-border"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={saveProfile.isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              data-ocid="profile.save_button"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Launch My Dashboard
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
