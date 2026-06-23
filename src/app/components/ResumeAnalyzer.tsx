import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  Lightbulb,
  RefreshCcw,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
} from "lucide-react";

type ScoreLevel = "green" | "yellow" | "red";

type AnalysisCard = {
  label: string;
  score: number;
  detail: string;
};

type ResumeAnalysis = {
  atsScore: number;
  jobMatch: number;
  technicalSkillsScore: number;
  experienceScore: number;
  educationScore: number;
  communicationScore: number;
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingKeywords: string[];
  foundKeywords: string[];
};

const softwareEngineerKeywords = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "REST APIs",
  "SQL",
  "Git",
  "Testing",
  "Cloud",
  "CI/CD",
  "Agile",
  "Data Structures",
];

const recommendations = [
  "Add measurable achievements with numbers, percentages, or business impact.",
  "Improve keywords by mirroring language from Software Engineer job descriptions.",
  "Add missing technical skills such as testing, cloud, APIs, and CI/CD.",
  "Improve formatting with consistent headings, spacing, and bullet structure.",
];

const getScoreLevel = (score: number): ScoreLevel => {
  if (score >= 80) return "green";
  if (score >= 60) return "yellow";
  return "red";
};

const getScoreColor = (score: number) => {
  const level = getScoreLevel(score);
  if (level === "green") return "#10B981";
  if (level === "yellow") return "#F59E0B";
  return "#EF4444";
};

const clampScore = (score: number) => Math.max(0, Math.min(100, score));

const createMockResumeText = (file: File) => {
  const normalizedName = file.name.toLowerCase();
  const inferredSkills = softwareEngineerKeywords.filter((keyword) =>
    normalizedName.includes(keyword.toLowerCase().replace(/[^a-z0-9]/g, ""))
  );
  const sizeSignal = file.size > 250000 ? "detailed experience projects" : "";

  return [
    normalizedName,
    inferredSkills.join(" "),
    sizeSignal,
    "software engineer react javascript git project internship education",
  ].join(" ");
};

const analyzeResume = (file: File): ResumeAnalysis => {
  const mockContent = createMockResumeText(file);
  const fileName = file.name.toLowerCase();
  const isPdf = file.type.includes("pdf") || fileName.endsWith(".pdf");
  const isDocx =
    file.type.includes("wordprocessingml") || fileName.endsWith(".docx");
  const formatBonus = isPdf || isDocx ? 12 : 4;
  const lengthBonus = file.size > 120000 ? 12 : file.size > 40000 ? 8 : 4;
  const hasEngineerSignal = /software|developer|engineer|frontend|backend/.test(
    mockContent
  );
  const foundKeywords = softwareEngineerKeywords.filter((keyword) =>
    mockContent.toLowerCase().includes(keyword.toLowerCase().replace(".", ""))
  );
  const missingKeywords = softwareEngineerKeywords.filter(
    (keyword) => !foundKeywords.includes(keyword)
  );

  const keywordScore = Math.round(
    (foundKeywords.length / softwareEngineerKeywords.length) * 100
  );
  const technicalSkillsScore = clampScore(48 + keywordScore * 0.4 + formatBonus);
  const experienceScore = clampScore(
    54 + lengthBonus + (hasEngineerSignal ? 14 : 0)
  );
  const educationScore = clampScore(72 + (mockContent.includes("education") ? 8 : 0));
  const communicationScore = clampScore(68 + formatBonus + (file.size > 90000 ? 7 : 0));
  const atsScore = clampScore(
    Math.round(
      technicalSkillsScore * 0.35 +
        experienceScore * 0.25 +
        educationScore * 0.15 +
        communicationScore * 0.25
    )
  );
  const jobMatch = clampScore(
    Math.round(keywordScore * 0.65 + experienceScore * 0.25 + formatBonus)
  );

  return {
    atsScore,
    jobMatch,
    technicalSkillsScore,
    experienceScore,
    educationScore,
    communicationScore,
    missingSkills: missingKeywords.slice(0, 5),
    strengths: [
      isPdf || isDocx
        ? "Uses a recruiter-friendly resume file format"
        : "Upload completed successfully for analysis",
      "Includes signals aligned with Software Engineer preparation",
      "Has enough structure for ATS-style scoring and section review",
    ],
    weaknesses: [
      missingKeywords.length > 4
        ? "Technical keyword coverage is lighter than ideal"
        : "Keyword coverage can still be sharpened for target roles",
      "Impact metrics and measurable outcomes need stronger emphasis",
      "Project bullets should more clearly connect tools to business results",
    ],
    suggestions: recommendations,
    missingKeywords,
    foundKeywords,
  };
};

