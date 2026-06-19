import { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Download,
  Eye,
} from "lucide-react";

const analysisResults = {
  overallScore: 85,
  sections: [
    { name: "Format & Structure", score: 90, status: "excellent" },
    { name: "Content Quality", score: 85, status: "good" },
    { name: "Keywords & ATS", score: 80, status: "good" },
    { name: "Work Experience", score: 88, status: "excellent" },
    { name: "Skills Section", score: 82, status: "good" },
    { name: "Education", score: 95, status: "excellent" },
  ],
  strengths: [
    "Clear and professional formatting",
    "Strong technical skills highlighted",
    "Quantified achievements in work experience",
    "Well-organized sections",
    "ATS-friendly format",
  ],
  improvements: [
    "Add more industry-specific keywords",
    "Include metrics in project descriptions",
    "Expand on leadership experiences",
    "Add a professional summary section",
    "Include relevant certifications",
  ],
  keywords: {
    present: [
      "JavaScript",
      "React",
      "Python",
      "Team Leadership",
      "Project Management",
    ],
    missing: [
      "Agile",
      "Scrum",
      "CI/CD",
      "Cloud Computing",
      "Data Analysis",
    ],
  },
};

const templates = [
  {
    name: "Modern Professional",
    preview: "📄",
    suitable: "Software Engineers, Designers",
    color: "from-[#2563EB] to-[#1D4ED8]",
  },
  {
    name: "Clean Minimalist",
    preview: "📋",
    suitable: "Business Analysts, Consultants",
    color: "from-[#10B981] to-[#059669]",
  },
  {
    name: "Creative Portfolio",
    preview: "🎨",
    suitable: "UI/UX Designers, Creative Roles",
    color: "from-[#F59E0B] to-[#D97706]",
  },
  {
    name: "Executive Classic",
    preview: "💼",
    suitable: "Management, Senior Positions",
    color: "from-[#8B5CF6] to-[#7C3AED]",
  },
];

export function ResumeAnalyzer() {
  const [hasResume, setHasResume] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2 text-white">Resume Analyzer</h1>
        <p className="text-[#94A3B8]">
          AI-powered resume analysis and optimization
        </p>
      </div>

      {!hasResume ? (
        /* Upload Section */
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl text-white mb-4">Upload Your Resume</h2>
            <p className="text-[#94A3B8] mb-8">
              Get instant AI-powered feedback on your resume. Supports PDF,
              DOC, and DOCX formats.
            </p>
            <div className="border-2 border-dashed border-[#334155] rounded-xl p-12 mb-6 hover:border-[#2563EB] transition-all cursor-pointer">
              <FileText className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
              <p className="text-white mb-2">
                Drag and drop your resume here
              </p>
              <p className="text-sm text-[#94A3B8] mb-4">or</p>
              <button
                onClick={() => setHasResume(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/50 transition-all"
              >
                Browse Files
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-[#94A3B8]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                ATS Score Analysis
              </div>
              <div className="flex items-center gap-2 text-[#94A3B8]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Keyword Optimization
              </div>
              <div className="flex items-center gap-2 text-[#94A3B8]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Format Checking
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Analysis Results */
        <>
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                  <h2 className="text-2xl text-white">
                    Resume Analysis Complete
                  </h2>
                </div>
                <p className="text-blue-100 mb-4">
                  Your resume has been analyzed using AI
                </p>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors">
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                    <Eye className="w-4 h-4" />
                    View Resume
                  </button>
                </div>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center bg-white/10">
                  <div className="text-center">
                    <div className="text-4xl text-white mb-1">
                      {analysisResults.overallScore}
                    </div>
                    <div className="text-sm text-blue-100">Overall Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Scores */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <h3 className="text-xl text-white mb-6">Section Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisResults.sections.map((section) => (
                <div
                  key={section.name}
                  className="bg-[#0F172A] rounded-lg p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white">{section.name}</h4>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        section.status === "excellent"
                          ? "bg-[#10B981]/20 text-[#10B981]"
                          : "bg-[#F59E0B]/20 text-[#F59E0B]"
                      }`}
                    >
                      {section.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="w-full bg-[#1E293B] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            section.score >= 85
                              ? "bg-gradient-to-r from-[#10B981] to-[#059669]"
                              : "bg-gradient-to-r from-[#F59E0B] to-[#D97706]"
                          }`}
                          style={{ width: `${section.score}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-white text-lg">{section.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                <h3 className="text-xl text-white">Strengths</h3>
              </div>
              <ul className="space-y-3">
                {analysisResults.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full mt-2"></div>
                    <span className="text-[#94A3B8]">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
                <h3 className="text-xl text-white">Suggested Improvements</h3>
              </div>
              <ul className="space-y-3">
                {analysisResults.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                    <span className="text-[#94A3B8]">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Keywords Analysis */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <h3 className="text-xl text-white mb-6">
              ATS Keywords Analysis
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  Present Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.keywords.present.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[#10B981]/20 text-[#10B981] rounded-lg text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.keywords.missing.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[#F59E0B]/20 text-[#F59E0B] rounded-lg text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resume Templates */}
          <div>
            <h3 className="text-xl text-white mb-6">
              Professional Resume Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div
                  key={template.name}
                  className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#2563EB] transition-all cursor-pointer group"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center text-3xl mb-4`}
                  >
                    {template.preview}
                  </div>
                  <h4 className="text-white mb-2">{template.name}</h4>
                  <p className="text-sm text-[#94A3B8] mb-4">
                    {template.suitable}
                  </p>
                  <button className="w-full py-2 bg-[#0F172A] border border-[#334155] text-white rounded-lg group-hover:bg-gradient-to-r group-hover:from-[#2563EB] group-hover:to-[#1D4ED8] group-hover:border-transparent transition-all">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl p-6">
            <h3 className="text-xl text-white mb-4">💡 Pro Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white mb-2">Tailor for Each Job</h4>
                <p className="text-sm text-green-100">
                  Customize your resume for each application
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white mb-2">Quantify Achievements</h4>
                <p className="text-sm text-green-100">
                  Use numbers and metrics to show impact
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white mb-2">Keep it Concise</h4>
                <p className="text-sm text-green-100">
                  Aim for 1-2 pages maximum
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