function CircularScore({ score, label }: { score: number; label: string }) {
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-40 h-40 rounded-full p-3 shadow-inner"
        style={{
          background: `conic-gradient(${color} ${score * 3.6}deg, #E2E8F0 0deg)`,
        }}
      >
        <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center border border-slate-100">
          <span className="text-4xl font-semibold text-slate-950">{score}</span>
          <span className="text-sm text-slate-500">/100</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-700">{label}</p>
    </div>
  );
}

function ScoreCard({ card }: { card: AnalysisCard }) {
  const color = getScoreColor(card.score);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="text-3xl font-semibold text-slate-950 mt-1">
            {card.score}%
          </p>
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18` }}
        >
          <TrendingUp className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 mb-3">
        <div
          className="h-2 rounded-full"
          style={{ width: `${card.score}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-sm text-slate-500">{card.detail}</p>
    </div>
  );
}

export function ResumeAnalyzer() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [uploadError, setUploadError] = useState("");

  const analysisCards = useMemo<AnalysisCard[]>(() => {
    if (!analysis) return [];

    return [
      {
        label: "ATS Score",
        score: analysis.atsScore,
        detail: "Overall ATS readability, structure, and keyword alignment.",
      },
      {
        label: "Technical Skills Score",
        score: analysis.technicalSkillsScore,
        detail: "Coverage of core Software Engineer tools and technologies.",
      },
      {
        label: "Experience Score",
        score: analysis.experienceScore,
        detail: "Strength of projects, role relevance, and impact language.",
      },
      {
        label: "Education Score",
        score: analysis.educationScore,
        detail: "Education section clarity and baseline role fit.",
      },
      {
        label: "Communication Score",
        score: analysis.communicationScore,
        detail: "Resume clarity, formatting consistency, and readability.",
      },
    ];
  }, [analysis]);

  const handleFile = (file?: File) => {
    if (!file) return;

    const isSupported =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf") ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isSupported) {
      setUploadError("Please upload a PDF or DOCX resume.");
      return;
    }

    setUploadError("");
    setUploadedFile(file);
    setAnalysis(null);
    setUploadProgress(0);

    let progress = 0;
    const timer: ReturnType<typeof setInterval> = setInterval(() => {
      progress += 20;
      setUploadProgress(Math.min(progress, 100));

      if (progress >= 100) {
        clearInterval(timer);
        setAnalysis(analyzeResume(file));
      }
    }, 180);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  };

  const resetAnalyzer = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setAnalysis(null);
    setUploadError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 text-slate-950">
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              AI-ready resume intelligence
            </div>
            <h1 className="text-3xl font-semibold text-slate-950 mb-3">
              Resume Analyzer
            </h1>
            <p className="text-slate-600 max-w-2xl">
              Upload your resume for ATS scoring, Software Engineer job-match
              analysis, missing keyword detection, and practical improvement
              recommendations.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[260px]">
            <div className="rounded-xl bg-[#2563EB] p-4 text-white">
              <p className="text-2xl font-semibold">
                {analysis?.atsScore ?? "--"}
              </p>
              <p className="text-sm text-blue-100">ATS Score</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-2xl font-semibold text-slate-950">
                {analysis?.jobMatch ?? "--"}
              </p>
              <p className="text-sm text-slate-500">Job Match</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Resume Upload
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Supports PDF and DOCX files.
              </p>
            </div>
            {uploadedFile && (
              <button
                type="button"
                onClick={resetAnalyzer}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleInputChange}
            className="hidden"
          />

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              isDragging
                ? "border-[#2563EB] bg-[#2563EB]/5"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h3 className="text-lg font-semibold text-slate-950 mb-2">
              Drag and drop your resume
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              Upload a PDF or DOCX file to generate a mock AI analysis.
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-white hover:bg-[#1D4ED8] transition-colors"
            >
              <FileText className="w-4 h-4" />
              Browse Files
            </button>
          </div>

          {uploadError && (
            <div className="mt-4 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#B91C1C]">
              {uploadError}
            </div>
          )}

          {uploadedFile && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-950 truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500">Upload progress</span>
                <span className="font-medium text-slate-700">
                  {uploadProgress}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-[#2563EB] transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                ATS Analysis
              </h2>
              <p className="text-sm text-slate-500">
                Color-coded score based on ATS readiness.
              </p>
            </div>
          </div>

          {analysis ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <CircularScore score={analysis.atsScore} label="ATS Score" />
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Score Range</p>
                  <p className="text-lg font-semibold text-slate-950 mt-1">
                    {getScoreLevel(analysis.atsScore) === "green"
                      ? "Strong ATS fit"
                      : getScoreLevel(analysis.atsScore) === "yellow"
                      ? "Moderate ATS fit"
                      : "Needs ATS work"}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-[#10B981]/10 p-3 text-[#047857]">
                    80+ Green
                  </div>
                  <div className="rounded-lg bg-[#F59E0B]/10 p-3 text-[#B45309]">
                    60-79 Yellow
                  </div>
                  <div className="rounded-lg bg-[#EF4444]/10 p-3 text-[#B91C1C]">
                    Below 60 Red
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 text-center">
              <Sparkles className="w-10 h-10 text-[#2563EB] mx-auto mb-3" />
              <p className="text-slate-600">
                Upload a resume to generate ATS scoring and analysis.
              </p>
            </div>
          )}
        </div>
      </section>

      {analysis && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {analysisCards.map((card) => (
              <ScoreCard key={card.label} card={card} />
            ))}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[1fr_0.85fr] gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Job Match: Software Engineer
                  </h2>
                  <p className="text-sm text-slate-500">
                    Keyword and experience alignment for a Software Engineer role.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-center">
                <CircularScore
                  score={analysis.jobMatch}
                  label="Job Match Percentage"
                />
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Missing keywords
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {analysis.missingKeywords.slice(0, 8).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-[#F59E0B]/10 px-3 py-1.5 text-sm text-[#B45309]"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Found keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.foundKeywords.length ? (
                      analysis.foundKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-[#10B981]/10 px-3 py-1.5 text-sm text-[#047857]"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">
                        No major Software Engineer keywords detected yet.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#2563EB] p-6 text-white shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <Lightbulb className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Future AI Hook</h2>
              </div>
              <p className="text-blue-100 mb-5">
                The analysis is generated through a single analyzer function,
                so OpenAI or Gemini can replace the mock engine later without
                rewriting the UI.
              </p>
              <div className="rounded-xl bg-white/10 p-4 text-sm text-blue-50">
                Next API target: send extracted resume text and target job
                description, then map the response into the ResumeAnalysis type.
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                <h2 className="text-lg font-semibold text-slate-950">
                  Missing Skills
                </h2>
              </div>
              <div className="space-y-3">
                {analysis.missingSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                  >
                    <span className="text-slate-700">{skill}</span>
                    <ArrowRight className="w-4 h-4 text-[#2563EB]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <h2 className="text-lg font-semibold text-slate-950">
                  Strengths
                </h2>
              </div>
              <div className="space-y-3">
                {analysis.strengths.map((strength) => (
                  <div key={strength} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-600">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-[#EF4444]" />
                <h2 className="text-lg font-semibold text-slate-950">
                  Weaknesses
                </h2>
              </div>
              <div className="space-y-3">
                {analysis.weaknesses.map((weakness) => (
                  <div key={weakness} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#EF4444] mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-600">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Recommendations
                </h2>
                <p className="text-sm text-slate-500">
                  Practical actions to improve recruiter and ATS performance.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.suggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-slate-700">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
